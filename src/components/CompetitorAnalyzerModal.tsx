import React, { useState } from "react";
import { CompetitorAnalysisResult, AdVariant, CampaignData } from "../types";
import {
  Search,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Zap,
  Globe,
  X,
  Palette,
  Eye,
  Sliders,
  ShieldAlert,
} from "lucide-react";

interface CompetitorAnalyzerModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: CampaignData;
  onApplyDifferentiation: (
    analysis: CompetitorAnalysisResult,
    mode: "update-active" | "create-new"
  ) => void;
}

export const CompetitorAnalyzerModal: React.FC<CompetitorAnalyzerModalProps> = ({
  isOpen,
  onClose,
  campaign,
  onApplyDifferentiation,
}) => {
  const [competitorUrl, setCompetitorUrl] = useState("https://bose.com/headphones");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<CompetitorAnalysisResult | null>(null);

  if (!isOpen) return null;

  const handleAnalyze = async (urlToTest?: string) => {
    const target = urlToTest || competitorUrl;
    if (!target.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const activeVariant =
        campaign.variants.find((v) => v.id === campaign.activeVariantId) ||
        campaign.variants[0];

      const res = await fetch("/api/analyze-competitor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          competitorUrl: target,
          myBrandName: activeVariant?.copy.brandName || campaign.productName,
          myProductDescription: campaign.productDescription,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to analyze competitor layout.");
      }

      setAnalysis(json.data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to analyze competitor layout.");
    } finally {
      setIsLoading(false);
    }
  };

  const PRESET_COMPETITORS = [
    { label: "Bose Audio", url: "https://bose.com/headphones" },
    { label: "Sony Sound", url: "https://sony.com/audio/headphones" },
    { label: "Apple Beats", url: "https://beatsbydre.com" },
    { label: "Sennheiser", url: "https://sennheiser-hearing.com" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Competitor Ad Layout & Differentiation Analyzer</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  AI Strat
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Deconstruct competitor ad structures and generate high-conversion design counter-tactics.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* URL Input Bar */}
        <div className="p-6 pb-4 border-b border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Globe className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="url"
                value={competitorUrl}
                onChange={(e) => setCompetitorUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                placeholder="Enter competitor landing page or ad URL (e.g. https://sony.com/audio)"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
            <button
              type="button"
              disabled={isLoading || !competitorUrl.trim()}
              onClick={() => handleAnalyze()}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 shrink-0"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Analyzing Structure...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Analyze & Differentiate</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex items-center gap-2 flex-wrap text-xs text-slate-400">
            <span className="font-semibold text-slate-500">Quick Test:</span>
            {PRESET_COMPETITORS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => {
                  setCompetitorUrl(p.url);
                  handleAnalyze(p.url);
                }}
                className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] border border-slate-700 transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {!analysis && !isLoading && (
            <div className="py-12 flex flex-col items-center justify-center text-center text-slate-400 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-slate-800/80 flex items-center justify-center text-slate-500 border border-slate-700">
                <Sliders className="w-7 h-7" />
              </div>
              <p className="text-sm max-w-md text-slate-300 font-medium">
                Enter a competitor's URL above to inspect their banner structure, visual density, copy angles, and uncover actionable design differentiation opportunities.
              </p>
            </div>
          )}

          {isLoading && (
            <div className="py-16 flex flex-col items-center justify-center space-y-4 text-center">
              <div className="w-12 h-12 border-3 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
              <div>
                <p className="text-sm font-semibold text-white">
                  Scanning {competitorUrl.replace(/^https?:\/\//, "").split("/")[0]}...
                </p>
                <p className="text-xs text-slate-400">
                  Parsing layout geometry, typography weights, color dominance, and CTA hooks
                </p>
              </div>
            </div>
          )}

          {analysis && (
            <div className="space-y-6">
              {/* Summary Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-400">Domain:</span>
                  <span className="text-xs font-bold font-mono text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/50">
                    {analysis.competitorDomain}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <div>
                    <span className="text-slate-400">Layout Type: </span>
                    <span className="font-semibold text-white">
                      {analysis.detectedStructure.layoutType}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">Visual Density: </span>
                    <span
                      className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                        analysis.detectedStructure.visualDensity === "Minimal"
                          ? "bg-blue-500/20 text-blue-300"
                          : analysis.detectedStructure.visualDensity === "Balanced"
                          ? "bg-emerald-500/20 text-emerald-300"
                          : "bg-amber-500/20 text-amber-300"
                      }`}
                    >
                      {analysis.detectedStructure.visualDensity}
                    </span>
                  </div>
                </div>
              </div>

              {/* 2-Column Comparison Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Column 1: Competitor Structural Profile */}
                <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-amber-400" />
                      <span>Competitor Layout Patterns</span>
                    </h3>
                    <span className="text-[10px] font-mono text-slate-400">Analysis</span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="text-slate-400 block mb-1">Color Temperature:</span>
                      <div className="flex items-center gap-1.5">
                        {analysis.detectedStructure.colorPalette.map((c, i) => (
                          <div
                            key={i}
                            className="w-5 h-5 rounded-md border border-slate-700 shadow-sm"
                            style={{ backgroundColor: c }}
                            title={c}
                          />
                        ))}
                        <span className="text-[11px] text-slate-400 font-mono ml-2">
                          {analysis.detectedStructure.estimatedReadability}
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-400 block mb-0.5">Headline Approach:</span>
                      <p className="text-slate-200 bg-slate-900/80 p-2 rounded border border-slate-800">
                        {analysis.detectedStructure.headlineStyle}
                      </p>
                    </div>

                    <div>
                      <span className="text-slate-400 block mb-0.5">Call to Action:</span>
                      <p className="text-slate-200 bg-slate-900/80 p-2 rounded border border-slate-800">
                        {analysis.detectedStructure.ctaStrategy}
                      </p>
                    </div>

                    <div>
                      <span className="text-slate-400 block mb-1 font-semibold text-amber-400">
                        Vulnerabilities to Exploit:
                      </span>
                      <ul className="space-y-1.5 pl-1">
                        {analysis.identifiedWeaknesses.map((w, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-slate-300 text-[11px]">
                            <span className="text-amber-400 font-bold">•</span>
                            <span>{w}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Column 2: Recommended Differentiation */}
                <div className="bg-indigo-950/20 border border-indigo-500/30 rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-indigo-500/20">
                    <h3 className="text-sm font-bold text-indigo-300 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-indigo-400" />
                      <span>Recommended Differentiation</span>
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                      High Impact
                    </span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="bg-indigo-950/40 p-3 rounded-lg border border-indigo-500/20">
                      <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider block mb-1">
                        Design Contrast Advice
                      </span>
                      <p className="text-indigo-100 text-xs leading-relaxed">
                        {analysis.differentiationTactic.designContrastAdvice}
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Theme:</span>
                        <span className="font-bold text-white capitalize bg-slate-800 px-2 py-0.5 rounded">
                          {analysis.differentiationTactic.themeRecommendation}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Counter-Headline:</span>
                        <span className="font-bold text-amber-300">
                          "{analysis.differentiationTactic.recommendedHeadline}"
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Action CTA:</span>
                        <span className="font-bold text-emerald-400">
                          "{analysis.differentiationTactic.recommendedCta}"
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Incentive Badge:</span>
                        <span className="font-bold text-amber-400">
                          {analysis.differentiationTactic.badgeSuggestion}
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-300 block mb-1 font-semibold">
                        Layout Action Steps:
                      </span>
                      <ul className="space-y-1.5 pl-1">
                        {analysis.differentiationTactic.actionItems.map((act, i) => (
                          <li key={i} className="flex items-start gap-2 text-indigo-200 text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                            <span>{act}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Footer */}
        {analysis && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-slate-800 bg-slate-950/60">
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Apply these differentiation recommendations directly to your banners:</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => {
                  onApplyDifferentiation(analysis, "update-active");
                  onClose();
                }}
                className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-colors"
              >
                Apply to Active Variant
              </button>

              <button
                type="button"
                onClick={() => {
                  onApplyDifferentiation(analysis, "create-new");
                  onClose();
                }}
                className="flex-1 sm:flex-initial px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg transition-all flex items-center justify-center gap-1.5 active:scale-95"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Create Differentiated Variant C</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
