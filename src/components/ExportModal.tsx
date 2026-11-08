import React, { useState } from "react";
import { AdVariant, STANDARD_BANNER_SIZES, BannerDimension } from "../types";
import {
  Download,
  Code,
  FileJson,
  Check,
  Copy,
  X,
  Sparkles,
  ExternalLink,
} from "lucide-react";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  variant: AdVariant;
  campaignName: string;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  variant,
  campaignName,
}) => {
  const [activeTab, setActiveTab] = useState<"html" | "json" | "download">("html");
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const sampleSize = STANDARD_BANNER_SIZES[0]; // 300x250

  const htmlEmbedCode = `<!-- Standard IAB Display Ad: ${variant.copy.headline} (${sampleSize.width}x${sampleSize.height}) -->
<div id="ad-unit-${variant.id}" style="width:${sampleSize.width}px;height:${sampleSize.height}px;position:relative;overflow:hidden;font-family:'Outfit',sans-serif;background-color:${variant.template.primaryColor};border:1px solid rgba(255,255,255,0.15);">
  <a href="${variant.copy.targetUrl}?utm_source=display&utm_medium=banner&utm_campaign=${encodeURIComponent(campaignName)}" target="_blank" rel="noopener noreferrer" style="text-decoration:none;display:block;width:100%;height:100%;">
    <img src="${variant.image.imageUrl}" alt="${variant.copy.headline}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;" />
    <div style="position:absolute;inset:0;background:linear-gradient(to top, rgba(15,23,42,0.92) 0%, rgba(15,23,42,${variant.template.overlayOpacity}) 60%, rgba(15,23,42,0.3) 100%);"></div>
    <div style="position:relative;z-index:10;display:flex;flex-direction:column;justify-content:between;height:100%;padding:16px;box-sizing:border-box;">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span style="font-size:11px;text-transform:uppercase;font-weight:800;letter-spacing:1px;color:#fff;">${variant.copy.brandName}</span>
        <span style="font-size:10px;font-weight:700;background:#fbbf24;color:#000;padding:2px 8px;border-radius:9999px;">${variant.copy.badgeText}</span>
      </div>
      <div style="margin:auto 0;">
        <h3 style="font-size:18px;font-weight:900;color:#fff;margin:0 0 4px 0;line-height:1.2;">${variant.copy.headline}</h3>
        <p style="font-size:12px;color:rgba(255,255,255,0.85);margin:0;line-height:1.4;">${variant.copy.subheadline}</p>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span style="background-color:${variant.template.accentColor};color:#fff;padding:8px 16px;font-size:12px;font-weight:800;border-radius:6px;box-shadow:0 4px 6px -1px rgba(0,0,0,0.2);">${variant.copy.ctaText}</span>
        <span style="font-size:10px;color:rgba(255,255,255,0.6);font-family:monospace;">${new URL(variant.copy.targetUrl || "https://example.com").hostname}</span>
      </div>
    </div>
  </a>
</div>`;

  const campaignJsonCode = JSON.stringify(
    {
      campaign: campaignName,
      exportedAt: new Date().toISOString(),
      variant: {
        id: variant.id,
        name: variant.name,
        hypothesis: variant.hypothesis,
        copy: variant.copy,
        template: variant.template,
        image: {
          model: variant.image.model,
          resolution: variant.image.imageSize,
          aspectRatio: variant.image.aspectRatio,
          prompt: variant.image.prompt,
          url: variant.image.imageUrl,
        },
      },
      supportedSizes: STANDARD_BANNER_SIZES.map((s) => ({
        id: s.id,
        name: s.name,
        width: s.width,
        height: s.height,
        iabStandard: true,
      })),
    },
    null,
    2
  );

  const handleCopy = (text: string, type: "html" | "json") => {
    navigator.clipboard.writeText(text);
    if (type === "html") {
      setCopiedHtml(true);
      setTimeout(() => setCopiedHtml(false), 2500);
    } else {
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 2500);
    }
  };

  const handleSimulatedDownload = (sizeName: string) => {
    setDownloadNotice(`Downloading ${sizeName} visual package for ${variant.name}...`);
    setTimeout(() => {
      // Trigger SVG / image download
      const link = document.createElement("a");
      link.href = variant.image.imageUrl;
      link.download = `${variant.name.replace(/\s+/g, "_")}_${sizeName}.png`;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.click();
      setDownloadNotice(null);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Export Banner Ad Assets & Code
              </h3>
              <p className="text-xs text-slate-400">
                Ready for Google Display Network, Meta Ads, DSPs, and custom embeds.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-slate-800 bg-slate-900">
          <button
            type="button"
            onClick={() => setActiveTab("html")}
            className={`pb-3 px-3 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-all ${
              activeTab === "html"
                ? "border-indigo-500 text-white"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Code className="w-4 h-4 text-indigo-400" />
            <span>HTML5 Ad Tag Snippet</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("download")}
            className={`pb-3 px-3 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-all ${
              activeTab === "download"
                ? "border-indigo-500 text-white"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Production Assets (All Sizes)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("json")}
            className={`pb-3 px-3 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-all ${
              activeTab === "json"
                ? "border-indigo-500 text-white"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <FileJson className="w-4 h-4 text-amber-400" />
            <span>Campaign JSON Manifest</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {activeTab === "html" && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400 font-mono">
                  Standard responsive self-contained display tag:
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(htmlEmbedCode, "html")}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  {copiedHtml ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied Snippet!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy HTML Tag</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 font-mono overflow-x-auto leading-relaxed">
                {htmlEmbedCode}
              </pre>
            </div>
          )}

          {activeTab === "download" && (
            <div className="space-y-3">
              <p className="text-xs text-slate-300">
                Download individual high-resolution banner ad visuals for programmatic placement:
              </p>

              {downloadNotice && (
                <div className="p-3 bg-indigo-950/70 border border-indigo-700 text-indigo-200 text-xs rounded-lg flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                  <span>{downloadNotice}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {STANDARD_BANNER_SIZES.map((size) => (
                  <div
                    key={size.id}
                    className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between hover:border-slate-700 transition-colors"
                  >
                    <div>
                      <span className="text-xs font-bold text-white block">
                        {size.name}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        {size.width} × {size.height} px • {size.category}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSimulatedDownload(`${size.width}x${size.height}`)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Download</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "json" && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400 font-mono">
                  Machine-readable creative specification:
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(campaignJsonCode, "json")}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  {copiedJson ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied JSON!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy JSON</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 font-mono overflow-x-auto leading-relaxed max-h-[340px]">
                {campaignJsonCode}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
