import React, { useState, useRef, useEffect } from "react";
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Sparkles,
  Check,
  ArrowRight,
  X,
  Clock,
  Flame,
} from "lucide-react";

export interface CampaignNotification {
  id: string;
  type:
    | "statistical_significance"
    | "flight_imminent"
    | "flight_ending"
    | "ctr_milestone"
    | "competitor_insight";
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  severity: "success" | "warning" | "info";
  targetTab?: "all-sizes" | "image-generator" | "customize" | "ab-testing" | "schedule" | "analytics";
  actionLabel?: string;
}

interface NotificationCenterProps {
  onNavigateTab?: (tab: "all-sizes" | "image-generator" | "customize" | "ab-testing" | "schedule" | "analytics") => void;
  onOpenCompetitorModal?: () => void;
}

const STORAGE_KEY = "banner_craft_notifications_v1";

const INITIAL_NOTIFICATIONS: CampaignNotification[] = [
  {
    id: "notif-1",
    type: "statistical_significance",
    title: "A/B Statistical Significance Reached",
    description: "Variant B (Bold Urgency) reached 97.4% statistical confidence over Variant A with +54.8% CTR lift.",
    timestamp: "10m ago",
    read: false,
    severity: "success",
    targetTab: "ab-testing",
    actionLabel: "View Winner",
  },
  {
    id: "notif-2",
    type: "flight_imminent",
    title: "Flight Start Date Imminent",
    description: "Flash Sale scheduled flight for Variant B begins in 18 hours (2026-09-08). Review budget allocation.",
    timestamp: "1h ago",
    read: false,
    severity: "warning",
    targetTab: "schedule",
    actionLabel: "Review Flight",
  },
  {
    id: "notif-3",
    type: "ctr_milestone",
    title: "CTR Milestone Surpassed",
    description: "Primary CTA 'Claim 35% Off' crossed 4.80% CTR, pacing 2.4x higher than standard IAB benchmark.",
    timestamp: "4h ago",
    read: false,
    severity: "info",
    targetTab: "analytics",
    actionLabel: "View Heatmap",
  },
  {
    id: "notif-4",
    type: "competitor_insight",
    title: "Competitor Vulnerability Detected",
    description: "Bose ad benchmark audit found passive CTAs. Apply differentiated contrast tactic to Variant C.",
    timestamp: "Yesterday",
    read: true,
    severity: "info",
    actionLabel: "Audit Competitor",
  },
];

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  onNavigateTab,
  onOpenCompetitorModal,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<CampaignNotification[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_NOTIFICATIONS;
  });

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    } catch {}
  }, [notifications]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleAction = (notif: CampaignNotification) => {
    markAsRead(notif.id);
    setIsOpen(false);
    if (notif.type === "competitor_insight" && onOpenCompetitorModal) {
      onOpenCompetitorModal();
    } else if (notif.targetTab && onNavigateTab) {
      onNavigateTab(notif.targetTab);
    }
  };

  const getNotificationIcon = (type: CampaignNotification["type"], severity: CampaignNotification["severity"]) => {
    switch (type) {
      case "statistical_significance":
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case "flight_imminent":
        return <Calendar className="w-4 h-4 text-amber-400" />;
      case "ctr_milestone":
        return <TrendingUp className="w-4 h-4 text-cyan-400" />;
      case "competitor_insight":
        return <Sparkles className="w-4 h-4 text-violet-400" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`relative p-2 rounded-lg border transition-all flex items-center justify-center ${
          isOpen
            ? "bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30"
            : "bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-800"
        }`}
        title="Campaign Milestone Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-rose-500 text-[10px] font-extrabold text-white ring-2 ring-slate-950 animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Popover */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden animate-fade-in text-slate-200">
          {/* Popover Header */}
          <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white tracking-wide">
                Campaign Milestones
              </span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-mono font-bold border border-indigo-500/30">
                  {unreadCount} new
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                >
                  Mark all read
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-800/60">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                No active milestone notifications.
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-3.5 transition-colors hover:bg-slate-800/40 flex items-start gap-3 relative ${
                    !notif.read ? "bg-slate-800/20" : ""
                  }`}
                >
                  {/* Status indicator line */}
                  {!notif.read && (
                    <div className="absolute left-0 top-3 bottom-3 w-1 bg-indigo-500 rounded-r" />
                  )}

                  {/* Icon Box */}
                  <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                    {getNotificationIcon(notif.type, notif.severity)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-bold text-white truncate">
                        {notif.title}
                      </h4>
                      <span className="text-[10px] font-mono text-slate-400 shrink-0">
                        {notif.timestamp}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {notif.description}
                    </p>

                    {/* Action button */}
                    <div className="pt-1.5 flex items-center justify-between">
                      {notif.actionLabel && (
                        <button
                          type="button"
                          onClick={() => handleAction(notif)}
                          className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 group transition-colors"
                        >
                          <span>{notif.actionLabel}</span>
                          <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                        </button>
                      )}

                      {!notif.read && (
                        <button
                          type="button"
                          onClick={() => markAsRead(notif.id)}
                          className="text-[10px] text-slate-500 hover:text-slate-400 transition-colors ml-auto"
                        >
                          Mark read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer note */}
          <div className="px-4 py-2 bg-slate-950/80 border-t border-slate-800 text-center">
            <span className="text-[10px] text-slate-500 font-mono">
              Live automated telemetry & flight trigger alerts
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
