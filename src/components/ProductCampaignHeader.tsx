import React, { useState } from "react";
import { Sparkles, Globe, RefreshCw, Wand2, ArrowRight } from "lucide-react";

interface ProductCampaignHeaderProps {
  productName: string;
  productDescription: string;
  targetUrl: string;
  tone: string;
  onUpdateDetails: (details: {
    productName: string;
    productDescription: string;
    targetUrl: string;
    tone: string;
  }) => void;
  onGenerateCampaign: () => Promise<void>;
  isGenerating: boolean;
}

export const ProductCampaignHeader: React.FC<ProductCampaignHeaderProps> = ({
  productName,
  productDescription,
  targetUrl,
  tone,
  onUpdateDetails,
  onGenerateCampaign,
  isGenerating,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const TONES = [
    "Premium & High-Converting",
    "Urgency & Flash Sale",
    "Minimalist Luxury",
    "Tech & Innovation",
    "Warm Lifestyle",
  ];

  const handleQuickLoadDemo = (type: "headphones" | "sneakers" | "saas") => {
    if (type === "headphones") {
      onUpdateDetails({
        productName: "Aura One Pro Headphones",
        productDescription: "High-end wireless noise-cancelling headphones featuring 50mm beryllium drivers, 48-hour battery life, and lossless spatial audio.",
        targetUrl: "https://aura-acoustics.audio/pro",
        tone: "Premium & High-Converting",
      });
    } else if (type === "sneakers") {
      onUpdateDetails({
        productName: "AeroGlide Carbon Sneakers",
        productDescription: "Ultralight carbon-plated marathon running shoes with responsive supercritical foam, adaptive knit upper, and energy return technology.",
        targetUrl: "https://aeroglide.run/speed",
        tone: "Tech & Innovation",
      });
    } else {
      onUpdateDetails({
        productName: "PulseMetric AI Analytics",
        productDescription: "Enterprise customer telemetry platform with real-time churn prediction, cohort analytics, and automated automated experimentation.",
        targetUrl: "https://pulsemetric.io/start",
        tone: "Tech & Innovation",
      });
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
      {/* Glow Effect */}
      <div className="absolute top-0 left-1/4 w-96 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800/80 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[11px] font-mono font-bold uppercase tracking-wider">
              Gemini Generative Engine
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Product to All Standard Banner Sizes
            </span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1 tracking-tight">
            Banner Ad Generator & A/B Studio
          </h1>
        </div>

        {/* Quick Demo Samples */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-400">Sample Products:</span>
          <button
            type="button"
            onClick={() => handleQuickLoadDemo("headphones")}
            className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md border border-slate-700 transition-colors"
          >
            🎧 Audio
          </button>
          <button
            type="button"
            onClick={() => handleQuickLoadDemo("sneakers")}
            className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md border border-slate-700 transition-colors"
          >
            👟 Sneakers
          </button>
          <button
            type="button"
            onClick={() => handleQuickLoadDemo("saas")}
            className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md border border-slate-700 transition-colors"
          >
            ⚡ SaaS
          </button>
        </div>
      </div>

      {/* Product Details Form */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-5 relative z-10">
        {/* Product Name */}
        <div className="md:col-span-4">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 block">
            Product / Brand Name
          </label>
          <input
            type="text"
            value={productName}
            onChange={(e) =>
              onUpdateDetails({
                productName: e.target.value,
                productDescription,
                targetUrl,
                tone,
              })
            }
            placeholder="e.g. Aura One Pro Wireless Headphones"
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 font-semibold"
          />
        </div>

        {/* Target URL */}
        <div className="md:col-span-5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 block flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            <span>Target Landing Page URL</span>
          </label>
          <input
            type="url"
            value={targetUrl}
            onChange={(e) =>
              onUpdateDetails({
                productName,
                productDescription,
                targetUrl: e.target.value,
                tone,
              })
            }
            placeholder="https://brand.com/product"
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
          />
        </div>

        {/* Tone Selector */}
        <div className="md:col-span-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 block">
            Ad Campaign Tone
          </label>
          <select
            value={tone}
            onChange={(e) =>
              onUpdateDetails({
                productName,
                productDescription,
                targetUrl,
                tone: e.target.value,
              })
            }
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
          >
            {TONES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Product Description */}
        <div className="md:col-span-12">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Product Description, Benefits & Key Features
            </label>
            <span className="text-[11px] text-slate-400">
              Used by AI to extract headlines, value propositions, and image prompts
            </span>
          </div>
          <textarea
            rows={2}
            value={productDescription}
            onChange={(e) =>
              onUpdateDetails({
                productName,
                productDescription: e.target.value,
                targetUrl,
                tone,
              })
            }
            placeholder="Describe the product, unique selling propositions, key specifications, discounts, and target audience..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed"
          />
        </div>
      </div>

      {/* Primary Generator Action Button */}
      <div className="mt-4 pt-3 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800/80 relative z-10">
        <p className="text-xs text-slate-400">
          Generates multi-variant headlines, high-converting CTAs, and prompts for 10 standard banner sizes.
        </p>

        <button
          type="button"
          onClick={onGenerateCampaign}
          disabled={isGenerating}
          className={`w-full sm:w-auto px-6 py-3 rounded-xl font-black text-sm shadow-xl flex items-center justify-center gap-2.5 transition-all ${
            isGenerating
              ? "bg-indigo-900/60 text-indigo-300 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30 hover:scale-[1.01] active:scale-[0.99]"
          }`}
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Analyzing URL & Synthesizing Ad Variants...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Generate Banner Ad Campaign Suite</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
