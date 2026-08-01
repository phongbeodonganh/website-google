import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") ?? "").trim();

    if (!q) {
      return new Response(
        JSON.stringify({
          success: false,
          error: { code: "BAD_REQUEST", message: "Missing q" },
        }),
        { status: 400, headers: { "content-type": "application/json" } }
      );
    }

    const advertiserMatches = await prisma.advertiser.count({
      where: {
        OR: [
          { advertiserId: q },
          { name: { contains: q, mode: "insensitive" } },
          { domain: { contains: q, mode: "insensitive" } },
        ],
      },
    });

    const creativeMatches = await prisma.adCreative.count({
      where: {
        OR: [
          { adId: q },
          { advertiserId: q },
          { advertiserName: { contains: q, mode: "insensitive" } },
          { headline: { contains: q, mode: "insensitive" } },
          { bodyText: { contains: q, mode: "insensitive" } },
        ],
      },
    });

    const advertisersSample = await prisma.advertiser.findMany({
      where: {
        OR: [
          { advertiserId: q },
          { name: { contains: q, mode: "insensitive" } },
          { domain: { contains: q, mode: "insensitive" } },
        ],
      },
      orderBy: { updatedAt: "desc" },
      take: 3,
      select: {
        advertiserId: true,
        name: true,
        domain: true,
        verifiedStatus: true,
        targetRegions: true,
        updatedAt: true,
      },
    });

    const creativesSample = await prisma.adCreative.findMany({
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
      take: 3,
      select: {
        adId: true,
        advertiserId: true,
        advertiserName: true,
        format: true,
        status: true,
        headline: true,
        bodyText: true,
        firstSeen: true,
        lastSeen: true,
        longevityDays: true,
        targetCountries: true,
        updatedAt: true,
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        query: q,
        counts: {
          advertisersMatched: advertiserMatches,
          creativesMatched: creativeMatches,
        },
        advertisersSample,
        creativesSample: creativesSample.map((c) => ({
          ...c,
          firstSeen: c.firstSeen.toISOString(),
          lastSeen: c.lastSeen.toISOString(),
        })),
      }),
      { status: 200, headers: { "content-type": "application/json" } }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({
        success: false,
        error: { code: "DEBUG_LOCAL_FAILED", message: (e as Error).message },
      }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }
}
