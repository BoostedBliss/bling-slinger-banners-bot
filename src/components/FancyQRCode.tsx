import React, { useState, useEffect } from "react";
import QRCode from "qrcode";
import { FancyQRCodeConfig, QRCodeThemeStyle } from "../types";
import { QrCode, Smartphone, Sparkles, Scan, ArrowUpRight } from "lucide-react";

interface FancyQRCodeProps {
  rawUrl: string;
  config: FancyQRCodeConfig;
  sizePx?: number;
  bannerSizeId?: string;
  variantId?: string;
  accentColor?: string;
  onSimulateScan?: (deepLink: string) => void;
  className?: string;
}

export const FancyQRCode: React.FC<FancyQRCodeProps> = ({
  rawUrl,
  config,
  sizePx = 80,
  bannerSizeId = "banner",
  variantId = "var_a",
  accentColor = "#3b82f6",
  onSimulateScan,
  className = "",
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [isScanned, setIsScanned] = useState(false);

  // Construct deep-link with offline-to-online conversion UTM tracking
  const campaignTag = config.trackingCampaign || "banner_ooh";
  const deepLink = (() => {
    try {
      const url = new URL(rawUrl || "https://aura-acoustics.audio");
      url.searchParams.set("utm_source", "offline_qr");
      url.searchParams.set("utm_medium", "banner_overlay");
      url.searchParams.set("utm_campaign", campaignTag);
      url.searchParams.set("utm_content", `${variantId}_${bannerSizeId}`);
      return url.toString();
    } catch {
      return `${rawUrl}?utm_source=offline_qr&utm_medium=banner_overlay&utm_campaign=${campaignTag}&utm_content=${variantId}_${bannerSizeId}`;
    }
  })();

  const style: QRCodeThemeStyle = config.style || "glass-glow";

  // Compute QR dark color based on style
  const getQrDarkColor = () => {
    switch (style) {
      case "gold-luxury":
        return "#f59e0b"; // warm amber/gold
      case "cyber-matrix":
        return "#06b6d4"; // cyan
      case "clean-minimal":
        return "#0f172a"; // deep slate
      case "glass-glow":
      default:
        return "#ffffff"; // pure white on dark translucent glass
    }
  };

  useEffect(() => {
    let isMounted = true;
    const darkColor = getQrDarkColor();
    const lightColor = style === "clean-minimal" ? "#ffffff" : "#00000000"; // transparent for glass/cyber

    QRCode.toDataURL(deepLink, {
      errorCorrectionLevel: "H",
      margin: 1,
      width: Math.max(160, sizePx * 2.5),
      color: {
        dark: darkColor,
        light: lightColor,
      },
    })
      .then((url) => {
        if (isMounted) setQrDataUrl(url);
      })
      .catch((err) => {
        console.error("QR Code generation error:", err);
      });

    return () => {
      isMounted = false;
    };
  }, [deepLink, style, sizePx]);

  const handleScanClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsScanned(true);
    setTimeout(() => setIsScanned(false), 2000);
    if (onSimulateScan) {
      onSimulateScan(deepLink);
    }
  };

  if (!config.enabled) return null;

  // Determine container styling based on theme
  const getContainerClasses = () => {
    switch (style) {
      case "gold-luxury":
        return "bg-slate-950/90 border border-amber-400/50 shadow-[0_0_20px_rgba(245,158,11,0.25)] text-amber-200";
      case "cyber-matrix":
        return "bg-slate-950/90 border border-cyan-400/60 shadow-[0_0_20px_rgba(6,182,212,0.3)] text-cyan-300";
      case "clean-minimal":
        return "bg-white text-slate-900 border border-slate-200 shadow-xl";
      case "glass-glow":
      default:
        return "bg-slate-950/80 backdrop-blur-md border border-white/25 shadow-[0_8px_24px_rgba(0,0,0,0.5)] text-white";
    }
  };

  const label = config.labelText || "Scan to Shop";

  return (
    <div
      onClick={handleScanClick}
      title={`Interactive QR Code: ${deepLink} (Click to simulate scan)`}
      className={`group relative select-none rounded-xl p-2 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer ${getContainerClasses()} ${className}`}
      style={{
        width: `${sizePx + 16}px`,
      }}
    >
      {/* Decorative Ornate Corner Brackets */}
      {config.cornerMarkerStyle !== "rounded" && (
        <>
          <span
            className="absolute top-1 left-1 w-2.5 h-2.5 border-t-2 border-l-2 pointer-events-none transition-colors"
            style={{ borderColor: style === "gold-luxury" ? "#fbbf24" : style === "cyber-matrix" ? "#22d3ee" : accentColor }}
          />
          <span
            className="absolute top-1 right-1 w-2.5 h-2.5 border-t-2 border-r-2 pointer-events-none transition-colors"
            style={{ borderColor: style === "gold-luxury" ? "#fbbf24" : style === "cyber-matrix" ? "#22d3ee" : accentColor }}
          />
          <span
            className="absolute bottom-1 left-1 w-2.5 h-2.5 border-b-2 border-l-2 pointer-events-none transition-colors"
            style={{ borderColor: style === "gold-luxury" ? "#fbbf24" : style === "cyber-matrix" ? "#22d3ee" : accentColor }}
          />
          <span
            className="absolute bottom-1 right-1 w-2.5 h-2.5 border-b-2 border-r-2 pointer-events-none transition-colors"
            style={{ borderColor: style === "gold-luxury" ? "#fbbf24" : style === "cyber-matrix" ? "#22d3ee" : accentColor }}
          />
        </>
      )}

      {/* Cyber scanning beam animation when hovered */}
      <div className="absolute inset-x-2 top-2 h-0.5 bg-cyan-400 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity pointer-events-none" />

      {/* QR Image Frame */}
      <div
        className={`relative overflow-hidden rounded-lg flex items-center justify-center ${
          style === "clean-minimal" ? "bg-white" : "bg-black/30 backdrop-blur-xs p-1"
        }`}
        style={{
          width: `${sizePx}px`,
          height: `${sizePx}px`,
        }}
      >
        {qrDataUrl ? (
          <img
            src={qrDataUrl}
            alt="Scan QR code"
            className="w-full h-full object-contain filter drop-shadow-sm"
          />
        ) : (
          <QrCode className="w-8 h-8 animate-pulse opacity-50" />
        )}

        {/* Center decorative brand emblem / scan glyph */}
        <div
          className={`absolute w-5 h-5 rounded-full flex items-center justify-center shadow-md transition-transform group-hover:scale-110 ${
            style === "gold-luxury"
              ? "bg-amber-500 text-slate-950"
              : style === "cyber-matrix"
              ? "bg-cyan-500 text-slate-950"
              : style === "clean-minimal"
              ? "bg-slate-900 text-white"
              : "bg-indigo-600 text-white"
          }`}
        >
          <Scan className="w-3 h-3 stroke-[2.5]" />
        </div>
      </div>

      {/* Label and Offline Scan Call-to-Action */}
      <div className="mt-1.5 flex flex-col items-center text-center">
        <div className="flex items-center justify-center gap-1">
          {config.showScanIcon !== false && (
            <Smartphone className="w-2.5 h-2.5 opacity-80 shrink-0" />
          )}
          <span
            className={`text-[9px] font-extrabold uppercase tracking-wider leading-tight whitespace-nowrap ${
              style === "gold-luxury"
                ? "text-amber-300 font-['Cinzel',serif]"
                : style === "cyber-matrix"
                ? "text-cyan-300 font-mono"
                : style === "clean-minimal"
                ? "text-slate-800 font-bold"
                : "text-white font-bold"
            }`}
          >
            {label}
          </span>
        </div>

        {/* Simulated scan feedback badge */}
        {isScanned ? (
          <span className="text-[8px] font-mono text-emerald-400 font-black mt-0.5 animate-bounce">
            Scanned! ✓
          </span>
        ) : (
          <span className="text-[7px] font-mono opacity-60 leading-none mt-0.5 flex items-center gap-0.5 group-hover:opacity-100">
            <span>Scan or click</span>
            <ArrowUpRight className="w-2 h-2" />
          </span>
        )}
      </div>
    </div>
  );
};
