import { prisma } from "@/lib/prisma";
import type { Advertiser, Creative } from "@/types/ad-intelligence";

type StandardSearchResponse = {
  success: boolean;
  kpis: { advertisersCount: number; adsCount: number };
  advertisers: Advertiser[];
  creatives: Creative[];
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

    if (!q) {
      const empty: StandardSearchResponse = {
        success: true,
        kpis: { advertisersCount: 0, adsCount: 0 },
        advertisers: [],
        creatives: [],
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
      take: 50,
    });

    const kpis = {
      advertisersCount: advertisers.length,
      adsCount: creatives.length,
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
        firstSeen: c.firstSeen?.toISOString?.() ?? new Date().toISOString(),
        lastSeen: c.lastSeen?.toISOString?.() ?? new Date().toISOString(),
        longevityDays: c.longevityDays,
        targetCountries: c.targetCountries ?? [],
      })),
      meta: { query: q, source: "local", limit: 50 },
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
