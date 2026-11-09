import React, { useState, useMemo } from "react";
import { BannerDimension, STANDARD_BANNER_SIZES, AdVariant } from "../types";
import { BannerRenderer } from "./BannerRenderer";
import {
  Grid,
  ZoomIn,
  ZoomOut,
  Maximize,
  Sparkles,
  Download,
  Eye,
  Sliders,
} from "lucide-react";

interface BannerSizesGridProps {
  variant: AdVariant;
  onSelectSizeToFocus?: (size: BannerDimension) => void;
  onSimulateClick?: (sizeId: string) => void;
  onOpenExport?: () => void;
}

export const BannerSizesGrid: React.FC<BannerSizesGridProps> = ({
  variant,
  onSelectSizeToFocus,
  onSimulateClick,
  onOpenExport,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Memoize filtered sizes to prevent unnecessary recalculations on zoom
  const filteredSizes = useMemo(() => {
    return STANDARD_BANNER_SIZES.filter((size) => {
      if (filterCategory === "all") return true;
      return size.category === filterCategory;
    });
  }, [filterCategory]);

  const getScaleForDisplay = (size: BannerDimension) => {
    // Determine appropriate optical display scale
    if (size.width > 700) return 0.65 * zoomLevel;
    if (size.height > 500) return 0.7 * zoomLevel;
    if (size.width >= 1080) return 0.28 * zoomLevel;
    return 0.85 * zoomLevel;
  };

  return (
    <div className="space-y-5">
      {/* Filter & Toolbar Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
        {/* Category Filters */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-bold uppercase text-slate-400 mr-1.5">
            Filter Sizes:
          </span>
          {[
            { id: "all", label: "All Formats (10)" },
            { id: "standard", label: "Rectangles" },
            { id: "horizontal", label: "Leaderboards" },
            { id: "vertical", label: "Skyscrapers" },
            { id: "mobile", label: "Mobile Banner" },
            { id: "social", label: "Social Feeds" },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setFilterCategory(cat.id)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                filterCategory === cat.id
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Zoom & Export Actions */}
        <div className="flex items-center gap-3 self-end md:self-center">
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-1 text-slate-300">
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.max(0.6, z - 0.1))}
              className="p-1 hover:text-white transition-colors"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono px-2 text-slate-400">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.1))}
              className="p-1 hover:text-white transition-colors"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {onOpenExport && (
            <button
              type="button"
              onClick={onOpenExport}
              className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Ad Bundle</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid of All Standard Banner Sizes */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredSizes.map((size) => {
          const scale = getScaleForDisplay(size);
          return (
            <div
              key={size.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-lg hover:border-slate-700 transition-all group"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">
                    {size.name}
                  </span>
                  {size.isPopular && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 uppercase font-mono">
                      Popular
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-slate-400">
                    {size.width}×{size.height}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    ({size.aspectRatioLabel})
                  </span>
                </div>
              </div>

              {/* Banner Canvas Container */}
              <div className="flex-1 flex items-center justify-center p-3 bg-slate-950/80 rounded-lg border border-slate-800/60 overflow-hidden min-h-[160px]">
                <BannerRenderer
                  size={size}
                  variant={variant}
                  scale={scale}
                  interactive={true}
                  onClickAd={() => onSimulateClick && onSimulateClick(size.id)}
                />
              </div>

              {/* Card Footer Info */}
              <div className="mt-3 pt-2 flex items-center justify-between text-[11px] text-slate-400">
                <p className="truncate max-w-[200px]">{size.description}</p>
                <span className="text-indigo-400 font-mono text-[10px] shrink-0">
                  IAB Verified
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
