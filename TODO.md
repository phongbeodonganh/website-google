<![CDATA[# TODO - Tìm kiếm & chuẩn hóa API

## Mục tiêu
- Đảm bảo “tìm kiếm” ổn định, đúng country, không crash
- Chuẩn hóa contract response giữa FE và cả 2 API (local/live)
- Tối ưu performance cho live
- Chuẩn hóa identity để tránh dữ liệu trùng/không ổn định

## Các bước theo thứ tự ưu tiên
1. Chuẩn hóa response format cho `/api/search/local` và `/api/search/live`
   - Luôn trả `{ success, kpis, advertisers, creatives, meta, error? }`
   - Chuẩn hóa error shape + status code
   - Cập nhật type nếu cần

2. Sửa FE (`app/dashboard/page.tsx`)
   - Check `res.ok` trước khi `res.json()`
   - Hiển thị lỗi rõ ràng thay vì im lặng
   - Giảm `any` cho event và mapping creatives (dùng type `Creative`)

3. Sửa Live identity (`app/api/search/live/route.ts`)
   - Bỏ random fallback cho `adId`/`advId`
   - Nếu thiếu adId: skip creative (tránh dữ liệu trôi/không ổn định)

4. Tối ưu Live hiệu năng (`app/api/search/live/route.ts`)
   - Prefetch existing creatives theo `adIds` để tránh N+1 `findUnique`
   - Dùng `Set` để xác định `isNewDetected`

5. Chuẩn hóa country filtering trong Local (`app/api/search/local/route.ts`)
   - Local lọc creatives theo `targetCountries/targetRegions` theo `q`/country (consistent policy)

## Trạng thái
- 1/5: Pending
- 2/5: Pending
- 3/5: Pending
- 4/5: Pending
- 5/5: Pending
]]>
