import React, { useState } from "react";
import { AdVariant, CampaignData, VariantSchedule } from "../types";
import {
  Calendar,
  Clock,
  Play,
  Pause,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Sliders,
  Layers,
  ArrowRight,
  TrendingUp,
  Tag,
  Zap,
} from "lucide-react";
import { BannerRenderer } from "./BannerRenderer";
import { STANDARD_BANNER_SIZES } from "../types";

interface CampaignScheduleModuleProps {
  campaign: CampaignData;
  onUpdateVariantSchedule: (variantId: string, schedule: VariantSchedule) => void;
  onSelectActiveVariant: (variantId: string) => void;
}

export const CampaignScheduleModule: React.FC<CampaignScheduleModuleProps> = ({
  campaign,
  onUpdateVariantSchedule,
  onSelectActiveVariant,
}) => {
  const TODAY_STR = "2026-09-07"; // Simulated current system date

  const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Helper to calculate days between two dates
  const getDaysDiff = (start: string, end: string) => {
    try {
      const s = new Date(start).getTime();
      const e = new Date(end).getTime();
      const diff = Math.round((e - s) / (1000 * 60 * 60 * 24));
      return isNaN(diff) ? 0 : Math.max(diff, 1);
    } catch {
      return 14;
    }
  };

  // Helper to determine status based on current date
  const computeLiveStatus = (
    sched?: VariantSchedule
  ): "active" | "scheduled" | "ended" | "paused" => {
    if (!sched) return "active";
    if (sched.status === "paused") return "paused";
    if (TODAY_STR < sched.startDate) return "scheduled";
    if (TODAY_STR > sched.endDate) return "ended";
    return "active";
  };

  // Quick preset dates generator
  const applyPresetDates = (days: number) => {
    const today = new Date(TODAY_STR);
    const end = new Date(today);
    end.setDate(today.getDate() + days);

    const startStr = today.toISOString().split("T")[0];
    const endStr = end.toISOString().split("T")[0];

    campaign.variants.forEach((v) => {
      onUpdateVariantSchedule(v.id, {
        ...(v.schedule || {
          status: "active",
          activeDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        }),
        startDate: startStr,
        endDate: endStr,
        status: "active",
      });
    });
  };

  // Mini preview size
  const previewSize =
    STANDARD_BANNER_SIZES.find((s) => s.id === "med_rect_300x250") ||
    STANDARD_BANNER_SIZES[0];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Quick Action Presets */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Flight & Variant Schedule Manager</span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Live Engine
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Define runtime date boundaries, day-parting rules, and scheduled rotation for each creative variant.
              </p>
            </div>
          </div>
        </div>

        {/* Global Presets */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-slate-400">Flight Presets:</span>
          <button
            type="button"
            onClick={() => applyPresetDates(7)}
            className="px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          >
            7-Day Flash
          </button>
          <button
            type="button"
            onClick={() => applyPresetDates(14)}
            className="px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          >
            14-Day Sprint
          </button>
          <button
            type="button"
            onClick={() => applyPresetDates(30)}
            className="px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          >
            30-Day Campaign
          </button>
        </div>
      </div>

      {/* Flight Timeline Gantt Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-400" />
            <span className="text-sm font-bold text-white">
              Variant Flight Timeline Overview
            </span>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Simulated System Date: <strong className="text-indigo-300">{TODAY_STR}</strong>
          </span>
        </div>

        <div className="space-y-3 pt-2">
          {campaign.variants.map((v) => {
            const sched = v.schedule || {
              startDate: "2026-09-01",
              endDate: "2026-09-28",
              status: "active" as const,
              activeDays: DAYS_OF_WEEK,
            };

            const duration = getDaysDiff(sched.startDate, sched.endDate);
            const status = computeLiveStatus(sched);

            // Compute elapsed percentage from start date to TODAY_STR
            const elapsed = Math.max(0, getDaysDiff(sched.startDate, TODAY_STR));
            const progressPct = Math.min(100, Math.max(5, Math.round((elapsed / duration) * 100)));

            return (
              <div
                key={v.id}
                className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2 hover:border-slate-700 transition-all"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{v.name}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                        status === "active"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : status === "scheduled"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : status === "paused"
                          ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                          : "bg-slate-700/40 text-slate-400"
                      }`}
                    >
                      {status === "active" && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      )}
                      <span className="capitalize">{status}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
                    <span>
                      {sched.startDate} &rarr; {sched.endDate}
                    </span>
                    <span className="text-slate-300 font-bold">{duration} Days</span>
                  </div>
                </div>

                {/* Progress Visual Bar */}
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden relative">
                  <div
                    className={`h-full rounded-full transition-all ${
                      status === "active"
                        ? "bg-gradient-to-r from-indigo-500 to-emerald-400"
                        : status === "scheduled"
                        ? "bg-amber-500"
                        : status === "paused"
                        ? "bg-slate-600"
                        : "bg-slate-700"
                    }`}
                    style={{ width: `${status === "scheduled" ? 100 : progressPct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Variant Schedule Configurations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {campaign.variants.map((variant) => {
          const sched: VariantSchedule = variant.schedule || {
            startDate: "2026-09-01",
            endDate: "2026-09-28",
            status: "active",
            timeZone: "America/New_York (EST)",
            dayPartingEnabled: false,
            activeDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            budgetAllocationPct: Math.round(100 / campaign.variants.length),
            flightObjective: "Direct-to-Consumer Conversion",
          };

          const liveStatus = computeLiveStatus(sched);
          const daysRemaining = Math.max(0, getDaysDiff(TODAY_STR, sched.endDate));

          const updateSchedule = (partial: Partial<VariantSchedule>) => {
            onUpdateVariantSchedule(variant.id, {
              ...sched,
              ...partial,
            });
          };

          const toggleDay = (day: string) => {
            const currentDays = sched.activeDays || DAYS_OF_WEEK;
            const updated = currentDays.includes(day)
              ? currentDays.filter((d) => d !== day)
              : [...currentDays, day];
            updateSchedule({ activeDays: updated });
          };

          return (
            <div
              key={variant.id}
              className={`bg-slate-900 border rounded-2xl p-5 space-y-4 transition-all ${
                campaign.activeVariantId === variant.id
                  ? "border-indigo-500 shadow-indigo-500/10 ring-1 ring-indigo-500/40 shadow-xl"
                  : "border-slate-800 hover:border-slate-700 shadow-md"
              }`}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                    {variant.badgeTag}
                  </span>
                  <h3 className="text-sm font-bold text-white">{variant.name}</h3>
                </div>

                {/* Status Switcher Button */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      updateSchedule({
                        status: sched.status === "paused" ? "active" : "paused",
                      })
                    }
                    className={`px-2.5 py-1 text-xs rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                      sched.status === "paused"
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30"
                        : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    {sched.status === "paused" ? (
                      <>
                        <Play className="w-3 h-3" />
                        <span>Resume</span>
                      </>
                    ) : (
                      <>
                        <Pause className="w-3 h-3" />
                        <span>Pause</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => onSelectActiveVariant(variant.id)}
                    className="px-2.5 py-1 text-xs rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-xs"
                  >
                    Design Variant
                  </button>
                </div>
              </div>

              {/* Date Pickers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 mb-1 block">
                    Start Flight Date
                  </label>
                  <input
                    type="date"
                    value={sched.startDate}
                    onChange={(e) => updateSchedule({ startDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 mb-1 block">
                    End Flight Date
                  </label>
                  <input
                    type="date"
                    value={sched.endDate}
                    onChange={(e) => updateSchedule({ endDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Status and Days Remaining Summary */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 text-xs">
                <span className="text-slate-400">Flight Status:</span>
                <div className="flex items-center gap-2">
                  <span
                    className={`font-bold capitalize ${
                      liveStatus === "active"
                        ? "text-emerald-400"
                        : liveStatus === "scheduled"
                        ? "text-amber-400"
                        : "text-rose-400"
                    }`}
                  >
                    {liveStatus}
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-300 font-mono font-medium">
                    {liveStatus === "active"
                      ? `${daysRemaining} days remaining`
                      : liveStatus === "scheduled"
                      ? `Starts in ${getDaysDiff(TODAY_STR, sched.startDate)} days`
                      : "Flight ended"}
                  </span>
                </div>
              </div>

              {/* Day-Parting (Active Days of Week) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-slate-400">
                    Day-Parting Delivery Schedule
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      updateSchedule({
                        activeDays:
                          (sched.activeDays || []).length === 7
                            ? ["Mon", "Tue", "Wed", "Thu", "Fri"]
                            : DAYS_OF_WEEK,
                      })
                    }
                    className="text-[10px] text-indigo-400 hover:text-indigo-300"
                  >
                    {(sched.activeDays || []).length === 7
                      ? "Set Weekdays Only"
                      : "Select All 7 Days"}
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1.5">
                  {DAYS_OF_WEEK.map((day) => {
                    const isSelected = (sched.activeDays || DAYS_OF_WEEK).includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`py-1.5 rounded text-center text-xs font-bold transition-all ${
                          isSelected
                            ? "bg-indigo-600 text-white shadow-xs"
                            : "bg-slate-950 text-slate-500 hover:text-slate-300 border border-slate-800"
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Objective & Traffic Allocation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-[11px] font-medium text-slate-400 mb-1 block">
                    Flight Strategic Goal
                  </label>
                  <input
                    type="text"
                    value={sched.flightObjective || ""}
                    onChange={(e) => updateSchedule({ flightObjective: e.target.value })}
                    placeholder="e.g. Flash Offer Boost"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-medium text-slate-400">
                      Traffic Share
                    </label>
                    <span className="text-xs font-mono font-bold text-indigo-300">
                      {variant.trafficWeight}%
                    </span>
                  </div>
                  <div className="h-8 flex items-center">
                    <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                      <div
                        className="bg-indigo-500 h-full rounded-full"
                        style={{ width: `${variant.trafficWeight}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Creative Thumbnail Preview */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <div className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-slate-500" />
                  <span className="truncate max-w-[200px]">
                    Headline: "{variant.copy.headline}"
                  </span>
                </div>

                <span className="text-[10px] font-mono text-slate-400">
                  Target: {variant.copy.targetUrl.split("://")[1]?.split("/")[0] || "Target URL"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
