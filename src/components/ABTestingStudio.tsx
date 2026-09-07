import React, { useState } from "react";
import { AdVariant, STANDARD_BANNER_SIZES, BannerDimension } from "../types";
import { BannerRenderer } from "./BannerRenderer";
import {
  Split,
  Plus,
  Trash2,
  Sparkles,
  Zap,
  ArrowRight,
  TrendingUp,
  Percent,
  CheckCircle2,
  SlidersHorizontal,
} from "lucide-react";

interface ABTestingStudioProps {
  variants: AdVariant[];
  activeVariantId: string;
  onSelectActiveVariant: (id: string) => void;
  onUpdateVariant: (updated: AdVariant) => void;
  onAddChallengerVariant: (type: "urgency" | "social_proof" | "minimalist") => void;
  onDeleteVariant: (id: string) => void;
  onSimulateAdClick: (variantId: string, sizeId: string) => void;
}

export const ABTestingStudio: React.FC<ABTestingStudioProps> = ({
  variants,
  activeVariantId,
  onSelectActiveVariant,
  onUpdateVariant,
  onAddChallengerVariant,
  onDeleteVariant,
  onSimulateAdClick,
}) => {
  const [comparisonSizeId, setComparisonSizeId] = useState<string>("med_rect_300x250");
  const selectedSize =
    STANDARD_BANNER_SIZES.find((s) => s.id === comparisonSizeId) ||
    STANDARD_BANNER_SIZES[0];

  const handleTrafficChange = (variantId: string, newWeight: number) => {
    // If 2 variants, adjust the other automatically to sum to 100
    if (variants.length === 2) {
      const other = variants.find((v) => v.id !== variantId);
      if (other) {
        onUpdateVariant({
          ...variants.find((v) => v.id === variantId)!,
          trafficWeight: newWeight,
        });
        onUpdateVariant({
          ...other,
          trafficWeight: Math.max(0, 100 - newWeight),
        });
        return;
      }
    }
    const current = variants.find((v) => v.id === variantId);
    if (current) {
      onUpdateVariant({ ...current, trafficWeight: newWeight });
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Variant Tabs */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
                <Split className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Automated A/B Creative Testing Engine
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Test distinct creative hypotheses, messaging angles, and visual assets to optimize conversion rates.
            </p>
          </div>

          {/* Add Challenger Variant Button */}
          {variants.length < 3 && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onAddChallengerVariant("urgency")}
                className="px-3.5 py-2 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/50 text-indigo-300 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>+ Spin AI Challenger Variant</span>
              </button>
            </div>
          )}
        </div>

        {/* Variant Cards & Traffic Allocation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
          {variants.map((variant) => {
            const isActive = variant.id === activeVariantId;
            return (
              <div
                key={variant.id}
                className={`p-4 rounded-xl border transition-all ${
                  isActive
                    ? "bg-slate-800/80 border-indigo-500 shadow-md ring-1 ring-indigo-500/40"
                    : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full font-mono ${
                        variant.badgeTag === "Variant A"
                          ? "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                          : variant.badgeTag === "Variant B"
                          ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                          : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                      }`}
                    >
                      {variant.badgeTag}
                    </span>
                    <h4 className="text-xs font-bold text-white truncate max-w-[140px]">
                      {variant.name}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onSelectActiveVariant(variant.id)}
                      className={`text-[11px] px-2.5 py-1 rounded font-semibold transition-all ${
                        isActive
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-800 text-slate-300 hover:text-white"
                      }`}
                    >
                      {isActive ? "Editing Active" : "Select"}
                    </button>
                    {variants.length > 2 && (
                      <button
                        type="button"
                        onClick={() => onDeleteVariant(variant.id)}
                        className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                        title="Delete variant"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Hypothesis Input */}
                <div className="mt-2">
                  <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">
                    Testing Hypothesis
                  </label>
                  <p className="text-xs text-slate-300 italic bg-slate-950/80 p-2 rounded border border-slate-800/80 line-clamp-2">
                    "{variant.hypothesis}"
                  </p>
                </div>

                {/* Quick Details */}
                <div className="grid grid-cols-2 gap-2 mt-3 text-[11px] text-slate-300 bg-slate-950/40 p-2 rounded border border-slate-800/60">
                  <div>
                    <span className="text-slate-500 text-[10px] block">Headline:</span>
                    <span className="font-bold truncate block">{variant.copy.headline}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">CTA Button:</span>
                    <span className="font-bold text-indigo-300 truncate block">
                      {variant.copy.ctaText}
                    </span>
                  </div>
                </div>

                {/* Traffic Split Control */}
                <div className="mt-4 pt-3 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-400 font-medium flex items-center gap-1">
                      <Percent className="w-3 h-3 text-indigo-400" />
                      Traffic Allocation:
                    </span>
                    <span className="font-bold font-mono text-white">
                      {variant.trafficWeight}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="90"
                    step="5"
                    value={variant.trafficWeight}
                    onChange={(e) =>
                      handleTrafficChange(variant.id, parseInt(e.target.value, 10))
                    }
                    className="w-full accent-indigo-500"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Side-by-Side Visual Challenger Comparison */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
              <span>Side-by-Side Visual Creative Comparison</span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Compare how each creative angle renders on specific ad inventory. Click any banner to test click feedback.
            </p>
          </div>

          {/* Size Selector for Comparison */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Inventory Format:</span>
            <select
              value={comparisonSizeId}
              onChange={(e) => setComparisonSizeId(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-slate-100 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none focus:border-indigo-500"
            >
              {STANDARD_BANNER_SIZES.map((size) => (
                <option key={size.id} value={size.id}>
                  {size.name} ({size.width}×{size.height})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Side-by-side rendering container */}
        <div className="mt-6 flex flex-wrap items-start justify-center gap-8 p-4 bg-slate-950/60 rounded-xl border border-slate-800/80 min-h-[300px]">
          {variants.map((variant) => {
            // Determine scale to fit neatly in side-by-side grid
            let renderScale = 1;
            if (selectedSize.width > 500) {
              renderScale = 0.55; // scale down large leaderboards or billboards
            } else if (selectedSize.height > 500) {
              renderScale = 0.65; // scale down skyscrapers
            }

            return (
              <div
                key={variant.id}
                className="flex flex-col items-center gap-3"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono uppercase ${
                      variant.badgeTag === "Variant A"
                        ? "bg-blue-500/20 text-blue-300"
                        : "bg-rose-500/20 text-rose-300"
                    }`}
                  >
                    {variant.badgeTag}
                  </span>
                  <span className="text-xs font-bold text-white">
                    {variant.copy.headline}
                  </span>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 shadow-xl flex items-center justify-center">
                  <BannerRenderer
                    size={selectedSize}
                    variant={variant}
                    scale={renderScale}
                    interactive={true}
                    onClickAd={() => onSimulateAdClick(variant.id, selectedSize.id)}
                  />
                </div>

                <div className="text-center">
                  <p className="text-[11px] text-slate-400 font-mono">
                    CTA: <span className="text-white font-bold">{variant.copy.ctaText}</span>
                  </p>
                  <span className="text-[10px] text-indigo-400 font-mono">
                    {variant.trafficWeight}% Traffic Split
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
