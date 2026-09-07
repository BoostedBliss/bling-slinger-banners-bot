import React, { useState } from "react";
import { AdVariant, CampaignData, STANDARD_BANNER_SIZES, BannerDimension } from "../types";
import { BannerRenderer } from "./BannerRenderer";
import {
  Flame,
  MousePointerClick,
  Eye,
  Layers,
  Sparkles,
  Sliders,
  Maximize2,
  TrendingUp,
  Award,
  BarChart2,
  HelpCircle,
} from "lucide-react";

interface AdHeatmapViewProps {
  campaign: CampaignData;
}

interface HeatmapRegion {
  id: string;
  name: string;
  tag: string;
  sharePct: number;
  clicks: number;
  cvr: number;
  color: string;
  glowClass: string;
  posBySize: Record<
    string,
    { top: string; left: string; width: string; height: string }
  >;
}

export const AdHeatmapView: React.FC<AdHeatmapViewProps> = ({ campaign }) => {
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    campaign.activeVariantId || campaign.variants[0]?.id || "variant-a"
  );
  const [selectedSizeId, setSelectedSizeId] = useState<string>("med_rect_300x250");
  const [viewMode, setViewMode] = useState<"thermal" | "zones" | "dots">("thermal");
  const [heatmapOpacity, setHeatmapOpacity] = useState<number>(75);
  const [hoveredRegionId, setHoveredRegionId] = useState<string | null>(null);
  const [showSimulatedClicks, setShowSimulatedClicks] = useState<boolean>(true);

  const currentVariant =
    campaign.variants.find((v) => v.id === selectedVariantId) ||
    campaign.variants[0];

  const currentSize =
    STANDARD_BANNER_SIZES.find((s) => s.id === selectedSizeId) ||
    STANDARD_BANNER_SIZES[0];

  // Benchmark region definitions with normalized coordinates for different banner aspect ratios
  const regions: HeatmapRegion[] = [
    {
      id: "cta",
      name: "Primary CTA Button",
      tag: "Conversion Anchor",
      sharePct: selectedVariantId === "variant-b" ? 61.4 : 54.2,
      clicks: selectedVariantId === "variant-b" ? 842 : 512,
      cvr: selectedVariantId === "variant-b" ? 11.2 : 9.6,
      color: "#ef4444",
      glowClass: "from-red-500/80 via-orange-500/60 to-transparent",
      posBySize: {
        med_rect_300x250: { top: "72%", left: "64%", width: "42%", height: "20%" },
        large_rect_336x280: { top: "73%", left: "62%", width: "40%", height: "18%" },
        leaderboard_728x90: { top: "50%", left: "86%", width: "22%", height: "46%" },
        half_page_300x600: { top: "84%", left: "50%", width: "65%", height: "11%" },
        social_square_1080x1080: { top: "78%", left: "50%", width: "55%", height: "14%" },
      },
    },
    {
      id: "headline",
      name: "Headline & Offer Pitch",
      tag: "Attention Anchor",
      sharePct: selectedVariantId === "variant-b" ? 22.8 : 26.5,
      clicks: selectedVariantId === "variant-b" ? 312 : 251,
      cvr: selectedVariantId === "variant-b" ? 4.8 : 3.9,
      color: "#f59e0b",
      glowClass: "from-amber-500/75 via-yellow-500/50 to-transparent",
      posBySize: {
        med_rect_300x250: { top: "36%", left: "54%", width: "62%", height: "30%" },
        large_rect_336x280: { top: "38%", left: "52%", width: "60%", height: "28%" },
        leaderboard_728x90: { top: "48%", left: "42%", width: "45%", height: "55%" },
        half_page_300x600: { top: "45%", left: "50%", width: "75%", height: "22%" },
        social_square_1080x1080: { top: "44%", left: "50%", width: "70%", height: "22%" },
      },
    },
    {
      id: "image",
      name: "Product Hero Image",
      tag: "Visual Hook",
      sharePct: selectedVariantId === "variant-b" ? 10.6 : 13.1,
      clicks: selectedVariantId === "variant-b" ? 145 : 124,
      cvr: selectedVariantId === "variant-b" ? 2.4 : 2.1,
      color: "#06b6d4",
      glowClass: "from-cyan-500/60 via-blue-500/40 to-transparent",
      posBySize: {
        med_rect_300x250: { top: "35%", left: "20%", width: "32%", height: "38%" },
        large_rect_336x280: { top: "36%", left: "22%", width: "34%", height: "36%" },
        leaderboard_728x90: { top: "50%", left: "14%", width: "16%", height: "70%" },
        half_page_300x600: { top: "24%", left: "50%", width: "65%", height: "28%" },
        social_square_1080x1080: { top: "25%", left: "50%", width: "55%", height: "28%" },
      },
    },
    {
      id: "badge",
      name: "Promotion Badge / Logo",
      tag: "Credibility Seal",
      sharePct: selectedVariantId === "variant-b" ? 5.2 : 6.2,
      clicks: selectedVariantId === "variant-b" ? 71 : 59,
      cvr: selectedVariantId === "variant-b" ? 1.8 : 1.4,
      color: "#8b5cf6",
      glowClass: "from-purple-500/60 via-indigo-500/30 to-transparent",
      posBySize: {
        med_rect_300x250: { top: "14%", left: "22%", width: "32%", height: "14%" },
        large_rect_336x280: { top: "15%", left: "20%", width: "30%", height: "12%" },
        leaderboard_728x90: { top: "50%", left: "5%", width: "8%", height: "50%" },
        half_page_300x600: { top: "10%", left: "50%", width: "40%", height: "8%" },
        social_square_1080x1080: { top: "12%", left: "50%", width: "35%", height: "8%" },
      },
    },
  ];

  // Available banner sizes for heatmap testing
  const supportedSizes = STANDARD_BANNER_SIZES.slice(0, 4);

  // Scaled rendering helper
  const getScale = (size: BannerDimension) => {
    if (size.width > 500) return 0.75;
    if (size.height > 400) return 0.65;
    return 1;
  };

  const scale = getScale(currentSize);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-red-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-md">
            <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-tight">
                Simulated Ad Engagement Heatmap
              </h3>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Eye-Tracking & Click Density
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Empirical interaction hotspots modeled from {currentVariant.name}'s historical click and conversion telemetry.
            </p>
          </div>
        </div>

        {/* Variant Switcher Pills */}
        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start lg:self-auto">
          {campaign.variants.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setSelectedVariantId(v.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedVariantId === v.id
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span>{v.name}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/30">
                {v.trafficWeight}% traffic
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Control Bar: Size selector, Heatmap Mode, and Opacity */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 text-xs">
        {/* Size Selection */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-semibold shrink-0">Banner Size:</span>
          <select
            value={selectedSizeId}
            onChange={(e) => setSelectedSizeId(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
          >
            {supportedSizes.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.width}x{s.height})
              </option>
            ))}
          </select>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 font-semibold shrink-0">Visual Mode:</span>
          <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-700/80 w-full">
            <button
              type="button"
              onClick={() => setViewMode("thermal")}
              className={`flex-1 py-1 rounded text-center font-bold transition-all ${
                viewMode === "thermal"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Thermal Glow
            </button>
            <button
              type="button"
              onClick={() => setViewMode("zones")}
              className={`flex-1 py-1 rounded text-center font-bold transition-all ${
                viewMode === "zones"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Region Boxes
            </button>
            <button
              type="button"
              onClick={() => setViewMode("dots")}
              className={`flex-1 py-1 rounded text-center font-bold transition-all ${
                viewMode === "dots"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Click Matrix
            </button>
          </div>
        </div>

        {/* Heatmap Opacity Slider */}
        <div className="flex items-center gap-3">
          <span className="text-slate-400 font-semibold shrink-0">Heatmap Alpha:</span>
          <input
            type="range"
            min="20"
            max="100"
            value={heatmapOpacity}
            onChange={(e) => setHeatmapOpacity(Number(e.target.value))}
            className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
          <span className="text-indigo-300 font-mono font-bold shrink-0 w-8 text-right">
            {heatmapOpacity}%
          </span>
        </div>
      </div>

      {/* Main Heatmap Stage & Region Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Banner Display Stage with Heatmap Overlay */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center min-h-[380px] relative overflow-hidden group">
          {/* Background grid markings */}
          <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-25 pointer-events-none" />

          {/* Scaled Banner Container */}
          <div
            className="relative shadow-2xl rounded-lg overflow-hidden border border-slate-700/60 select-none transition-all"
            style={{
              width: currentSize.width * scale,
              height: currentSize.height * scale,
            }}
          >
            {/* Base Banner Render */}
            <div
              className="origin-top-left absolute top-0 left-0 pointer-events-none"
              style={{ transform: `scale(${scale})` }}
            >
              <BannerRenderer
                size={currentSize}
                variant={currentVariant}
                interactive={false}
              />
            </div>

            {/* Thermal / Hotspot Overlay Layer */}
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-300"
              style={{ opacity: heatmapOpacity / 100 }}
            >
              {regions.map((region) => {
                const pos =
                  region.posBySize[currentSize.id] ||
                  region.posBySize["med_rect_300x250"];

                const isHovered = hoveredRegionId === region.id;

                if (viewMode === "thermal") {
                  return (
                    <div
                      key={region.id}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform duration-300"
                      style={{
                        top: pos.top,
                        left: pos.left,
                        width: pos.width,
                        height: pos.height,
                        background: `radial-gradient(circle, ${region.color} 0%, rgba(245, 158, 11, 0.4) 45%, transparent 75%)`,
                        filter: "blur(18px)",
                        transform: `translate(-50%, -50%) scale(${isHovered ? 1.3 : 1})`,
                      }}
                    />
                  );
                }

                if (viewMode === "zones") {
                  return (
                    <div
                      key={region.id}
                      className={`absolute transform -translate-x-1/2 -translate-y-1/2 rounded-md border-2 transition-all flex flex-col justify-between p-1.5 ${
                        isHovered
                          ? "border-white bg-black/60 shadow-lg scale-105"
                          : "border-dashed"
                      }`}
                      style={{
                        top: pos.top,
                        left: pos.left,
                        width: pos.width,
                        height: pos.height,
                        borderColor: region.color,
                        backgroundColor: isHovered
                          ? "rgba(0,0,0,0.75)"
                          : `${region.color}22`,
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className="px-1 py-0.2 rounded text-[9px] font-bold text-white font-mono"
                          style={{ backgroundColor: region.color }}
                        >
                          {region.sharePct}%
                        </span>
                        <span className="text-[9px] font-mono text-white font-bold bg-black/60 px-1 rounded">
                          {region.clicks} clicks
                        </span>
                      </div>
                      <span className="text-[9px] font-bold text-white tracking-wide truncate">
                        {region.name}
                      </span>
                    </div>
                  );
                }

                // "dots" view mode: click matrix scatter
                return (
                  <div
                    key={region.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                      top: pos.top,
                      left: pos.left,
                      width: pos.width,
                      height: pos.height,
                    }}
                  >
                    {/* Pulsing focal core */}
                    <div
                      className="absolute inset-0 rounded-full animate-ping opacity-30"
                      style={{ backgroundColor: region.color }}
                    />
                    <div
                      className="absolute inset-0 rounded-full border-2"
                      style={{ borderColor: region.color, backgroundColor: `${region.color}33` }}
                    />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-black/80 text-white font-mono text-[9px] font-bold">
                      {region.sharePct}%
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Interactive Region Pins / Pins on Top */}
            <div className="absolute inset-0 pointer-events-auto">
              {regions.map((region) => {
                const pos =
                  region.posBySize[currentSize.id] ||
                  region.posBySize["med_rect_300x250"];
                const isHovered = hoveredRegionId === region.id;

                return (
                  <button
                    key={region.id}
                    type="button"
                    onMouseEnter={() => setHoveredRegionId(region.id)}
                    onMouseLeave={() => setHoveredRegionId(null)}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 p-1 rounded-full cursor-pointer transition-transform ${
                      isHovered ? "scale-125 z-20" : "scale-100 z-10"
                    }`}
                    style={{ top: pos.top, left: pos.left }}
                    title={`${region.name}: ${region.sharePct}% engagement`}
                  >
                    <div
                      className="w-4 h-4 rounded-full border-2 border-white shadow-md flex items-center justify-center"
                      style={{ backgroundColor: region.color }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scale note */}
          <div className="mt-4 flex items-center gap-2 text-[11px] text-slate-500 font-mono">
            <span>Rendered at {Math.round(scale * 100)}% scale</span>
            <span>•</span>
            <span>Hover pins to highlight interaction density</span>
          </div>
        </div>

        {/* Region Engagement Breakdown Cards */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <BarChart2 className="w-4 h-4 text-indigo-400" />
              <span>Regional Click Share</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              Total: {regions.reduce((acc, r) => acc + r.clicks, 0).toLocaleString()} clicks
            </span>
          </div>

          {regions.map((region) => {
            const isHovered = hoveredRegionId === region.id;

            return (
              <div
                key={region.id}
                onMouseEnter={() => setHoveredRegionId(region.id)}
                onMouseLeave={() => setHoveredRegionId(null)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isHovered
                    ? "bg-slate-800/90 border-indigo-500 shadow-md ring-1 ring-indigo-500/40"
                    : "bg-slate-950/70 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: region.color }}
                    />
                    <span className="text-xs font-bold text-white">{region.name}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-white">
                    {region.sharePct}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${region.sharePct}%`,
                      backgroundColor: region.color,
                    }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>{region.clicks.toLocaleString()} total clicks</span>
                  <span className="text-emerald-400 font-semibold">
                    {region.cvr}% regional CVR
                  </span>
                </div>
              </div>
            );
          })}

          {/* Eye-Tracking Strategic Insight Box */}
          <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-800/40 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span>Heatmap Creative Takeaway</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              The high-contrast CTA button captures <strong className="text-white">{regions[0].sharePct}%</strong> of user gaze and tap volume. Maintaining a minimum 44px tap zone on mobile formats prevents misclicks and sustains the {regions[0].cvr}% conversion rate.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
