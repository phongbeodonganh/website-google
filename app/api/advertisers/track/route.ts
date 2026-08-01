import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const advertiserId = String(body.advertiserId || "").trim();
    const isTracked = Boolean(body.isTracked);

    if (!advertiserId) {
      return NextResponse.json(
        { success: false, error: "advertiserId không được để trống" },
        { status: 400 }
      );
    }

    const advertiser = await prisma.advertiser.update({
      where: { advertiserId },
      data: { isTracked, updatedAt: new Date() },
    });

    return NextResponse.json({
      success: true,
      advertiser,
      message: isTracked ? "Đã theo dõi nhà quảng cáo." : "Đã bỏ theo dõi nhà quảng cáo.",
    });
  } catch (error: any) {
    console.error("Advertiser tracking failed:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Không thể cập nhật trạng thái theo dõi" },
      { status: 500 }
    );
  }
}
