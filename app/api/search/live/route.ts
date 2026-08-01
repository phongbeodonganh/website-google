import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Bảng ánh xạ Region Code -> SerpApi Region ID dạng số
const REGION_MAP: Record<string, string | null> = {
  VN: '2704',   // Việt Nam
  US: '2840',   // Mỹ
  GLOBAL: null, // Toàn cầu
};

function mapSerpFormatToDashboard(format?: string): string {
  const value = (format || 'text').toLowerCase();

  if (value === 'text') return 'SEARCH';
  if (value === 'image') return 'DISPLAY';
  if (value === 'video') return 'YOUTUBE';

  return 'DISPLAY';
}

// Hàm gửi request truy vấn SerpApi
async function fetchSerpApi(apiKey: string, params: Record<string, string>) {
  const url = new URL('https://serpapi.com/search.json');
  url.searchParams.append('engine', 'google_ads_transparency_center');
  url.searchParams.append('api_key', apiKey);

  Object.entries(params).forEach(([k, v]) => {
    if (v) url.searchParams.append(k, v);
  });

  console.log('🌐 [SERPAPI REQUEST]:', url.toString());
  try {
    const res = await fetch(url.toString(), { method: 'GET' });
    const data = await res.json();
    return { ok: res.ok && !data.error, status: res.status, data, error: data.error };
  } catch (err: any) {
    return { ok: false, status: 500, data: null, error: err.message };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const rawKeyword = (body.q ?? body.keyword ?? '').toString().trim();
    const region = (body.country ?? body.region ?? 'GLOBAL').toString().trim().toUpperCase();

    if (!rawKeyword) {
      return NextResponse.json(
        { success: false, error: 'Từ khóa tìm kiếm không được để trống' },
        { status: 400 }
      );
    }

    const apiKey = process.env.SERPAPI_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'Chưa cấu hình SERPAPI_KEY trong .env.local' },
        { status: 500 }
      );
    }

    const regionId = REGION_MAP[region] || '';
    const isAdvId = /^AR\d+/i.test(rawKeyword);
    const isDomain = rawKeyword.includes('.') && !rawKeyword.includes(' ');

    // Tạo danh sách các phương án tìm kiếm (Search Strategies)
    const searchStrategies: Record<string, string>[] = [];

    if (isAdvId) {
      searchStrategies.push({ advertiser_id: rawKeyword });
    } else if (isDomain) {
      searchStrategies.push({ domain: rawKeyword });
      searchStrategies.push({ text: rawKeyword });
    } else {
      // Nhập từ khóa thường (VD: "shopee") -> Thử lần lượt Text, Domain .vn, Domain .com
      searchStrategies.push({ text: rawKeyword });
      searchStrategies.push({ domain: `${rawKeyword}.vn` });
      searchStrategies.push({ domain: `${rawKeyword}.com` });
    }

    let serpData: any = null;
    let successfulCall = false;

    // Thử lần lượt các chiến lược cào dữ liệu
    for (const strat of searchStrategies) {
      const params = { ...strat };
      if (regionId) params.region = regionId;

      let result = await fetchSerpApi(apiKey, params);

      // Nếu lọc theo Region bị rỗng -> Thử bỏ Region để lấy Global
      if (!result.ok && regionId) {
        delete params.region;
        result = await fetchSerpApi(apiKey, params);
      }

      if (result.ok && result.data) {
        const ads = result.data.ad_creatives || result.data.ads || result.data.search_results || [];
        const advs = result.data.advertisers || [];

        if (ads.length > 0 || advs.length > 0) {
          serpData = result.data;
          successfulCall = true;
          console.log(`✅ [SERPAPI SUCCESS] Tìm thấy dữ liệu với chiến lược:`, strat);
          break;
        }
      }
    }

    if (!successfulCall || !serpData) {
      return NextResponse.json(
        {
          success: false,
          error: `Google Ads Transparency Center không tìm thấy quảng cáo cho từ khóa "${rawKeyword}". Gợi ý: Hãy nhập Tên miền chính xác (như shopee.vn, shopee.com, namecheap.com) hoặc Advertiser ID (như AR1203...)`,
        },
        { status: 404 }
      );
    }

    // Thu thập dữ liệu bài QC và Nhà quảng cáo
    let rawAds: any[] = serpData.ad_creatives || serpData.ads || serpData.search_results || serpData.ad_results || [];
    const foundAdvertisers: any[] = serpData.advertisers || serpData.advertiser_results || [];

    // Nếu chỉ trả về Advertiser -> Gọi tiếp lượt 2 lấy bài QC của Advertiser đó
    if (rawAds.length === 0 && foundAdvertisers.length > 0) {
      const advId = foundAdvertisers[0].advertiser_id || foundAdvertisers[0].id;
      if (advId) {
        console.log(`🎯 Đang cào bài QC cho Advertiser ID: ${advId}`);
        const advParams: Record<string, string> = { advertiser_id: advId };
        if (regionId) advParams.region = regionId;

        const advRes = await fetchSerpApi(apiKey, advParams);
        if (advRes.ok && advRes.data) {
          rawAds = advRes.data.ad_creatives || advRes.data.ads || advRes.data.search_results || advRes.data.ad_results || [];
        }
      }
    }

    let insertedCount = 0;
    let updatedCount = 0;
    const processedCreatives = [];
    const advertisersMap = new Map();

    const searchSnapshot = await prisma.searchSnapshot.upsert({
      where: {
        query_country_source: {
          query: rawKeyword,
          country: region,
          source: 'serpapi',
        },
      },
      update: {
        targetDomain: rawKeyword,
        totalResults: Number(serpData.search_information?.total_results || 0),
        updatedAt: new Date(),
      },
      create: {
        query: rawKeyword,
        country: region,
        source: 'serpapi',
        targetDomain: rawKeyword,
        totalResults: Number(serpData.search_information?.total_results || 0),
      },
    });

    // 1. Lưu danh sách Advertisers vào CSDL PostgreSQL
    for (const adv of foundAdvertisers) {
      const aId = adv.advertiser_id || adv.id || `ADV_${Date.now()}`;
      const aName = adv.name || adv.advertiser_name || rawKeyword;

      const savedAdv = await prisma.advertiser.upsert({
        where: { advertiserId: aId },
        update: { name: aName, updatedAt: new Date() },
        create: {
          advertiserId: aId,
          name: aName,
          domain: adv.domain || null,
          verifiedStatus: adv.is_verified || false,
          targetRegions: region !== 'GLOBAL' ? [region] : ['VN', 'US'],
        },
      });
      advertisersMap.set(aId, savedAdv);
    }

    // 2. Lưu danh sách AdCreatives vào CSDL PostgreSQL
    for (const item of rawAds) {
      const advId = item.advertiser_id || item.advertiser?.id || `ADV_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      const advName = item.advertiser || item.advertiser_name || item.advertiser?.name || item.domain || rawKeyword || 'Unknown Advertiser';
      const adId = item.ad_creative_id || item.ad_id || item.creative_id || `AD_${Math.random().toString(36).substring(2, 11)}`;

      const savedAdv = await prisma.advertiser.upsert({
        where: { advertiserId: advId },
        update: { name: advName, updatedAt: new Date() },
        create: {
          advertiserId: advId,
          name: advName,
          domain: item.target_domain || item.domain || null,
          verifiedStatus: Boolean(item.is_verified || false),
          targetRegions: region !== 'GLOBAL' ? [region] : ['VN', 'US'],
        },
      });
      advertisersMap.set(advId, savedAdv);

      const firstSeenTs = Number(item.first_shown ?? item.first_seen ?? 0);
      const lastSeenTs = Number(item.last_shown ?? item.last_seen ?? 0);
      const firstSeen = firstSeenTs > 0 ? new Date(firstSeenTs * 1000) : new Date(Date.now() - 86400000 * 7);
      const lastSeen = lastSeenTs > 0 ? new Date(lastSeenTs * 1000) : new Date();
      const diffTime = Math.abs(lastSeen.getTime() - firstSeen.getTime());
      const computedLongevityDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
      const totalDaysShown = Number(item.total_days_shown ?? item.totalDaysShown ?? 0);
      const longevityDays = totalDaysShown > 0 ? Math.max(1, Math.round(totalDaysShown)) : computedLongevityDays;

      const format = mapSerpFormatToDashboard(item.format || item.type || 'text');
      const status = 'ACTIVE';
      const headline = item.headline || item.title || item.snippet || `${advName} • ${item.target_domain || rawKeyword}`;
      const bodyText = item.link || item.details_link || item.body || item.description || item.body_text || null;
      const mediaUrl = item.image || item.image_url || item.video_url || item.media_url || null;
      const detailsLink = item.details_link || item.serpapi_details_link || null;
      const width = Number.isFinite(Number(item.width)) ? Number(item.width) : null;
      const height = Number.isFinite(Number(item.height)) ? Number(item.height) : null;
      const targetCountries = item.target_countries || (region !== 'GLOBAL' ? [region] : ['GLOBAL']);

      const existingAd = await prisma.adCreative.findUnique({ where: { adId } });
      if (existingAd) updatedCount++;
      else insertedCount++;

      const savedCreative = await prisma.adCreative.upsert({
        where: { adId },
        update: {
          format,
          status,
          headline,
          bodyText,
          mediaUrl,
          detailsLink,
          targetDomain: item.target_domain || null,
          width,
          height,
          lastSeen,
          longevityDays,
          totalDaysShown,
          targetCountries,
          searchSnapshotId: searchSnapshot.id,
          updatedAt: new Date(),
        },
        create: {
          adId,
          advertiserId: advId,
          advertiserName: advName,
          format,
          status,
          headline,
          bodyText,
          mediaUrl,
          detailsLink,
          targetDomain: item.target_domain || null,
          width,
          height,
          firstSeen,
          lastSeen,
          longevityDays,
          totalDaysShown,
          targetCountries,
          searchSnapshotId: searchSnapshot.id,
        },
      });

      processedCreatives.push({
        ...savedCreative,
        detailsLink,
        isNewDetected: !existingAd,
      });
    }

    const advertisers = Array.from(advertisersMap.values());

    return NextResponse.json({
      success: true,
      creatives: processedCreatives,
      advertisers,
      kpis: {
        advertisersCount: advertisers.length,
        adsCount: processedCreatives.length,
      },
      data: processedCreatives,
      insertedCount,
      updatedCount,
      message: `Đã cào thành công ${processedCreatives.length} bài quảng cáo từ SerpApi`,
    });
  } catch (error: any) {
    console.error('Live SerpApi Search Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Lỗi khi gọi SerpApi' },
      { status: 500 }
    );
  }
}