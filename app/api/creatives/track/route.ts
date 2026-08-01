import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const adId = String(body.adId || "").trim();
    const isTracked = Boolean(body.isTracked);

    if (!adId) {
      return NextResponse.json(
        { success: false, error: "adId không được để trống" },
        { status: 400 }
      );
    }

    const creative = await prisma.adCreative.update({
      where: { adId },
      data: { isTracked, updatedAt: new Date() },
    });

    return NextResponse.json({
      success: true,
      creative,
      message: isTracked ? "Đã lưu bài quảng cáo để theo dõi." : "Đã bỏ lưu bài quảng cáo.",
    });
  } catch (error: any) {
    console.error("Creative tracking failed:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Không thể cập nhật trạng thái lưu trữ bài quảng cáo" },
      { status: 500 }
    );
  }
}
