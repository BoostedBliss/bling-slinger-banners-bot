import React, { useState, useEffect } from "react";
import { BrandKitPreset, TemplateCustomization, TemplateTheme } from "../types";
import {
  Sparkles,
  Globe,
  Palette,
  Bookmark,
  Check,
  Trash2,
  AlertCircle,
  Type,
  Layers,
  ArrowRight,
  SlidersHorizontal,
} from "lucide-react";

interface BrandKitGeneratorProps {
  currentUrl: string;
  brandName?: string;
  currentTemplate: TemplateCustomization;
  onApplyBrandKit: (kit: BrandKitPreset) => void;
}

const STORAGE_KEY = "banner_craft_brand_kits_v1";

const DEFAULT_BRAND_KITS: BrandKitPreset[] = [
  {
    id: "kit-aura",
    name: "Aura Signature",
    sourceUrl: "https://aura-acoustics.com",
    domain: "aura-acoustics.com",
    brandVibe: "Contemporary Precision Audio",
    primaryColor: "#0f172a",
    secondaryColor: "#1e293b",
    accentColor: "#3b82f6",
    textColor: "#ffffff",
    fontFamily: "Outfit",
    bodyFont: "Plus Jakarta Sans",
    theme: "modern-glass",
    buttonStyle: "rounded-full",
    colorPalette: ["#0f172a", "#1e293b", "#3b82f6", "#64748b", "#ffffff"],
    createdAt: "2026-09-01",
  },
  {
    id: "kit-luxury",
    name: "Couture Atelier Gold",
    sourceUrl: "https://vogue-editorial.com",
    domain: "vogue-editorial.com",
    brandVibe: "Editorial High-End Luxury",
    primaryColor: "#09090b",
    secondaryColor: "#18181b",
    accentColor: "#d4af37",
    textColor: "#f8fafc",
    fontFamily: "Cinzel",
    bodyFont: "Plus Jakarta Sans",
    theme: "luxury-minimal",
    buttonStyle: "rounded-none",
    colorPalette: ["#09090b", "#18181b", "#d4af37", "#a1a1aa", "#f8fafc"],
    createdAt: "2026-09-02",
  },
  {
    id: "kit-cyber",
    name: "Cyber Velocity Neon",
    sourceUrl: "https://matrix-tech.io",
    domain: "matrix-tech.io",
    brandVibe: "Futuristic Technological Glow",
    primaryColor: "#020617",
    secondaryColor: "#0f172a",
    accentColor: "#06b6d4",
    textColor: "#ffffff",
    fontFamily: "Space Grotesk",
    bodyFont: "Space Grotesk",
    theme: "cyber-neon",
    buttonStyle: "rounded-md",
    colorPalette: ["#020617", "#0f172a", "#06b6d4", "#38bdf8", "#ffffff"],
    createdAt: "2026-09-03",
  },
  {
    id: "kit-organic",
    name: "Verdant Botanics",
    sourceUrl: "https://pura-botanics.com",
    domain: "pura-botanics.com",
    brandVibe: "Holistic Organic Botanical",
    primaryColor: "#1c1917",
    secondaryColor: "#292524",
    accentColor: "#10b981",
    textColor: "#fafaf9",
    fontFamily: "Plus Jakarta Sans",
    bodyFont: "Plus Jakarta Sans",
    theme: "warm-organic",
    buttonStyle: "rounded-full",
    colorPalette: ["#1c1917", "#292524", "#10b981", "#78716c", "#fafaf9"],
    createdAt: "2026-09-04",
  },
];

export const BrandKitGenerator: React.FC<BrandKitGeneratorProps> = ({
  currentUrl,
  brandName,
  currentTemplate,
  onApplyBrandKit,
}) => {
  const [urlInput, setUrlInput] = useState(currentUrl || "https://bose.com");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [extractedKit, setExtractedKit] = useState<BrandKitPreset | null>(null);
  const [presetTitle, setPresetTitle] = useState("");
  const [appliedPresetId, setAppliedPresetId] = useState<string | null>(null);

  const [savedKits, setSavedKits] = useState<BrandKitPreset[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return DEFAULT_BRAND_KITS;
  });

  // Sync saved kits to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedKits));
    } catch {}
  }, [savedKits]);

  // Keep input updated if parent URL changes and input is empty
  useEffect(() => {
    if (currentUrl && !urlInput) {
      setUrlInput(currentUrl);
    }
  }, [currentUrl]);

  const handleAnalyzeUrl = async (overrideUrl?: string) => {
    const target = (overrideUrl || urlInput).trim();
    if (!target) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const res = await fetch("/api/generate-brand-kit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: target,
          productName: brandName || "Smart Consumer Product",
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to extract Brand Kit from URL");
      }

      const kitData: BrandKitPreset = {
        id: `kit-${Date.now()}`,
        name: json.data.name || `${json.data.domain} Brand Kit`,
        sourceUrl: target,
        domain: json.data.domain,
        brandVibe: json.data.brandVibe,
        primaryColor: json.data.primaryColor,
        secondaryColor: json.data.secondaryColor,
        accentColor: json.data.accentColor,
        textColor: json.data.textColor,
        fontFamily: json.data.fontFamily,
        bodyFont: json.data.bodyFont || "Plus Jakarta Sans",
        theme: json.data.theme as TemplateTheme,
        buttonStyle: json.data.buttonStyle,
        colorPalette: json.data.colorPalette || [
          json.data.primaryColor,
          json.data.secondaryColor,
          json.data.accentColor,
          "#64748b",
          json.data.textColor,
        ],
        createdAt: new Date().toISOString().split("T")[0],
      };

      setExtractedKit(kitData);
      setPresetTitle(kitData.name);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to analyze URL.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveAsPreset = () => {
    if (!extractedKit) return;
    const toSave: BrandKitPreset = {
      ...extractedKit,
      name: presetTitle.trim() || extractedKit.name,
      id: `custom-kit-${Date.now()}`,
    };

    setSavedKits((prev) => [toSave, ...prev]);
    onApplyBrandKit(toSave);
    setAppliedPresetId(toSave.id);
  };

  const handleDeletePreset = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedKits((prev) => prev.filter((k) => k.id !== id));
  };

  const handleApplyPreset = (kit: BrandKitPreset) => {
    onApplyBrandKit(kit);
    setAppliedPresetId(kit.id);
  };

  return (
    <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Palette className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white flex items-center gap-2">
              <span>Brand Kit & Color/Font Presets</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300">
                URL Scanner
              </span>
            </h4>
            <p className="text-[11px] text-slate-400">
              Analyze product URL to extract primary/secondary colors, font pairings, and save as presets.
            </p>
          </div>
        </div>
      </div>

      {/* URL Input Bar */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Globe className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-500" />
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAnalyzeUrl()}
              placeholder="e.g. https://bose.com, https://apple.com, or https://allbirds.com"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>
          <button
            type="button"
            disabled={isAnalyzing || !urlInput.trim()}
            onClick={() => handleAnalyzeUrl()}
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95 shrink-0"
          >
            {isAnalyzing ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Extracting...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Generate Brand Kit</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Sample URLs */}
        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 flex-wrap">
          <span className="font-semibold">Quick Try:</span>
          {["bose.com", "apple.com", "nike.com", "allbirds.com"].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => {
                const sample = `https://${d}`;
                setUrlInput(sample);
                handleAnalyzeUrl(sample);
              }}
              className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors"
            >
              {d}
            </button>
          ))}
        </div>

        {error && (
          <div className="p-2 rounded bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[11px] flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Extracted Brand Kit Card */}
      {extractedKit && (
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-indigo-500/40 shadow-lg space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">{extractedKit.name}</span>
              <span className="text-[10px] font-mono text-indigo-300 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/40">
                {extractedKit.domain}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 italic">
              {extractedKit.brandVibe}
            </span>
          </div>

          {/* Swatches & Typography Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Color Swatches */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Primary & Accent Palette
              </span>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {(extractedKit.colorPalette || [
                    extractedKit.primaryColor,
                    extractedKit.secondaryColor,
                    extractedKit.accentColor,
                  ]).map((color, i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded-md border border-slate-700 shadow-sm flex items-center justify-center text-[9px] font-mono text-white/90"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
                <div className="text-[10px] font-mono text-slate-400">
                  <span className="text-white font-bold">{extractedKit.accentColor}</span> (Accent)
                </div>
              </div>
            </div>

            {/* Typography & Theme Pairings */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Typography & Theme Pairing
              </span>
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200 font-semibold flex items-center gap-1">
                  <Type className="w-3 h-3 text-indigo-400" />
                  <span>{extractedKit.fontFamily}</span>
                </span>
                <span className="text-slate-500">+</span>
                <span className="text-slate-400 text-[11px]">{extractedKit.bodyFont}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-950/60 text-indigo-300 font-mono capitalize ml-auto">
                  {extractedKit.theme}
                </span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
            <input
              type="text"
              value={presetTitle}
              onChange={(e) => setPresetTitle(e.target.value)}
              placeholder="Preset Name"
              className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-indigo-500 flex-1 max-w-[200px]"
            />
            <button
              type="button"
              onClick={handleSaveAsPreset}
              className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
            >
              <Bookmark className="w-3 h-3" />
              <span>Save as Preset & Apply</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onApplyBrandKit(extractedKit);
                setAppliedPresetId(extractedKit.id);
              }}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition-colors"
            >
              Apply Only
            </button>
          </div>
        </div>
      )}

      {/* Preset Library List */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Bookmark className="w-3.5 h-3.5 text-indigo-400" />
            <span>Saved Brand Kit Presets ({savedKits.length})</span>
          </span>
          <span className="text-[10px] text-slate-500">1-Click Apply to Template</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {savedKits.map((kit) => {
            const isActive =
              currentTemplate.primaryColor === kit.primaryColor &&
              currentTemplate.accentColor === kit.accentColor &&
              currentTemplate.fontFamily === kit.fontFamily;

            const isCustom = kit.id.startsWith("custom-kit-");

            return (
              <div
                key={kit.id}
                onClick={() => handleApplyPreset(kit)}
                className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between gap-2 relative group ${
                  isActive
                    ? "bg-indigo-950/40 border-indigo-500 ring-1 ring-indigo-500/40 shadow-sm"
                    : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white">{kit.name}</span>
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono block">
                      {kit.domain}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    {isActive ? (
                      <span className="p-1 rounded bg-indigo-500/20 text-indigo-300">
                        <Check className="w-3 h-3" />
                      </span>
                    ) : null}

                    {isCustom && (
                      <button
                        type="button"
                        onClick={(e) => handleDeletePreset(kit.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 transition-all"
                        title="Delete custom preset"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Palette Bar & Font Info */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                  <div className="flex items-center gap-1">
                    {(kit.colorPalette || [kit.primaryColor, kit.secondaryColor, kit.accentColor]).slice(0, 4).map((c, i) => (
                      <div
                        key={i}
                        className="w-3.5 h-3.5 rounded-sm border border-slate-700"
                        style={{ backgroundColor: c }}
                        title={c}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                    <span className="text-slate-300">{kit.fontFamily}</span>
                    <span className="text-slate-600">•</span>
                    <span className="capitalize">{kit.theme.replace("-", " ")}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
