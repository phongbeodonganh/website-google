"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import type { AdCreativeData, AdvertiserData, KPIStats } from "@/types/ad-intelligence";

// ============================================================================
// BỘ ICON SVG NGUYÊN BẢN (KHÔNG PHỤ THUỘC TẬP NGOÀI - TRÁNH LỖI TYPE 100%)
// ============================================================================
const Icon = {
  Search: ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  Sparkles: ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
  Building: ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  Layers: ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  ),
  Clock: ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Globe: ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0zM3.6 9h16.8M3.6 15h16.8M11.5 3a17 17 0 000 18M12.5 3a17 17 0 010 18" />
    </svg>
  ),
  ExternalLink: ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  ),
  X: ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  Eye: ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ),
  CheckCircle: ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  XCircle: ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Tv: ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="7" width="20" height="13" rx="2" ry="2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 2l-5 5-5-5" />
    </svg>
  ),
  LayoutGrid: ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
    </svg>
  ),
  FileText: ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  Calendar: ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><path strokeLinecap="round" strokeLinejoin="round" d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  ),
  TrendingUp: ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  BarChart3: ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 20V10M12 20V4M6 20v-6" />
    </svg>
  ),
  Filter: ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
    </svg>
  ),
  Copy: ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path strokeLinecap="round" strokeLinejoin="round" d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  ),
  Check: ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  ),
  AlertCircle: ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" />
    </svg>
  ),
  Loader: ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={`animate-spin ${className}`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  ),
  Zap: ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  )
};

type CountryOption = { label: string; value: string };

const countryOptions: CountryOption[] = [
  { label: "VN", value: "VN" },
  { label: "US", value: "US" },
  { label: "Global", value: "GLOBAL" },
];

export default function DashboardPage() {
  const [q, setQ] = useState("");
  const [country, setCountry] = useState("VN");
  const [formatFilter, setFormatFilter] = useState("ALL");
  const [activeTab, setActiveTab] = useState<"overview" | "advertisers" | "creatives">("overview");
  const [selectedAdvertiserId, setSelectedAdvertiserId] = useState<string | null>(null);
  const [advertiserSearch, setAdvertiserSearch] = useState("");
  const [advertiserStatusFilter, setAdvertiserStatusFilter] = useState("ALL");
  const [advertiserFormatFilter, setAdvertiserFormatFilter] = useState("ALL");
  const [advertiserSort, setAdvertiserSort] = useState({ key: "totalDaysShown", direction: "desc" } as { key: "name" | "adsCount" | "totalDaysShown" | "avgLongevity" | "lastSeen"; direction: "asc" | "desc" });
  const [creativeAdvertiserFilter, setCreativeAdvertiserFilter] = useState("ALL");
  const [creativeFormatFilter, setCreativeFormatFilter] = useState("ALL");
  const [creativeStatusFilter, setCreativeStatusFilter] = useState("ALL");
  const [creativeDimensionFilter, setCreativeDimensionFilter] = useState("ALL");
  const [creativeSortBy, setCreativeSortBy] = useState("longevity");
  const [loadingLocal, setLoadingLocal] = useState(false);
  const [loadingLive, setLoadingLive] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null as string | null);
  const [localAdvertisers, setLocalAdvertisers] = useState([] as AdvertiserData[]);
  const [analyticsSummary, setAnalyticsSummary] = useState({
    totalResults: 0,
    uniqueAdvertisers: 0,
    avgLongevity: 0,
    activeRatio: 0,
    topAdvertisers: [] as Array<{ advertiserName: string; adCount: number; totalDaysShown: number }>,
    formatDistribution: { SEARCH: 0, DISPLAY: 0, YOUTUBE: 0, SHOPPING: 0 } as Record<string, number>,
    dimensionDistribution: {} as Record<string, number>,
    timeline: [] as Array<{ month: string; count: number }>,
    longestRunningAds: [] as Array<{ adId: string; advertiserName: string; longevityDays: number; totalDaysShown: number; detailsLink?: string | null }>,
  });

  // Modal State
  const [selectedAd, setSelectedAd] = useState(null as AdCreativeData | null);
  const [copiedText, setCopiedText] = useState(false);

  // Data States
  const [localCreatives, setLocalCreatives] = useState([] as AdCreativeData[]);
  const [localKpis, setLocalKpis] = useState({ totalAdvertisers: 0, totalAdCreatives: 0 } as KPIStats);

  const [liveCreatives, setLiveCreatives] = useState([] as AdCreativeData[]);

  // Fetch Local Data
  const fetchLocalData = useCallback(async (keyword: string, region: string) => {
    setLoadingLocal(true);
    setErrorMessage(null);
    try {
      const res = await fetch(`/api/search/local?q=${encodeURIComponent(keyword)}&region=${region}`);
      const json = await res.json();
      if (json.success) {
        setLocalAdvertisers(json.advertisers || []);
        setLocalCreatives(json.data || json.creatives || []);
        setLocalKpis({
          totalAdvertisers: json.kpis?.advertisersCount ?? json.kpi?.totalAdvertisers ?? 0,
          totalAdCreatives: json.kpis?.adsCount ?? json.kpi?.totalAdCreatives ?? 0,
        });
        setAnalyticsSummary(json.analytics || {
          totalResults: 0,
          uniqueAdvertisers: 0,
          avgLongevity: 0,
          activeRatio: 0,
          topAdvertisers: [],
          formatDistribution: { SEARCH: 0, DISPLAY: 0, YOUTUBE: 0, SHOPPING: 0 },
          dimensionDistribution: {},
          timeline: [],
          longestRunningAds: [],
        });
      } else {
        setErrorMessage(json.error || "Không thể tải dữ liệu local.");
      }
    } catch (err: any) {
      setErrorMessage("Không thể kết nối đến CSDL PostgreSQL nội bộ.");
    } finally {
      setLoadingLocal(false);
    }
  }, []);

  useEffect(() => {
    fetchLocalData("", country);
  }, [fetchLocalData, country]);

  // Fetch Live SerpApi Data
  const onCheckNewViaSerp = async () => {
    const keyword = q.trim();
    if (!keyword) {
      setErrorMessage("Vui lòng nhập từ khóa hoặc ID Nhà quảng cáo trước khi quét!");
      return;
    }

    setLoadingLive(true);
    setErrorMessage(null);

    try {
      const res = await fetch(`/api/search/live`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q: keyword, country }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Live search failed");
      }

      setLiveCreatives(json.data || json.creatives || []);
      fetchLocalData(keyword, country);
    } catch (err: any) {
      setErrorMessage(err.message || "Không thể kiểm tra dữ liệu live.");
    } finally {
      setLoadingLive(false);
    }
  };

  // Calculated Analytics Report Data
  const analyticsReport = useMemo(() => {
    const allData = [...localCreatives, ...liveCreatives];
    if (allData.length === 0) {
      return { avgLongevity: 0, activeRatio: 0, formats: { SEARCH: 0, DISPLAY: 0, YOUTUBE: 0, SHOPPING: 0 } };
    }

    const totalLongevity = allData.reduce((acc, curr) => acc + (curr.longevityDays || 1), 0);
    const avgLongevity = Math.round(totalLongevity / allData.length);

    const activeCount = allData.filter((a) => a.status === "ACTIVE").length;
    const activeRatio = Math.round((activeCount / allData.length) * 100);

    const formats = {
      SEARCH: allData.filter((a) => a.format === "SEARCH").length,
      DISPLAY: allData.filter((a) => a.format === "DISPLAY").length,
      YOUTUBE: allData.filter((a) => a.format === "YOUTUBE").length,
      SHOPPING: allData.filter((a) => a.format === "SHOPPING").length,
    };

    return { avgLongevity, activeRatio, formats };
  }, [localCreatives, liveCreatives]);

  const advertiserRows = useMemo(() => {
    const combined = [...localCreatives, ...liveCreatives];

    return localAdvertisers.map((advertiser) => {
      const advertiserAds = combined.filter((ad) => ad.advertiserId === advertiser.advertiserId);
      const adsCount = advertiserAds.length;
      const activeAds = advertiserAds.filter((ad) => ad.status === "ACTIVE").length;
      const totalDaysShown = advertiserAds.reduce((sum, ad) => sum + (ad.totalDaysShown ?? ad.longevityDays ?? 0), 0);
      const avgLongevity = adsCount > 0 ? Math.round(advertiserAds.reduce((sum, ad) => sum + (ad.longevityDays || 0), 0) / adsCount) : 0;
      const lastSeen = advertiserAds.reduce((latest, ad) => {
        const current = new Date(ad.lastSeen).getTime();
        return current > latest ? current : latest;
      }, 0);
      const strongestFormat = advertiserAds.reduce<Record<string, number>>((acc, ad) => {
        acc[ad.format] = (acc[ad.format] || 0) + 1;
        return acc;
      }, {});
      const topFormat = Object.entries(strongestFormat).sort(([, a], [, b]) => b - a)[0]?.[0] || "SEARCH";
      const recentStatus = activeAds > 0 ? "ACTIVE" : "INACTIVE";

      return {
        ...advertiser,
        adsCount,
        totalDaysShown,
        avgLongevity,
        lastSeen,
        strongestFormat: topFormat,
        status: recentStatus,
      };
    });
  }, [localAdvertisers, localCreatives, liveCreatives]);

  const sortedAdvertiserRows = useMemo(() => {
    const filtered = advertiserRows.filter((row) => {
      const matchesSearch = row.name.toLowerCase().includes(advertiserSearch.toLowerCase());
      const matchesStatus = advertiserStatusFilter === "ALL" || row.status === advertiserStatusFilter;
      const matchesFormat =
        advertiserFormatFilter === "ALL" ||
        (advertiserFormatFilter === "VIDEO" && row.strongestFormat === "YOUTUBE") ||
        (advertiserFormatFilter === "IMAGE" && row.strongestFormat === "DISPLAY") ||
        (advertiserFormatFilter === "MIXED" && row.adsCount > 1 && row.strongestFormat !== "SEARCH");
      return matchesSearch && matchesStatus && matchesFormat;
    });

    return filtered.sort((a, b) => {
      const direction = advertiserSort.direction === "asc" ? 1 : -1;
      const valueA = a[advertiserSort.key];
      const valueB = b[advertiserSort.key];

      if (typeof valueA === "string" && typeof valueB === "string") {
        return valueA.localeCompare(valueB) * direction;
      }

      return ((Number(valueA) || 0) - (Number(valueB) || 0)) * direction;
    });
  }, [advertiserRows, advertiserSearch, advertiserStatusFilter, advertiserFormatFilter, advertiserSort]);

  const dedupedCreatives = useMemo(() => {
    const combined = [...localCreatives, ...liveCreatives];
    const dedupedMap = new Map<string, AdCreativeData>();

    for (const creative of combined) {
      if (!dedupedMap.has(creative.adId)) {
        dedupedMap.set(creative.adId, creative);
      }
    }

    return Array.from(dedupedMap.values());
  }, [localCreatives, liveCreatives]);

  const creativeGridRows = useMemo(() => {
    return dedupedCreatives.filter((creative) => {
      const matchesAdvertiser = creativeAdvertiserFilter === "ALL" || creative.advertiserId === creativeAdvertiserFilter;
      const matchesFormat = creativeFormatFilter === "ALL" || creative.format === creativeFormatFilter;
      const matchesStatus = creativeStatusFilter === "ALL" ||
        (creativeStatusFilter === "ACTIVE" && new Date(creative.lastSeen).getTime() >= Date.now() - 1000 * 60 * 60 * 24 * 3) ||
        (creativeStatusFilter === "INACTIVE" && new Date(creative.lastSeen).getTime() < Date.now() - 1000 * 60 * 60 * 24 * 3);
      const dimension = creative.width && creative.height ? `${creative.width}x${creative.height}` : "UNKNOWN";
      const matchesDimension = creativeDimensionFilter === "ALL" || dimension === creativeDimensionFilter;
      return matchesAdvertiser && matchesFormat && matchesStatus && matchesDimension;
    }).sort((a, b) => {
      if (creativeSortBy === "newest") return new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime();
      if (creativeSortBy === "oldest") return new Date(a.lastSeen).getTime() - new Date(b.lastSeen).getTime();
      return (b.totalDaysShown ?? b.longevityDays ?? 0) - (a.totalDaysShown ?? a.longevityDays ?? 0);
    });
  }, [dedupedCreatives, creativeAdvertiserFilter, creativeFormatFilter, creativeStatusFilter, creativeDimensionFilter, creativeSortBy]);

  const trackedAdvertiserCount = useMemo(() => {
    return localAdvertisers.filter((advertiser) => advertiser.isTracked).length;
  }, [localAdvertisers]);

  const trackedCreativeCount = useMemo(() => {
    return [...localCreatives, ...liveCreatives].filter((creative) => creative.isTracked).length;
  }, [localCreatives, liveCreatives]);

  const filteredLocalCreatives = useMemo(() => {
    if (formatFilter === "ALL") return localCreatives;
    return localCreatives.filter((c) => c.format === formatFilter);
  }, [localCreatives, formatFilter]);

  const filteredLiveCreatives = useMemo(() => {
    if (formatFilter === "ALL") return liveCreatives;
    return liveCreatives.filter((c) => c.format === formatFilter);
  }, [liveCreatives, formatFilter]);

  const toggleAdvertiserTracking = async (advertiserId: string, isTracked: boolean) => {
    try {
      const res = await fetch(`/api/advertisers/track`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ advertiserId, isTracked }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Không thể cập nhật trạng thái theo dõi.");
      }

      setLocalAdvertisers((prev) =>
        prev.map((advertiser) =>
          advertiser.advertiserId === advertiserId
            ? { ...advertiser, isTracked }
            : advertiser
        )
      );
    } catch (err: any) {
      setErrorMessage(err.message || "Không thể cập nhật trạng thái theo dõi.");
    }
  };

  const toggleCreativeTracking = async (adId: string, isTracked: boolean) => {
    try {
      const res = await fetch(`/api/creatives/track`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adId, isTracked }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Không thể cập nhật trạng thái lưu trữ bài quảng cáo.");
      }

      setLocalCreatives((prev) =>
        prev.map((creative) =>
          creative.adId === adId ? { ...creative, isTracked } : creative
        )
      );
      setLiveCreatives((prev) =>
        prev.map((creative) =>
          creative.adId === adId ? { ...creative, isTracked } : creative
        )
      );
    } catch (err: any) {
      setErrorMessage(err.message || "Không thể cập nhật trạng thái lưu trữ bài quảng cáo.");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleAdvertiserRowClick = (advertiserId: string) => {
    setSelectedAdvertiserId(advertiserId);
    setCreativeAdvertiserFilter(advertiserId);
    setActiveTab("creatives");
  };

  const renderSortArrow = (key: "name" | "adsCount" | "totalDaysShown" | "avgLongevity" | "lastSeen") =>
    advertiserSort.key === key ? (advertiserSort.direction === "asc" ? " ↑" : " ↓") : "";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20 selection:bg-cyan-500 selection:text-slate-950">
      
      {/* HEADER & HERO SECTION */}
      <header className="relative border-b border-slate-800/80 bg-slate-900/40 pt-10 pb-8 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-semibold text-cyan-300 mb-4 backdrop-blur-md">
              <Icon.Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Google Ads Intelligence & Transparency Platform</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-3">
              Tra Cứu & Phân Tích <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-transparent">Bài Quảng Cáo Google</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto mb-8">
              Giám sát Realtime thị trường quảng cáo Google thông qua CSDL PostgreSQL nội bộ và dữ liệu live từ Google Transparency Center qua SerpApi.
            </p>

            {/* SEARCH BAR & COUNTRY SELECT */}
            <div className="flex flex-col items-center gap-4 max-w-3xl mx-auto">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  fetchLocalData(q, country);
                }}
                className="flex w-full items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/90 p-2 shadow-2xl focus-within:border-cyan-500/60 transition-all backdrop-blur-xl"
              >
                <div className="pl-3 text-slate-400">
                  <Icon.Search className="w-5 h-5" />
                </div>
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Nhập tên Nhà quảng cáo, Fanpage ID, Từ khóa bài viết..."
                  className="h-12 w-full bg-transparent px-2 text-sm text-white placeholder-slate-500 outline-none"
                />
                <button
                  type="submit"
                  disabled={loadingLocal}
                  className="h-12 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 text-xs font-bold text-slate-950 hover:from-cyan-400 hover:to-blue-500 transition-all flex items-center gap-2 whitespace-nowrap shadow-lg shadow-cyan-500/20 disabled:opacity-50"
                >
                  {loadingLocal ? <Icon.Loader className="w-4 h-4" /> : "TÌM KIẾM"}
                </button>
              </form>

            </div>
          </div>

          {/* ANALYTICS REPORT BAR */}
          <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 backdrop-blur-md flex items-center gap-4">
              <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl border border-cyan-500/20">
                <Icon.Building className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Nhà Quảng Cáo</p>
                <p className="text-2xl font-black text-white">{analyticsSummary.uniqueAdvertisers || localKpis.totalAdvertisers.toLocaleString()}</p>
                <p className="text-[11px] text-slate-400 mt-1">Đã lưu theo dõi: {trackedAdvertiserCount}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 backdrop-blur-md flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
                <Icon.Layers className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Bài Quảng Cáo</p>
                <p className="text-2xl font-black text-white">{localKpis.totalAdCreatives.toLocaleString()}</p>
                <p className="text-[11px] text-slate-400 mt-1">Đã lưu theo dõi: {trackedCreativeCount}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 backdrop-blur-md flex items-center gap-4">
              <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
                <Icon.Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Duy Trì Trung Bình</p>
                <p className="text-2xl font-black text-white">{analyticsSummary.avgLongevity || analyticsReport.avgLongevity} <span className="text-xs font-normal text-slate-400">ngày</span></p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 backdrop-blur-md flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                <Icon.TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tỷ Lệ Active</p>
                <p className="text-2xl font-black text-white">{analyticsSummary.activeRatio || analyticsReport.activeRatio}%</p>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4 backdrop-blur-md grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">Tổng quy mô SerpApi</div>
              <div className="text-2xl font-black text-white">{analyticsSummary.totalResults.toLocaleString()}</div>
              <div className="text-xs text-slate-400 mt-1">Total Results từ search_information</div>
            </div>
            <div>
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">Top nhà quảng cáo</div>
              <div className="space-y-1 text-xs text-slate-300">
                {analyticsSummary.topAdvertisers.slice(0, 3).map((advertiser) => (
                  <div key={advertiser.advertiserName} className="flex items-center justify-between gap-2">
                    <span className="truncate">{advertiser.advertiserName}</span>
                    <span className="text-slate-400">{advertiser.adCount} bài</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 xl:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4 backdrop-blur-md">
              <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-3">Phân bổ định dạng</div>
              <div className="space-y-2 text-xs text-slate-300">
                {Object.entries(analyticsSummary.formatDistribution).map(([format, count]) => (
                  <div key={format} className="flex items-center justify-between gap-3">
                    <span className="font-semibold">{format}</span>
                    <span className="text-slate-400">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4 backdrop-blur-md">
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3">Kích thước banner phổ biến</div>
              <div className="space-y-2 text-xs text-slate-300">
                {Object.entries(analyticsSummary.dimensionDistribution).slice(0, 5).map(([dimension, count]) => (
                  <div key={dimension} className="flex items-center justify-between gap-3">
                    <span className="font-semibold">{dimension}</span>
                    <span className="text-slate-400">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4 backdrop-blur-md">
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3">Timeline bắt đầu chiến dịch</div>
              <div className="space-y-2 text-xs text-slate-300">
                {analyticsSummary.timeline.slice(0, 6).map((item) => (
                  <div key={item.month} className="flex items-center justify-between gap-3">
                    <span className="font-semibold">{item.month}</span>
                    <span className="text-slate-400">{item.count} bài</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4 backdrop-blur-md">
              <div className="text-xs font-bold text-red-400 uppercase tracking-wider mb-3">Top quảng cáo chạy dài nhất</div>
              <div className="space-y-2 text-xs text-slate-300">
                {analyticsSummary.longestRunningAds.slice(0, 5).map((ad) => (
                  <div key={ad.adId} className="flex items-center justify-between gap-3">
                    <span className="font-semibold truncate">{ad.advertiserName}</span>
                    <span className="text-slate-400">{ad.totalDaysShown} ngày</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* FORMAT BREAKDOWN BAR */}
          <div className="mt-4 rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4 backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
              <Icon.BarChart3 className="w-4 h-4 text-cyan-400" /> Phân Bổ Định Dạng Quảng Cáo:
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20">
                <Icon.FileText className="w-3.5 h-3.5" /> SEARCH: <strong>{analyticsReport.formats.SEARCH}</strong>
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-500/10 text-blue-300 border border-blue-500/20">
                <Icon.LayoutGrid className="w-3.5 h-3.5" /> DISPLAY: <strong>{analyticsReport.formats.DISPLAY}</strong>
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-red-500/10 text-red-300 border border-red-500/20">
                <Icon.Tv className="w-3.5 h-3.5" /> YOUTUBE: <strong>{analyticsReport.formats.YOUTUBE}</strong>
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* ERROR NOTIFICATION */}
      {errorMessage && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="bg-red-950/60 border border-red-800 rounded-2xl p-4 flex items-center gap-3 text-red-200 text-sm">
            <Icon.AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      {/* MAIN WORKSPACE 2 COLUMNS */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="mb-6 flex flex-wrap items-center gap-2 rounded-2xl border border-slate-800/80 bg-slate-900/40 p-2 backdrop-blur-md">
          {[
            { id: "overview", label: "👁️ TỔNG QUAN" },
            { id: "advertisers", label: "🏢 NHÀ QUẢNG CÁO" },
            { id: "creatives", label: "🎨 BÀI QUẢNG CÁO" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as "overview" | "advertisers" | "creatives")}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-lg shadow-cyan-500/20"
                  : "bg-slate-900 text-slate-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <Icon.Filter className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Bộ lọc:</span>

                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="h-10 rounded-xl border border-slate-800 bg-slate-950 px-3 text-xs text-white outline-none"
                >
                  {countryOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>

                {[
                  "ALL",
                  "SEARCH",
                  "DISPLAY",
                  "YOUTUBE",
                ].map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setFormatFilter(fmt)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      formatFilter === fmt
                        ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                        : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>

              <button
                onClick={onCheckNewViaSerp}
                disabled={loadingLive || !q.trim()}
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-5 text-xs font-black text-slate-950 shadow-lg shadow-orange-500/20 hover:from-amber-400 hover:to-orange-400 transition-all disabled:opacity-50"
              >
                <Icon.Zap className="w-4 h-4 text-slate-950" />
                {loadingLive ? "ĐANG CÀO LIVE..." : "⚡ KIỂM TRA MỚI QUA SERPAPI"}
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <section className="rounded-3xl border border-slate-800/80 bg-slate-900/40 p-6 backdrop-blur-md flex flex-col justify-between min-h-[600px]">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                    <div>
                      <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider">LUỒNG 1 · CSDL PostgreSQL</div>
                      <h2 className="text-lg font-bold text-white mt-0.5">Kết Quả Đã Lưu Nội Bộ</h2>
                    </div>
                    <span className="text-xs px-3 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700 font-semibold">
                      {filteredLocalCreatives.length} bài
                    </span>
                  </div>

                  {loadingLocal ? (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-3">
                      <Icon.Loader className="w-8 h-8 text-cyan-400" />
                      <p className="text-xs font-medium">Đang truy vấn CSDL PostgreSQL...</p>
                    </div>
                  ) : filteredLocalCreatives.length === 0 ? (
                    <div className="text-center py-20 text-slate-500 border border-dashed border-slate-800 rounded-2xl p-8">
                      <p className="text-sm font-semibold">Chưa có dữ liệu bài quảng cáo local nào.</p>
                      <p className="text-xs text-slate-600 mt-1">Hãy nhập từ khóa và nhấn nút Tìm Kiếm hoặc Cào Live.</p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[550px] overflow-y-auto pr-2 custom-scrollbar">
                      {filteredLocalCreatives.map((c) => (
                        <AdCreativeCard key={`${c.adId}-local`} creative={c} onOpenDetail={() => setSelectedAd(c)} />
                      ))}
                    </div>
                  )}
                </div>
              </section>

              <section className="rounded-3xl border border-slate-800/80 bg-slate-900/40 p-6 backdrop-blur-md flex flex-col justify-between min-h-[600px]">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                    <div>
                      <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">LUỒNG 2 · Live SerpApi Stream</div>
                      <h2 className="text-lg font-bold text-white mt-0.5">Phát Hiện Quảng Cáo Mới</h2>
                    </div>
                    <span className="text-xs px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold">
                      {filteredLiveCreatives.length} bài
                    </span>
                  </div>

                  {loadingLive ? (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-3">
                      <Icon.Loader className="w-8 h-8 text-amber-400" />
                      <p className="text-xs font-medium text-slate-400">Đang thực thi cào realtime từ SerpApi & Google Ads...</p>
                    </div>
                  ) : filteredLiveCreatives.length === 0 ? (
                    <div className="text-center py-20 text-slate-500 border border-dashed border-slate-800 rounded-2xl p-8">
                      <p className="text-sm font-semibold text-slate-400">Chưa có bài quảng cáo live nào được phát hiện.</p>
                      <p className="text-xs text-slate-600 mt-1">Nhấp vào nút <strong className="text-amber-400">[⚡ KIỂM TRA MỚI QUA SERPAPI]</strong> ở trên để quét.</p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[550px] overflow-y-auto pr-2 custom-scrollbar">
                      {filteredLiveCreatives.map((c) => (
                        <AdCreativeCard key={`${c.adId}-live`} creative={c} isLive onOpenDetail={() => setSelectedAd(c)} />
                      ))}
                    </div>
                  )}
                </div>
              </section>
            </div>
          </>
        )}

        {activeTab === "advertisers" && (
          <section className="rounded-3xl border border-slate-800/80 bg-slate-900/40 p-6 backdrop-blur-md">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <div>
                <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider">TAB · NHÀ QUẢNG CÁO</div>
                <h2 className="text-lg font-bold text-white mt-0.5">Data Table · Drill-down theo Nhà QC</h2>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  value={advertiserSearch}
                  onChange={(e) => setAdvertiserSearch(e.target.value)}
                  placeholder="Tìm tên nhà quảng cáo..."
                  className="h-10 rounded-xl border border-slate-800 bg-slate-950 px-3 text-xs text-white placeholder-slate-500 outline-none"
                />
                <select value={advertiserStatusFilter} onChange={(e) => setAdvertiserStatusFilter(e.target.value)} className="h-10 rounded-xl border border-slate-800 bg-slate-950 px-3 text-xs text-white outline-none">
                  <option value="ALL">Tất cả trạng thái</option>
                  <option value="ACTIVE">Đang chạy</option>
                  <option value="INACTIVE">Đã dừng</option>
                </select>
                <select value={advertiserFormatFilter} onChange={(e) => setAdvertiserFormatFilter(e.target.value)} className="h-10 rounded-xl border border-slate-800 bg-slate-950 px-3 text-xs text-white outline-none">
                  <option value="ALL">Định dạng mạnh nhất</option>
                  <option value="VIDEO">Chỉ chạy Video</option>
                  <option value="IMAGE">Chỉ chạy Ảnh</option>
                  <option value="MIXED">Hỗn hợp</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-800/80">
              <table className="min-w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3 cursor-pointer" onClick={() => setAdvertiserSort((prev) => ({ key: "name", direction: prev.key === "name" && prev.direction === "asc" ? "desc" : "asc" }))}>Nhà Quảng Cáo{renderSortArrow("name")}</th>
                    <th className="px-4 py-3 cursor-pointer" onClick={() => setAdvertiserSort((prev) => ({ key: "adsCount", direction: prev.key === "adsCount" && prev.direction === "asc" ? "desc" : "asc" }))}>Tổng Bài QC{renderSortArrow("adsCount")}</th>
                    <th className="px-4 py-3 cursor-pointer" onClick={() => setAdvertiserSort((prev) => ({ key: "totalDaysShown", direction: prev.key === "totalDaysShown" && prev.direction === "asc" ? "desc" : "asc" }))}>Tổng Ngày Duy Trì{renderSortArrow("totalDaysShown")}</th>
                    <th className="px-4 py-3 cursor-pointer" onClick={() => setAdvertiserSort((prev) => ({ key: "avgLongevity", direction: prev.key === "avgLongevity" && prev.direction === "asc" ? "desc" : "asc" }))}>Độ Bền Trung Bình{renderSortArrow("avgLongevity")}</th>
                    <th className="px-4 py-3 cursor-pointer" onClick={() => setAdvertiserSort((prev) => ({ key: "lastSeen", direction: prev.key === "lastSeen" && prev.direction === "asc" ? "desc" : "asc" }))}>Hoạt động cuối{renderSortArrow("lastSeen")}</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedAdvertiserRows.map((row) => (
                    <tr key={row.advertiserId} className="border-t border-slate-800/70 hover:bg-slate-800/20">
                      <td className="px-4 py-3">
                        <button onClick={() => handleAdvertiserRowClick(row.advertiserId)} className="font-bold text-cyan-300 hover:text-cyan-200 text-left">
                          {row.name}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-white">{row.adsCount}</td>
                      <td className="px-4 py-3 text-white">{row.totalDaysShown} ngày</td>
                      <td className="px-4 py-3 text-white">{row.avgLongevity} ngày</td>
                      <td className="px-4 py-3 text-white">{row.lastSeen ? new Date(row.lastSeen).toLocaleDateString("vi-VN") : "-"}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleAdvertiserTracking(row.advertiserId, !row.isTracked)}
                          className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-[11px] font-bold transition-all ${
                            row.isTracked
                              ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                              : "bg-slate-800 text-slate-300 border border-slate-700 hover:text-white"
                          }`}
                        >
                          <Icon.CheckCircle className="w-3.5 h-3.5" />
                          {row.isTracked ? "Đã lưu" : "Lưu theo dõi"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === "creatives" && (
          <section className="rounded-3xl border border-slate-800/80 bg-slate-900/40 p-6 backdrop-blur-md">
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-6">
              <div>
                <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">TAB · BÀI QUẢNG CÁO</div>
                <h2 className="text-lg font-bold text-white mt-0.5">Visual Grid · Filter & Sort</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-2">
                <select value={creativeAdvertiserFilter} onChange={(e) => { setCreativeAdvertiserFilter(e.target.value); setSelectedAdvertiserId(e.target.value === "ALL" ? null : e.target.value); }} className="h-10 rounded-xl border border-slate-800 bg-slate-950 px-3 text-xs text-white outline-none">
                  <option value="ALL">Tất cả nhà QC</option>
                  {Array.from(new Set([...localCreatives, ...liveCreatives].map((creative) => creative.advertiserId))).map((id) => {
                    const name = [...localCreatives, ...liveCreatives].find((creative) => creative.advertiserId === id)?.advertiserName;
                    return <option key={id} value={id}>{name}</option>;
                  })}
                </select>
                <select value={creativeFormatFilter} onChange={(e) => setCreativeFormatFilter(e.target.value)} className="h-10 rounded-xl border border-slate-800 bg-slate-950 px-3 text-xs text-white outline-none">
                  <option value="ALL">Tất cả định dạng</option>
                  <option value="SEARCH">SEARCH</option>
                  <option value="DISPLAY">DISPLAY</option>
                  <option value="YOUTUBE">YOUTUBE</option>
                </select>
                <select value={creativeStatusFilter} onChange={(e) => setCreativeStatusFilter(e.target.value)} className="h-10 rounded-xl border border-slate-800 bg-slate-950 px-3 text-xs text-white outline-none">
                  <option value="ALL">Tất cả trạng thái</option>
                  <option value="ACTIVE">Đang chạy</option>
                  <option value="INACTIVE">Đã tắt</option>
                </select>
                <select value={creativeDimensionFilter} onChange={(e) => setCreativeDimensionFilter(e.target.value)} className="h-10 rounded-xl border border-slate-800 bg-slate-950 px-3 text-xs text-white outline-none">
                  <option value="ALL">Tất cả kích thước</option>
                  {Array.from(new Set([...localCreatives, ...liveCreatives].map((creative) => creative.width && creative.height ? `${creative.width}x${creative.height}` : "UNKNOWN"))).filter(Boolean).map((dimension) => (
                    <option key={dimension} value={dimension}>{dimension}</option>
                  ))}
                </select>
                <select value={creativeSortBy} onChange={(e) => setCreativeSortBy(e.target.value)} className="h-10 rounded-xl border border-slate-800 bg-slate-950 px-3 text-xs text-white outline-none">
                  <option value="longevity">Sống dai nhất</option>
                  <option value="newest">Mới phát hiện</option>
                  <option value="oldest">Phát hiện lâu nhất</option>
                </select>
              </div>
            </div>

            {!selectedAdvertiserId ? (
              <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/40 p-10 text-center text-slate-400">
                <p className="text-sm font-semibold text-white mb-1">Chưa có nhà quảng cáo nào được chọn.</p>
                <p className="text-xs">Hãy vào tab <span className="text-cyan-300 font-bold">Nhà quảng cáo</span>, bấm vào tên nhà quảng cáo rồi hệ thống sẽ tự động mở danh sách bài quảng cáo tương ứng.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {creativeGridRows.map((creative) => (
                  <div key={`${creative.adId}-${creative.advertiserId}`} className="rounded-2xl border border-slate-800 bg-slate-900/90 p-3 shadow-lg shadow-slate-950/50">
                    <div className="mb-3 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 min-h-[140px] flex items-center justify-center">
                      {creative.mediaUrl ? (
                        <img src={creative.mediaUrl} alt={creative.headline || "Creative preview"} className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center text-slate-500 text-xs p-4">Preview không có hình ảnh</div>
                      )}
                    </div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <button onClick={() => handleAdvertiserRowClick(creative.advertiserId)} className="text-xs font-bold text-cyan-300 truncate hover:text-cyan-200">{creative.advertiserName}</button>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-slate-800 text-slate-300 border-slate-700">{creative.format}</span>
                    </div>
                    <div className="text-sm font-bold text-white line-clamp-1 mb-2">{creative.headline || "Quảng cáo Không tiêu đề"}</div>
                    <div className="flex flex-wrap gap-2 text-[11px] text-slate-400">
                      <span className="rounded-full bg-emerald-500/10 text-emerald-300 px-2 py-1">{creative.status === "ACTIVE" ? "🟢 Active" : "🔴 Inactive"}</span>
                      <span className="rounded-full bg-amber-500/10 text-amber-300 px-2 py-1">🔥 Đã chạy {creative.longevityDays} ngày</span>
                      <span className="rounded-full bg-blue-500/10 text-blue-300 px-2 py-1">{creative.width && creative.height ? `${creative.width}x${creative.height}` : "UNKNOWN"}</span>
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-2">
                      <span className="text-[11px] text-slate-500">{new Date(creative.lastSeen).toLocaleDateString("vi-VN")}</span>
                      <button onClick={() => setSelectedAd(creative)} className="inline-flex items-center gap-1 rounded-lg bg-cyan-500/10 px-2.5 py-1 text-xs font-bold text-cyan-300 border border-cyan-500/20">Chi tiết</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      {/* DETAIL MODAL */}
      {selectedAd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button
              onClick={() => setSelectedAd(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-800/80 text-slate-400 hover:text-white transition-all"
            >
              <Icon.X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <span className={`text-xs font-black px-3 py-1 rounded-full border ${
                selectedAd.format === 'SEARCH' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                selectedAd.format === 'YOUTUBE' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                'bg-blue-500/10 text-blue-400 border-blue-500/20'
              }`}>
                {selectedAd.format}
              </span>

              <span className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 border ${
                selectedAd.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}>
                {selectedAd.status === 'ACTIVE' ? <Icon.CheckCircle className="w-3.5 h-3.5" /> : <Icon.XCircle className="w-3.5 h-3.5" />}
                {selectedAd.status}
              </span>
            </div>

            <h2 className="text-xl font-bold text-white mb-2 leading-snug">
              {selectedAd.headline || "Quảng cáo Không tiêu đề"}
            </h2>

            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <p className="text-xs text-cyan-400 font-semibold flex items-center gap-1.5">
                <Icon.Building className="w-4 h-4" /> Nhà quảng cáo: {selectedAd.advertiserName}
              </p>

              <div className="flex items-center gap-2">
                {localAdvertisers.some((advertiser) => advertiser.advertiserId === selectedAd.advertiserId) && (
                  <button
                    onClick={() => {
                      const advertiser = localAdvertisers.find((item) => item.advertiserId === selectedAd.advertiserId);
                      toggleAdvertiserTracking(selectedAd.advertiserId, !advertiser?.isTracked);
                    }}
                    className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-[11px] font-bold transition-all ${
                      localAdvertisers.find((item) => item.advertiserId === selectedAd.advertiserId)?.isTracked
                        ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                        : "bg-slate-800 text-slate-300 border border-slate-700 hover:text-white"
                    }`}
                  >
                    <Icon.Eye className="w-3.5 h-3.5" />
                    {localAdvertisers.find((item) => item.advertiserId === selectedAd.advertiserId)?.isTracked ? "Đang theo dõi" : "Theo dõi nhà quảng cáo"}
                  </button>
                )}

                <button
                  onClick={() => toggleCreativeTracking(selectedAd.adId, !selectedAd.isTracked)}
                  className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-[11px] font-bold transition-all ${
                    selectedAd.isTracked
                      ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                      : "bg-slate-800 text-slate-300 border border-slate-700 hover:text-white"
                  }`}
                >
                  <Icon.CheckCircle className="w-3.5 h-3.5" />
                  {selectedAd.isTracked ? "Đã lưu bài quảng cáo" : "Lưu bài quảng cáo"}
                </button>
              </div>
            </div>

            {selectedAd.mediaUrl && (
              <div className="mb-6 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={selectedAd.mediaUrl} alt="Ad Preview" className="max-h-64 object-contain rounded-xl" />
              </div>
            )}

            {selectedAd.bodyText && (
              <div className="mb-6 bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Icon.FileText className="w-3.5 h-3.5" /> Nội dung văn bản quảng cáo:
                  </span>
                  <button
                    onClick={() => copyToClipboard(selectedAd.bodyText || "")}
                    className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1"
                  >
                    {copiedText ? <Icon.Check className="w-3.5 h-3.5 text-emerald-400" /> : <Icon.Copy className="w-3.5 h-3.5" />}
                    {copiedText ? "Đã chép" : "Sao chép"}
                  </button>
                </div>
                <p className="text-sm text-slate-200 whitespace-pre-line leading-relaxed">{selectedAd.bodyText}</p>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-slate-950/40 border border-slate-800 p-3 rounded-xl">
                <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Số ngày chạy</span>
                <span className="text-base font-black text-amber-400 flex items-center gap-1">
                  <Icon.Clock className="w-4 h-4" /> {selectedAd.longevityDays} ngày
                </span>
              </div>

              <div className="bg-slate-950/40 border border-slate-800 p-3 rounded-xl">
                <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Xuất hiện đầu</span>
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                  <Icon.Calendar className="w-3.5 h-3.5 text-slate-400" /> {new Date(selectedAd.firstSeen).toLocaleDateString("vi-VN")}
                </span>
              </div>

              <div className="bg-slate-950/40 border border-slate-800 p-3 rounded-xl">
                <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Xuất hiện cuối</span>
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                  <Icon.Calendar className="w-3.5 h-3.5 text-slate-400" /> {new Date(selectedAd.lastSeen).toLocaleDateString("vi-VN")}
                </span>
              </div>
            </div>

            {selectedAd.targetCountries && selectedAd.targetCountries.length > 0 && (
              <div className="mb-6">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Thị trường Target:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedAd.targetCountries.map((c) => (
                    <span key={c} className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 font-medium">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <div className="text-[11px] text-slate-500">
                Ad ID: <code className="text-slate-400">{selectedAd.adId}</code>
              </div>

              <a
                href={selectedAd.detailsLink || `https://adstransparency.google.com/?region=anywhere&text=${encodeURIComponent(selectedAd.advertiserName)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/20"
              >
                <span>Mở Google Transparency Center</span>
                <Icon.ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

function AdCreativeCard({
  creative,
  isLive = false,
  onOpenDetail,
}: {
  creative: AdCreativeData & { isNewDetected?: boolean };
  isLive?: boolean;
  onOpenDetail: () => void;
}) {
  return (
    <div
      className={`relative rounded-2xl border p-4 transition-all hover:border-slate-700 bg-slate-900/90 ${
        isLive ? "border-amber-500/30 shadow-md" : "border-slate-800"
      }`}
    >
      {creative.isNewDetected && (
        <span className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-orange-500 text-slate-950 font-black text-[9px] px-2.5 py-0.5 rounded-bl-lg uppercase tracking-wider">
          NEW DETECTED
        </span>
      )}

      <div className="flex items-start justify-between gap-3 mb-2 pr-12">
        <div>
          <span className="text-xs font-semibold text-cyan-400 flex items-center gap-1">
            <Icon.Building className="w-3.5 h-3.5" /> {creative.advertiserName}
          </span>
          <h3 className="text-sm font-bold text-white line-clamp-1 mt-1">
            {creative.headline || "Quảng cáo Không tiêu đề"}
          </h3>
        </div>

        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
          creative.format === 'SEARCH' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
          creative.format === 'YOUTUBE' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
          'bg-blue-500/10 text-blue-400 border-blue-500/20'
        }`}>
          {creative.format}
        </span>
      </div>

      {creative.bodyText && (
        <p className="text-xs text-slate-400 line-clamp-2 mb-3 leading-relaxed">
          {creative.bodyText}
        </p>
      )}

      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-3 border-t border-slate-800/80">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-slate-400">
            <Icon.Clock className="w-3.5 h-3.5 text-amber-400" />
            Duy trì: <strong className="text-slate-200 font-bold">{creative.longevityDays} ngày</strong>
          </span>

          <span className="flex items-center gap-1 text-slate-500">
            <Icon.Calendar className="w-3.5 h-3.5" />
            {new Date(creative.lastSeen).toLocaleDateString("vi-VN")}
          </span>
        </div>

        <button
          onClick={onOpenDetail}
          className="inline-flex items-center gap-1 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20"
        >
          <Icon.Eye className="w-3.5 h-3.5" />
          <span>Chi tiết</span>
        </button>
      </div>
    </div>
  );
}