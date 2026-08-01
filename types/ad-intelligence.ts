// 1. Interface cho Nhà quảng cáo
export interface AdvertiserData {
  id?: string;
  advertiserId: string;
  name: string;
  domain?: string | null;
  verifiedStatus?: boolean;
  isTracked?: boolean;
  activeAdsCount?: number;
  totalAdsCount?: number;
  targetRegions?: string[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface SearchSnapshotData {
  id?: string;
  query: string;
  country: string;
  source?: string;
  targetDomain?: string | null;
  totalResults?: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

// 2. Interface cho Bài quảng cáo
export interface AdCreativeData {
  id?: string;
  adId: string;
  advertiserId: string;
  advertiserName: string;
  format: 'SEARCH' | 'DISPLAY' | 'YOUTUBE' | 'SHOPPING' | string;
  status: 'ACTIVE' | 'INACTIVE' | string;
  headline?: string | null;
  bodyText?: string | null;
  mediaUrl?: string | null;
  detailsLink?: string | null;
  targetDomain?: string | null;
  width?: number | null;
  height?: number | null;
  firstSeen: string | Date;
  lastSeen: string | Date;
  longevityDays: number;
  totalDaysShown?: number;
  targetCountries?: string[];
  isTracked?: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  isNewDetected?: boolean;
}

// 3. Interface cho Thống kê KPI
export interface KPIStats {
  totalAdvertisers: number;
  totalAdCreatives: number;
  totalResults?: number;
  avgLongevity?: number;
}

// =================================================================
// 4. ALIAS TƯƠNG THÍCH NGƯỢC (BACKWARD COMPATIBILITY)
// Giúp các file cũ (như route.NEW.ts) không bị báo lỗi khi build
// =================================================================
export type Advertiser = AdvertiserData;
export type Creative = AdCreativeData;