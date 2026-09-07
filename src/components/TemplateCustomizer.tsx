import React, { useState } from "react";
import {
  AdVariant,
  TemplateTheme,
  TemplateCustomization,
  AdCopy,
  BrandKitPreset,
} from "../types";
import { BrandKitGenerator } from "./BrandKitGenerator";
import {
  Palette,
  Type,
  Layout,
  Sliders,
  Sparkles,
  Tag,
  MousePointerClick,
  Variable,
  Plus,
  Trash2,
  Check,
  Split,
  HelpCircle,
  QrCode,
  Smartphone,
} from "lucide-react";

interface TemplateCustomizerProps {
  variant: AdVariant;
  onChangeCopy: (copy: AdCopy) => void;
  onChangeTemplate: (template: TemplateCustomization) => void;
}

export const TemplateCustomizer: React.FC<TemplateCustomizerProps> = ({
  variant,
  onChangeCopy,
  onChangeTemplate,
}) => {
  const { copy, template } = variant;

  // New variable inputs state
  const [newVarKey, setNewVarKey] = useState("");
  const [newVarVal, setNewVarVal] = useState("");
  const [newCtaText, setNewCtaText] = useState("");

  const THEMES: Array<{
    id: TemplateTheme;
    name: string;
    primary: string;
    accent: string;
    font: "Outfit" | "Plus Jakarta Sans" | "Space Grotesk" | "Cinzel";
    desc: string;
  }> = [
    {
      id: "modern-glass",
      name: "Modern Glass",
      primary: "#0f172a",
      accent: "#3b82f6",
      font: "Outfit",
      desc: "Clean translucent depth with crisp blue accents",
    },
    {
      id: "bold-vibrant",
      name: "Bold Vibrant",
      primary: "#18181b",
      accent: "#ef4444",
      font: "Space Grotesk",
      desc: "High energy contrast engineered for flash sales & urgency",
    },
    {
      id: "luxury-minimal",
      name: "Luxury Minimal",
      primary: "#09090b",
      accent: "#d4af37",
      font: "Cinzel",
      desc: "Editorial elegance, warm gold metallic accent",
    },
    {
      id: "cyber-neon",
      name: "Cyber Neon",
      primary: "#020617",
      accent: "#06b6d4",
      font: "Space Grotesk",
      desc: "Dark technological grid with neon cyan glow",
    },
    {
      id: "warm-organic",
      name: "Warm Organic",
      primary: "#1c1917",
      accent: "#10b981",
      font: "Plus Jakarta Sans",
      desc: "Earthy wellness tones with natural emerald accents",
    },
  ];

  const FONTS: Array<"Outfit" | "Plus Jakarta Sans" | "Space Grotesk" | "Cinzel"> = [
    "Outfit",
    "Plus Jakarta Sans",
    "Space Grotesk",
    "Cinzel",
  ];

  const ACCENT_SWATCHES = [
    "#3b82f6", // Blue
    "#ef4444", // Crimson Red
    "#10b981", // Emerald
    "#f59e0b", // Amber
    "#8b5cf6", // Purple
    "#ec4899", // Pink
    "#06b6d4", // Cyan
    "#ffffff", // White
  ];

  const handleApplyTheme = (themeItem: (typeof THEMES)[0]) => {
    onChangeTemplate({
      ...template,
      theme: themeItem.id,
      primaryColor: themeItem.primary,
      accentColor: themeItem.accent,
      fontFamily: themeItem.font,
    });
  };

  // Dynamic variable helpers
  const dynamicVars = copy.dynamicVariables || {
    discount_percentage: "35",
    promo_code: "AURA35",
    price: "$199",
    city: "New York",
  };

  const handleAddVariable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVarKey.trim()) return;
    const cleanKey = newVarKey.trim().replace(/[^a-zA-Z0-9_]/g, "_");
    const updated = {
      ...dynamicVars,
      [cleanKey]: newVarVal.trim() || "Value",
    };
    onChangeCopy({
      ...copy,
      dynamicVariables: updated,
    });
    setNewVarKey("");
    setNewVarVal("");
  };

  const handleUpdateVariableValue = (key: string, value: string) => {
    const updated = {
      ...dynamicVars,
      [key]: value,
    };
    onChangeCopy({
      ...copy,
      dynamicVariables: updated,
    });
  };

  const handleDeleteVariable = (key: string) => {
    const updated = { ...dynamicVars };
    delete updated[key];
    onChangeCopy({
      ...copy,
      dynamicVariables: updated,
    });
  };

  const handleInsertPlaceholder = (field: "headline" | "subheadline", varKey: string) => {
    const placeholder = `{{${varKey}}}`;
    const currentValue = copy[field] || "";
    onChangeCopy({
      ...copy,
      [field]: currentValue ? `${currentValue} ${placeholder}` : placeholder,
    });
  };

  // Alternative CTAs helpers
  const alternativeCtas = copy.alternativeCtas || [
    "Shop Now",
    "Claim 35% Off",
    "Learn More",
    "Get Offer",
  ];

  const handleAddCta = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCtaText.trim()) return;
    if (!alternativeCtas.includes(newCtaText.trim())) {
      onChangeCopy({
        ...copy,
        alternativeCtas: [...alternativeCtas, newCtaText.trim()],
      });
    }
    setNewCtaText("");
  };

  const handleRemoveCta = (cta: string) => {
    const filtered = alternativeCtas.filter((c) => c !== cta);
    onChangeCopy({
      ...copy,
      alternativeCtas: filtered,
    });
  };

  const handleSetActiveCta = (cta: string) => {
    onChangeCopy({
      ...copy,
      ctaText: cta,
    });
  };

  const handleApplyBrandKit = (kit: BrandKitPreset) => {
    onChangeTemplate({
      ...template,
      theme: kit.theme,
      primaryColor: kit.primaryColor,
      secondaryColor: kit.secondaryColor,
      accentColor: kit.accentColor,
      textColor: kit.textColor,
      fontFamily: kit.fontFamily,
      buttonStyle: kit.buttonStyle,
    });
  };

  return (
    <div id="template-customizer-root" className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-slate-200 shadow-xl space-y-6">
      {/* 0. Comprehensive Brand Kit Generator & Presets */}
      <BrandKitGenerator
        currentUrl={copy.targetUrl || "https://bose.com"}
        brandName={copy.brandName}
        currentTemplate={template}
        onApplyBrandKit={handleApplyBrandKit}
      />

      {/* 1. Theme Presets */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Palette className="w-4 h-4 text-indigo-400" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Ad Layout Theme Preset
          </h4>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {THEMES.map((th) => (
            <button
              key={th.id}
              type="button"
              onClick={() => handleApplyTheme(th)}
              className={`p-3 rounded-lg border text-left transition-all ${
                template.theme === th.id
                  ? "bg-indigo-600/20 border-indigo-500 shadow-sm ring-1 ring-indigo-500/50 text-white"
                  : "bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/60"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="w-3 h-3 rounded-full border border-white/20"
                  style={{ backgroundColor: th.accent }}
                />
                <span className="text-xs font-bold">{th.name}</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight line-clamp-2">
                {th.desc}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Banner Copy & Dynamic Text Insertions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Type className="w-4 h-4 text-indigo-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Ad Copy & Dynamic Text
            </h4>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            Supports {"{{placeholder}}"} syntax
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-semibold text-slate-400 mb-1 block">
              Brand / Company Name
            </label>
            <input
              type="text"
              value={copy.brandName}
              onChange={(e) => onChangeCopy({ ...copy, brandName: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-semibold text-slate-400">
                Primary Headline (High Impact)
              </label>
              {/* Insert variable pills */}
              <div className="flex items-center gap-1 overflow-x-auto">
                {Object.keys(dynamicVars).slice(0, 2).map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => handleInsertPlaceholder("headline", k)}
                    className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-indigo-300 font-mono"
                    title={`Insert {{${k}}}`}
                  >
                    +{"{{"}{k}{"}}"}
                  </button>
                ))}
              </div>
            </div>
            <input
              type="text"
              value={copy.headline}
              onChange={(e) => onChangeCopy({ ...copy, headline: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 font-bold"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-semibold text-slate-400">
                Subheadline / Value Prop
              </label>
              <div className="flex items-center gap-1 overflow-x-auto">
                {Object.keys(dynamicVars).slice(0, 2).map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => handleInsertPlaceholder("subheadline", k)}
                    className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-indigo-300 font-mono"
                    title={`Insert {{${k}}}`}
                  >
                    +{"{{"}{k}{"}}"}
                  </button>
                ))}
              </div>
            </div>
            <input
              type="text"
              value={copy.subheadline}
              onChange={(e) => onChangeCopy({ ...copy, subheadline: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-400 mb-1 block">
              Offer / Promo Badge Text
            </label>
            <input
              type="text"
              value={copy.badgeText}
              onChange={(e) => onChangeCopy({ ...copy, badgeText: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-[11px] font-semibold text-slate-400 mb-1 block">
              Target Landing URL
            </label>
            <input
              type="text"
              value={copy.targetUrl}
              onChange={(e) => onChangeCopy({ ...copy, targetUrl: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>
        </div>
      </div>

      {/* 3. Dynamic Variables Manager */}
      <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Variable className="w-4 h-4 text-indigo-400" />
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Dynamic Text Variables
            </h5>
          </div>
          <span className="text-[10px] text-slate-400">
            Define placeholders interpolated at render time
          </span>
        </div>

        {/* Existing Variables List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {Object.entries(dynamicVars).map(([key, val]) => (
            <div
              key={key}
              className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg p-2 group hover:border-slate-700"
            >
              <span className="font-mono text-[11px] text-indigo-400 bg-indigo-950/60 px-1.5 py-0.5 rounded shrink-0">
                {"{{"}{key}{"}}"}
              </span>
              <input
                type="text"
                value={val}
                onChange={(e) => handleUpdateVariableValue(key, e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-0.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
              />
              <button
                type="button"
                onClick={() => handleDeleteVariable(key)}
                className="text-slate-500 hover:text-red-400 p-1 rounded opacity-60 group-hover:opacity-100 transition-opacity"
                title={`Delete {{${key}}}`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Add New Variable Inline Form */}
        <form onSubmit={handleAddVariable} className="flex items-center gap-2 pt-1">
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 flex-1">
            <span className="text-xs font-mono text-slate-500">{"{{"}</span>
            <input
              type="text"
              value={newVarKey}
              onChange={(e) => setNewVarKey(e.target.value)}
              placeholder="variable_name"
              className="w-full bg-transparent text-xs text-indigo-300 font-mono focus:outline-none placeholder-slate-600"
            />
            <span className="text-xs font-mono text-slate-500">{"}}"}</span>
          </div>
          <input
            type="text"
            value={newVarVal}
            onChange={(e) => setNewVarVal(e.target.value)}
            placeholder="Default value (e.g. 35, Miami, $199)"
            className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 flex-1 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Variable
          </button>
        </form>
      </div>

      {/* 4. Multiple Call-to-Action (CTA) Buttons & Variations */}
      <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MousePointerClick className="w-4 h-4 text-indigo-400" />
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Multiple Call-to-Action (CTA) Buttons & Testing Options
            </h5>
          </div>
          <span className="text-[10px] text-slate-400">
            Define alternative CTAs for A/B variations
          </span>
        </div>

        {/* Primary CTA and Secondary CTA settings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-semibold text-slate-300 mb-1 block">
              Primary Active CTA Text
            </label>
            <input
              type="text"
              value={copy.ctaText}
              onChange={(e) => onChangeCopy({ ...copy, ctaText: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white font-bold focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-semibold text-slate-300">
                Secondary CTA Button
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-indigo-400">
                <input
                  type="checkbox"
                  checked={template.showSecondaryCta ?? true}
                  onChange={(e) =>
                    onChangeTemplate({
                      ...template,
                      showSecondaryCta: e.target.checked,
                    })
                  }
                  className="rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-0"
                />
                <span>Render Secondary Button</span>
              </label>
            </div>
            <input
              type="text"
              value={copy.secondaryCtaText || "Learn More"}
              onChange={(e) =>
                onChangeCopy({ ...copy, secondaryCtaText: e.target.value })
              }
              placeholder="e.g. Learn More, View Specs, Watch Demo"
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Alternative CTA Variations List */}
        <div>
          <label className="text-[11px] font-semibold text-slate-400 mb-1.5 block">
            Alternative CTAs (Click to activate in this variant or test):
          </label>
          <div className="flex flex-wrap items-center gap-2">
            {alternativeCtas.map((cta) => {
              const isActive = copy.ctaText === cta;
              return (
                <div
                  key={cta}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs transition-all ${
                    isActive
                      ? "bg-indigo-600/30 border-indigo-500 text-white font-bold shadow-xs"
                      : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => handleSetActiveCta(cta)}
                    className="flex items-center gap-1 hover:underline"
                  >
                    {isActive && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                    <span>{cta}</span>
                  </button>
                  {alternativeCtas.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveCta(cta)}
                      className="text-slate-500 hover:text-red-400 ml-1 p-0.5"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Add CTA Form */}
          <form onSubmit={handleAddCta} className="flex items-center gap-2 mt-2">
            <input
              type="text"
              value={newCtaText}
              onChange={(e) => setNewCtaText(e.target.value)}
              placeholder="Add another CTA alternative (e.g. Get Offer, Try Free)..."
              className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 flex-1 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add CTA
            </button>
          </form>
        </div>
      </div>

      {/* 5. Typography & Styling Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2 border-t border-slate-800">
        {/* Font Family */}
        <div>
          <label className="text-xs font-bold text-slate-400 mb-1.5 block">
            Typography
          </label>
          <select
            value={template.fontFamily}
            onChange={(e) =>
              onChangeTemplate({
                ...template,
                fontFamily: e.target.value as any,
              })
            }
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
          >
            {FONTS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>

        {/* Button Style */}
        <div>
          <label className="text-xs font-bold text-slate-400 mb-1.5 block">
            CTA Button Geometry
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { id: "rounded-md", label: "Rounded" },
              { id: "rounded-full", label: "Pill" },
              { id: "rounded-none", label: "Sharp" },
            ].map((btn) => (
              <button
                key={btn.id}
                type="button"
                onClick={() =>
                  onChangeTemplate({
                    ...template,
                    buttonStyle: btn.id as any,
                  })
                }
                className={`py-1.5 px-2 text-xs font-semibold border rounded transition-all ${
                  template.buttonStyle === btn.id
                    ? "bg-indigo-600 border-indigo-500 text-white"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* CTA Accent Color */}
        <div>
          <label className="text-xs font-bold text-slate-400 mb-1.5 block">
            CTA Accent Color
          </label>
          <div className="flex items-center gap-1.5 flex-wrap">
            {ACCENT_SWATCHES.map((hex) => (
              <button
                key={hex}
                type="button"
                onClick={() => onChangeTemplate({ ...template, accentColor: hex })}
                className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${
                  template.accentColor === hex
                    ? "border-white scale-110 shadow-sm"
                    : "border-transparent"
                }`}
                style={{ backgroundColor: hex }}
                title={hex}
              />
            ))}
            <input
              type="color"
              value={template.accentColor}
              onChange={(e) => onChangeTemplate({ ...template, accentColor: e.target.value })}
              className="w-6 h-6 rounded border-0 bg-transparent cursor-pointer ml-1"
              title="Custom hex color"
            />
          </div>
        </div>
      </div>

      {/* 6. Overlay & Badge Toggles */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-slate-800">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-300">
            <input
              type="checkbox"
              checked={template.showBadge}
              onChange={(e) => onChangeTemplate({ ...template, showBadge: e.target.checked })}
              className="rounded bg-slate-950 border-slate-700 text-indigo-600 focus:ring-0"
            />
            <span>Show Offer Badge</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-300">
            <input
              type="checkbox"
              checked={template.showBorder}
              onChange={(e) => onChangeTemplate({ ...template, showBorder: e.target.checked })}
              className="rounded bg-slate-950 border-slate-700 text-indigo-600 focus:ring-0"
            />
            <span>Show Subtle Ad Border</span>
          </label>
        </div>

        {/* Overlay Darkening */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400 shrink-0">Overlay Darkening:</span>
          <input
            type="range"
            min="0.2"
            max="0.85"
            step="0.05"
            value={template.overlayOpacity}
            onChange={(e) =>
              onChangeTemplate({
                ...template,
                overlayOpacity: parseFloat(e.target.value),
              })
            }
            className="w-28 accent-indigo-500"
          />
          <span className="text-xs font-mono text-slate-300 shrink-0">
            {Math.round(template.overlayOpacity * 100)}%
          </span>
        </div>
      </div>

      {/* 7. Decorative QR Code Overlay & Offline Tracking */}
      <div className="pt-4 border-t border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <QrCode className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-bold text-slate-200">
              Decorative QR Code Overlay (Offline-to-Online Attribution)
            </span>
          </div>
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-indigo-400">
            <input
              type="checkbox"
              checked={template.qrCode?.enabled ?? true}
              onChange={(e) =>
                onChangeTemplate({
                  ...template,
                  qrCode: {
                    ...(template.qrCode || {
                      style: "glass-glow",
                      labelText: "Scan to Shop",
                      trackingCampaign: "banner_ooh",
                      showScanIcon: true,
                      cornerMarkerStyle: "bracket",
                    }),
                    enabled: e.target.checked,
                  },
                })
              }
              className="rounded bg-slate-950 border-slate-700 text-indigo-600 focus:ring-0"
            />
            <span>Enable QR Overlay</span>
          </label>
        </div>

        {(template.qrCode?.enabled ?? true) && (
          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 space-y-3">
            {/* Style Preset Selector */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">
                Decorative Aesthetic Style
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  {
                    id: "glass-glow" as const,
                    name: "Glass Glow",
                    desc: "Frosted dark glass & cyan neon brackets",
                  },
                  {
                    id: "gold-luxury" as const,
                    name: "Gold Luxury",
                    desc: "24k gold border & regal serif styling",
                  },
                  {
                    id: "cyber-matrix" as const,
                    name: "Cyber Matrix",
                    desc: "HUD targeting reticle & glowing scan line",
                  },
                  {
                    id: "clean-minimal" as const,
                    name: "Clean Minimal",
                    desc: "Monochrome high-contrast architectural card",
                  },
                ].map((s) => {
                  const isSelected = (template.qrCode?.style || "glass-glow") === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() =>
                        onChangeTemplate({
                          ...template,
                          qrCode: {
                            ...(template.qrCode || {
                              enabled: true,
                              labelText: "Scan to Shop",
                              trackingCampaign: "banner_ooh",
                              showScanIcon: true,
                              cornerMarkerStyle: "bracket",
                            }),
                            style: s.id,
                          },
                        })
                      }
                      className={`text-left p-2 rounded-md border text-xs transition-all ${
                        isSelected
                          ? "bg-indigo-950/50 border-indigo-500 text-white shadow-sm ring-1 ring-indigo-500/40"
                          : "bg-slate-900/50 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                      }`}
                    >
                      <span className="font-bold block text-[11px]">{s.name}</span>
                      <span className="text-[9px] text-slate-400 line-clamp-1">
                        {s.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Inputs: Label Text & Tracking Campaign */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-slate-300 mb-1 block">
                  Scan Callout Label
                </label>
                <input
                  type="text"
                  value={template.qrCode?.labelText ?? "Scan to Shop"}
                  onChange={(e) =>
                    onChangeTemplate({
                      ...template,
                      qrCode: {
                        ...(template.qrCode || {
                          enabled: true,
                          style: "glass-glow",
                          trackingCampaign: "banner_ooh",
                          showScanIcon: true,
                          cornerMarkerStyle: "bracket",
                        }),
                        labelText: e.target.value,
                      },
                    })
                  }
                  placeholder="e.g. Scan to Claim 35% Off"
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-300 mb-1 block">
                  Campaign UTM Tag (OOH Attribution)
                </label>
                <input
                  type="text"
                  value={template.qrCode?.trackingCampaign ?? "banner_ooh"}
                  onChange={(e) =>
                    onChangeTemplate({
                      ...template,
                      qrCode: {
                        ...(template.qrCode || {
                          enabled: true,
                          style: "glass-glow",
                          labelText: "Scan to Shop",
                          showScanIcon: true,
                          cornerMarkerStyle: "bracket",
                        }),
                        trackingCampaign: e.target.value,
                      },
                    })
                  }
                  placeholder="e.g. billboard_times_square"
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Deep-link Preview & Toggles */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-1">
              <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                <span className="text-slate-500">Deep-link:</span>
                <span className="text-indigo-300 truncate max-w-[280px]">
                  {copy.targetUrl}?utm_source=offline_qr&utm_campaign={template.qrCode?.trackingCampaign || "banner_ooh"}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-slate-300">
                  <input
                    type="checkbox"
                    checked={template.qrCode?.showScanIcon ?? true}
                    onChange={(e) =>
                      onChangeTemplate({
                        ...template,
                        qrCode: {
                          ...(template.qrCode || {
                            enabled: true,
                            style: "glass-glow",
                            labelText: "Scan to Shop",
                            trackingCampaign: "banner_ooh",
                            cornerMarkerStyle: "bracket",
                          }),
                          showScanIcon: e.target.checked,
                        },
                      })
                    }
                    className="rounded bg-slate-950 border-slate-700 text-indigo-600 focus:ring-0 w-3 h-3"
                  />
                  <span>Phone Icon</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-slate-300">
                  <input
                    type="checkbox"
                    checked={(template.qrCode?.cornerMarkerStyle ?? "bracket") === "bracket"}
                    onChange={(e) =>
                      onChangeTemplate({
                        ...template,
                        qrCode: {
                          ...(template.qrCode || {
                            enabled: true,
                            style: "glass-glow",
                            labelText: "Scan to Shop",
                            trackingCampaign: "banner_ooh",
                            showScanIcon: true,
                          }),
                          cornerMarkerStyle: e.target.checked ? "bracket" : "rounded",
                        },
                      })
                    }
                    className="rounded bg-slate-950 border-slate-700 text-indigo-600 focus:ring-0 w-3 h-3"
                  />
                  <span>Corner Brackets</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
