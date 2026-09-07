import React, { useState } from "react";
import { ABTestReport, CampaignData } from "../types";
import { AdHeatmapView } from "./AdHeatmapView";
import {
  BarChart3,
  TrendingUp,
  Award,
  Zap,
  CheckCircle2,
  DollarSign,
  MousePointerClick,
  Eye,
  RefreshCw,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Layers,
} from "lucide-react";

interface PerformanceAnalyticsProps {
  report: ABTestReport;
  campaign: CampaignData;
  onSimulateTraffic: (additionalImpressions: number) => void;
  onApplyOptimization: () => void;
  onRunAIAudit: () => void;
  isAuditing: boolean;
}

export const PerformanceAnalytics: React.FC<PerformanceAnalyticsProps> = ({
  report,
  campaign,
  onSimulateTraffic,
  onApplyOptimization,
  onRunAIAudit,
  isAuditing,
}) => {
  const [selectedSizeTab, setSelectedSizeTab] = useState<string>("all");
  const [appliedNotice, setAppliedNotice] = useState(false);

  const winningVariant = campaign.variants.find(
    (v) => v.id === report.winnerVariantId
  );

  const handleApplyClick = () => {
    onApplyOptimization();
    setAppliedNotice(true);
    setTimeout(() => setAppliedNotice(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* 1. Executive Winner & Statistical Validation Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-indigo-500/40 rounded-xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center shrink-0 shadow-lg">
              <Award className="w-6 h-6 text-amber-300" />
            </div>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Statistically Significant (p = {report.pValue.toFixed(3)})
                </span>
                <span className="text-xs font-mono text-slate-300">
                  Confidence: <strong className="text-white">{report.confidenceRate}%</strong>
                </span>
              </div>

              <h2 className="text-xl font-extrabold text-white mt-1.5 tracking-tight">
                {winningVariant ? winningVariant.name : "Variant B"} Declared Winning Creative
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                {report.aiTakeaway}
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onRunAIAudit}
              disabled={isAuditing}
              className="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              {isAuditing ? (
                <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" />
              ) : (
                <Sparkles className="w-4 h-4 text-amber-300" />
              )}
              <span>{isAuditing ? "Auditing Creative..." : "Refresh AI Audit"}</span>
            </button>

            <button
              type="button"
              onClick={handleApplyClick}
              className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>Apply Winner Optimization</span>
            </button>
          </div>
        </div>

        {appliedNotice && (
          <div className="mt-4 p-3 bg-emerald-950/70 border border-emerald-700 rounded-lg text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>
              Winner optimizations applied! 80% programmatic traffic allocated to {winningVariant?.name || "Variant B"}, and top-performing CTA styling synchronized across all ad sizes.
            </span>
          </div>
        )}
      </div>

      {/* 2. Top-Level Metric Scorecards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Impressions */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Total Impressions</span>
            <Eye className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-black text-white font-mono">
            {report.totalImpressions.toLocaleString()}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Across 10 standard banner sizes
          </span>
        </div>

        {/* Total Clicks & CTR */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Clicks & CTR</span>
            <MousePointerClick className="w-4 h-4 text-sky-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-black text-white font-mono">
              {report.totalClicks.toLocaleString()}
            </p>
            <span className="text-sm font-bold text-emerald-400 font-mono">
              ({((report.totalClicks / report.totalImpressions) * 100).toFixed(2)}%)
            </span>
          </div>
          <span className="text-[11px] text-emerald-400 font-semibold mt-1 flex items-center gap-0.5">
            <ArrowUpRight className="w-3.5 h-3.5" />
            +{report.liftPct}% vs baseline CTR
          </span>
        </div>

        {/* Conversions & CVR */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Conversions (CVR)</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-black text-white font-mono">
              {report.totalConversions}
            </p>
            <span className="text-sm font-bold text-emerald-400 font-mono">
              ({((report.totalConversions / report.totalClicks) * 100).toFixed(1)}%)
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Checkout purchases & signups
          </span>
        </div>

        {/* ROAS & Revenue */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Total ROAS</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-black text-amber-300 font-mono">
              {report.overallRoas}x
            </p>
            <span className="text-xs text-slate-400 font-mono">
              (${report.totalRevenue.toLocaleString()})
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Total Spend: ${report.totalSpend.toFixed(2)}
          </span>
        </div>
      </div>

      {/* 3. Creative Head-to-Head Comparison Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-400" />
              <span>Head-to-Head Variant Performance Breakdown</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Direct comparison of click-through rate, conversions, and ad spend return per creative.
            </p>
          </div>

          {/* Traffic Simulator Buttons */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 hidden sm:inline">Simulate Traffic:</span>
            <button
              type="button"
              onClick={() => onSimulateTraffic(10000)}
              className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 font-mono transition-colors"
              title="Simulate +10,000 ad impressions"
            >
              +10K
            </button>
            <button
              type="button"
              onClick={() => onSimulateTraffic(50000)}
              className="px-2.5 py-1 text-xs bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 rounded border border-indigo-500/40 font-mono transition-colors"
              title="Simulate +50,000 ad impressions"
            >
              +50K
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[11px]">
                <th className="py-3 px-3">Creative Variant</th>
                <th className="py-3 px-3">Impressions</th>
                <th className="py-3 px-3">Clicks</th>
                <th className="py-3 px-3">CTR (%)</th>
                <th className="py-3 px-3">Conversions</th>
                <th className="py-3 px-3">CVR (%)</th>
                <th className="py-3 px-3">CPC</th>
                <th className="py-3 px-3">Revenue</th>
                <th className="py-3 px-3">ROAS</th>
                <th className="py-3 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {report.variantMetrics.map((vm) => {
                const isWinner = vm.variantId === report.winnerVariantId;
                return (
                  <tr
                    key={vm.variantId}
                    className={`hover:bg-slate-800/30 transition-colors ${
                      isWinner ? "bg-indigo-950/20" : ""
                    }`}
                  >
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        {isWinner && (
                          <Award className="w-4 h-4 text-amber-400 shrink-0" />
                        )}
                        <span className="font-bold text-white">{vm.variantName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-300">
                      {vm.impressions.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-200 font-bold">
                      {vm.clicks.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 font-mono">
                      <span
                        className={`px-2 py-0.5 rounded font-bold ${
                          isWinner
                            ? "bg-emerald-500/20 text-emerald-300"
                            : "text-slate-300"
                        }`}
                      >
                        {vm.ctr.toFixed(2)}%
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-200">
                      {vm.conversions}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-300">
                      {vm.cvr.toFixed(2)}%
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-400">
                      ${vm.costPerClick.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 font-mono text-white font-bold">
                      ${vm.revenue.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-amber-300">
                      {vm.roas}x
                    </td>
                    <td className="py-3 px-3 text-right">
                      {isWinner ? (
                        <span className="inline-block px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px] uppercase font-mono">
                          Winner
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] uppercase font-mono">
                          Challenger
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3.4. Simulated Ad Engagement Heatmap */}
      <AdHeatmapView campaign={campaign} />

      {/* 3.5. Multiple Call-to-Action (CTA) Variations & Performance Tracking */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <MousePointerClick className="w-4 h-4 text-emerald-400" />
              <span>Call-to-Action (CTA) Multi-Button Performance Tracking</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Empirical conversion analytics across alternative CTA button variants and dynamic incentives.
            </p>
          </div>
          <span className="text-[11px] font-mono text-indigo-300 bg-indigo-950/60 px-2.5 py-1 rounded border border-indigo-800/60">
            A/B Dynamic Copy Experiment
          </span>
        </div>

        {/* CTA Performance Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              cta: "Claim 35% Off",
              type: "Urgency / Discount",
              impressions: 18610,
              clicks: 809,
              conversions: 89,
              ctr: 4.35,
              cvr: 11.0,
              isWinner: true,
            },
            {
              cta: "Shop Now",
              type: "Direct Action",
              impressions: 18600,
              clicks: 601,
              conversions: 61,
              ctr: 3.23,
              cvr: 10.15,
              isWinner: false,
            },
            {
              cta: "Get Offer",
              type: "Incentive",
              impressions: 6810,
              clicks: 221,
              conversions: 24,
              ctr: 3.24,
              cvr: 10.85,
              isWinner: false,
            },
            {
              cta: "Learn More",
              type: "Soft Exploration",
              impressions: 6800,
              clicks: 197,
              conversions: 19,
              ctr: 2.90,
              cvr: 9.64,
              isWinner: false,
            },
          ].map((item) => (
            <div
              key={item.cta}
              className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                item.isWinner
                  ? "bg-emerald-950/25 border-emerald-500/50 shadow-md ring-1 ring-emerald-500/30"
                  : "bg-slate-950/60 border-slate-800"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {item.type}
                  </span>
                  {item.isWinner ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                      <Award className="w-3 h-3 text-amber-300" />
                      Highest CTR
                    </span>
                  ) : null}
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-700 text-xs font-bold text-white shadow-xs">
                    &ldquo;{item.cta}&rdquo;
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Click-Through Rate:</span>
                    <span className="font-mono font-bold text-white">{item.ctr}%</span>
                  </div>
                  {/* CTR Progress Bar */}
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.isWinner ? "bg-emerald-400" : "bg-blue-400"}`}
                      style={{ width: `${(item.ctr / 5) * 100}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-slate-400 pt-1">
                    <span>Conversions:</span>
                    <span className="font-mono text-slate-200">{item.conversions} orders</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>CVR:</span>
                    <span className="font-mono text-emerald-400 font-semibold">{item.cvr}%</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-2 border-t border-slate-900 text-[11px] text-slate-500 flex justify-between">
                <span>{item.impressions.toLocaleString()} views</span>
                <span>{item.clicks.toLocaleString()} clicks</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Performance Breakdown by Standard Banner Size */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1 flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-400" />
          <span>Performance by Standard Display Inventory Size</span>
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Compare click-through velocity across medium rectangles, leaderboards, skyscrapers, and mobile units.
        </p>

        <div className="space-y-3">
          {[
            {
              id: "med_rect_300x250",
              name: "Medium Rectangle (300×250)",
              ctrA: 3.5,
              ctrB: 4.8,
              topTake: "Optimal in-article engagement",
            },
            {
              id: "leaderboard_728x90",
              name: "Leaderboard (728×90)",
              ctrA: 2.8,
              ctrB: 3.69,
              topTake: "High viewability masthead banner",
            },
            {
              id: "half_page_300x600",
              name: "Half Page / Monster (300×600)",
              ctrA: 3.29,
              ctrB: 4.5,
              topTake: "Highest dwell time & storytelling impact",
            },
            {
              id: "mobile_leaderboard_320x50",
              name: "Mobile Banner (320×50)",
              ctrA: 2.89,
              ctrB: 4.22,
              topTake: "Mobile swipe rate +46% for urgency CTA",
            },
            {
              id: "wide_skyscraper_160x600",
              name: "Wide Skyscraper (160×600)",
              ctrA: 2.21,
              ctrB: 2.69,
              topTake: "Persistent sidebar peripheral impressions",
            },
          ].map((item) => (
            <div
              key={item.id}
              className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3"
            >
              <div className="min-w-[220px]">
                <span className="text-xs font-bold text-white block">
                  {item.name}
                </span>
                <span className="text-[11px] text-slate-400">{item.topTake}</span>
              </div>

              {/* Progress Bars for Variant A vs B */}
              <div className="flex-1 max-w-md flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-blue-400">Variant A: {item.ctrA}% CTR</span>
                  <span className="text-rose-400 font-bold">
                    Variant B: {item.ctrB}% CTR (+{Math.round(((item.ctrB - item.ctrA) / item.ctrA) * 100)}%)
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-blue-500 rounded-l-full"
                    style={{ width: `${(item.ctrA / 6) * 100}%` }}
                  />
                  <div
                    className="h-full bg-rose-500 rounded-r-full"
                    style={{ width: `${((item.ctrB - item.ctrA) / 6) * 100}%` }}
                  />
                </div>
              </div>

              <div className="shrink-0 text-right">
                <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Winner: Variant B
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. AI Optimization Recommendations */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-amber-300" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Data-Driven Creative Optimization Action Plan
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {report.recommendations.map((rec, index) => (
            <div
              key={index}
              className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                    Priority 0{index + 1}
                  </span>
                  <span className="text-xs font-bold font-mono text-emerald-400">
                    {rec.expectedLift}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white mb-1.5">{rec.title}</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {rec.description}
                </p>
              </div>

              <button
                type="button"
                onClick={handleApplyClick}
                className="mt-4 w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
              >
                <span>Execute Recommendation</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-indigo-400" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
