import { prisma } from "@/lib/prisma";
import type { Advertiser, Creative } from "@/types/ad-intelligence";

type StandardSearchResponse = {
  success: boolean;
  kpis: { advertisersCount: number; adsCount: number };
  advertisers: Advertiser[];
  creatives: Creative[];
  analytics?: {
    totalResults: number;
    uniqueAdvertisers: number;
    avgLongevity: number;
    activeRatio: number;
    topAdvertisers: Array<{ advertiserName: string; adCount: number; totalDaysShown: number }>;
    formatDistribution: Record<string, number>;
    dimensionDistribution: Record<string, number>;
    timeline: Array<{ month: string; count: number }>;
    longestRunningAds: Array<{ adId: string; advertiserName: string; longevityDays: number; totalDaysShown: number; detailsLink?: string | null }>;
  };
  meta?: {
    query?: string;
    country?: string;
    source?: "local" | "serpapi";
    limit?: number;
  };
  error?: { code: string; message: string; detail?: string };
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") ?? "").trim();
    const country = (searchParams.get("region") ?? "GLOBAL").trim().toUpperCase();

    if (!q) {
      const empty: StandardSearchResponse = {
        success: true,
        kpis: { advertisersCount: 0, adsCount: 0 },
        advertisers: [],
        creatives: [],
        analytics: {
          totalResults: 0,
          uniqueAdvertisers: 0,
          avgLongevity: 0,
          activeRatio: 0,
          topAdvertisers: [],
          formatDistribution: { SEARCH: 0, DISPLAY: 0, YOUTUBE: 0, SHOPPING: 0 },
          dimensionDistribution: {},
          timeline: [],
          longestRunningAds: [],
        },
        meta: { query: "", source: "local", limit: 50 },
      };

      return new Response(JSON.stringify(empty), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    }

    const advertisers = await prisma.advertiser.findMany({
      where: {
        OR: [
          { advertiserId: q },
          { name: { contains: q, mode: "insensitive" } },
          { domain: { contains: q, mode: "insensitive" } },
        ],
      },
      orderBy: { updatedAt: "desc" },
      take: 50,
    });

    const creatives = await prisma.adCreative.findMany({
      where: {
        OR: [
          { adId: q },
          { advertiserId: q },
          { advertiserName: { contains: q, mode: "insensitive" } },
          { headline: { contains: q, mode: "insensitive" } },
          { bodyText: { contains: q, mode: "insensitive" } },
        ],
      },
      orderBy: { updatedAt: "desc" },
      take: 100,
    });

    const savedSnapshot = await prisma.searchSnapshot.findFirst({
      where: {
        query: q,
        country,
        source: "serpapi",
      },
      select: { totalResults: true },
    });

    const totalResults = savedSnapshot?.totalResults ?? 0;

    const kpis = {
      advertisersCount: advertisers.length,
      adsCount: creatives.length,
    };

    const avgLongevity = creatives.length
      ? Math.round(creatives.reduce((sum, creative) => sum + (creative.longevityDays || 0), 0) / creatives.length)
      : 0;

    const activeCount = creatives.filter((creative) => creative.status === "ACTIVE").length;
    const activeRatio = creatives.length ? Math.round((activeCount / creatives.length) * 100) : 0;

    const topAdvertisers = Object.entries(
      creatives.reduce<Record<string, { advertiserName: string; adCount: number; totalDaysShown: number }>>((acc, creative) => {
        const advertiserName = creative.advertiserName || "Unknown Advertiser";
        acc[advertiserName] ??= { advertiserName, adCount: 0, totalDaysShown: 0 };
        acc[advertiserName].adCount += 1;
        acc[advertiserName].totalDaysShown += creative.totalDaysShown ?? creative.longevityDays ?? 0;
        return acc;
      }, {})
    )
      .map(([, value]) => value)
      .sort((a, b) => b.adCount - a.adCount || b.totalDaysShown - a.totalDaysShown)
      .slice(0, 5);

    const formatDistribution = creatives.reduce<Record<string, number>>((acc, creative) => {
      acc[creative.format] = (acc[creative.format] || 0) + 1;
      return acc;
    }, {});

    const dimensionDistribution = creatives.reduce<Record<string, number>>((acc, creative) => {
      const key = creative.width && creative.height ? `${creative.width}x${creative.height}` : "UNKNOWN";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const timeline = creatives.reduce<Record<string, number>>((acc, creative) => {
      const key = new Date(creative.firstSeen).toISOString().slice(0, 7);
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const longestRunningAds = creatives
      .slice()
      .sort((a, b) => (b.totalDaysShown ?? b.longevityDays ?? 0) - (a.totalDaysShown ?? a.longevityDays ?? 0))
      .slice(0, 5)
      .map((creative) => ({
        adId: creative.adId,
        advertiserName: creative.advertiserName,
        longevityDays: creative.longevityDays,
        totalDaysShown: creative.totalDaysShown ?? creative.longevityDays ?? 0,
        detailsLink: creative.detailsLink,
      }));

    const analytics = {
      totalResults,
      uniqueAdvertisers: new Set(creatives.map((creative) => creative.advertiserId)).size,
      avgLongevity,
      activeRatio,
      topAdvertisers,
      formatDistribution,
      dimensionDistribution,
      timeline: Object.entries(timeline)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([month, count]) => ({ month, count })),
      longestRunningAds,
    };

    const payload: StandardSearchResponse = {
      success: true,
      kpis,
      advertisers: (advertisers ?? []).map((a: any): Advertiser => ({
        advertiserId: a.advertiserId,
        name: a.name,
        domain: a.domain,
        verifiedStatus: a.verifiedStatus,
        activeAdsCount: a.activeAdsCount,
        totalAdsCount: a.totalAdsCount,
        targetRegions: a.targetRegions ?? [],
        isTracked: a.isTracked ?? false,
      })),
      creatives: (creatives ?? []).map((c: any): Creative => ({
        adId: c.adId,
        advertiserId: c.advertiserId,
        advertiserName: c.advertiserName,
        format: c.format,
        status: c.status,
        headline: c.headline,
        bodyText: c.bodyText,
        mediaUrl: c.mediaUrl,
        detailsLink: c.detailsLink,
        targetDomain: c.targetDomain,
        width: c.width,
        height: c.height,
        firstSeen: c.firstSeen?.toISOString?.() ?? new Date().toISOString(),
        lastSeen: c.lastSeen?.toISOString?.() ?? new Date().toISOString(),
        longevityDays: c.longevityDays,
        totalDaysShown: c.totalDaysShown ?? c.longevityDays ?? 0,
        targetCountries: c.targetCountries ?? [],
        isTracked: c.isTracked ?? false,
      })),
      analytics,
      meta: { query: q, source: "local", limit: 50, country },
    };

    return new Response(JSON.stringify(payload), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({
        success: false,
        kpis: { advertisersCount: 0, adsCount: 0 },
        advertisers: [],
        creatives: [],
        meta: { source: "local" },
        error: {
          code: "LOCAL_SEARCH_FAILED",
          message: "Local search failed",
          detail: (e as Error).message,
        },
      }),
      {
        status: 500,
        headers: { "content-type": "application/json" },
      }
    );
  }
}
