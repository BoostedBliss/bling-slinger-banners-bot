import React, { useState, useRef } from "react";
import {
  SupportedImageModel,
  SupportedImageSize,
  SupportedAspectRatio,
  AIImageState,
  ArtisticStyle,
  StockPhoto,
  CampaignData,
} from "../types";
import { STYLE_PRESETS } from "../data/mockDefaults";
import { ARTISTIC_STYLES, ArtisticStyleConfig } from "../utils/dynamicText";
import { StockPhotoModal } from "./StockPhotoModal";
import {
  Sparkles,
  Wand2,
  RefreshCw,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Maximize2,
  Layers,
  Image as ImageIcon,
  Palette,
  Upload,
  X,
  Camera,
  SlidersHorizontal,
  FolderSearch,
} from "lucide-react";

interface AIImageGeneratorPanelProps {
  currentImageState: AIImageState;
  productName: string;
  productDescription: string;
  campaign?: CampaignData;
  onApplyImage: (imageState: AIImageState) => void;
  onApplyToAllVariants?: (imageUrl: string) => void;
  recentAssets: string[];
}

export const AIImageGeneratorPanel: React.FC<AIImageGeneratorPanelProps> = ({
  currentImageState,
  productName,
  productDescription,
  campaign,
  onApplyImage,
  onApplyToAllVariants,
  recentAssets,
}) => {
  const [activeMode, setActiveMode] = useState<"standard" | "style-transfer">(
    currentImageState.referenceImageUrl || currentImageState.artisticStyle
      ? "style-transfer"
      : "standard"
  );
  const [model, setModel] = useState<SupportedImageModel>(
    currentImageState.model || "gemini-3-pro-image-preview"
  );
  const [imageSize, setImageSize] = useState<SupportedImageSize>(
    currentImageState.imageSize || "2K"
  );
  const [aspectRatio, setAspectRatio] = useState<SupportedAspectRatio>(
    currentImageState.aspectRatio || "16:9"
  );
  const [prompt, setPrompt] = useState(
    currentImageState.prompt ||
      `Studio photography of ${productName || "premium product"}, dramatic lighting, commercial aesthetic`
  );
  const [selectedPreset, setSelectedPreset] = useState("Commercial Studio");

  // Style Transfer State
  const [selectedArtisticStyle, setSelectedArtisticStyle] = useState<ArtisticStyle>(
    (currentImageState.artisticStyle as ArtisticStyle) || "minimalist"
  );
  const [referenceImageUrl, setReferenceImageUrl] = useState<string | null>(
    currentImageState.referenceImageUrl || null
  );
  const [styleTransferStrength, setStyleTransferStrength] = useState<number>(
    currentImageState.styleTransferStrength || 75
  );

  // Stock Photo Modal
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPreviewUrl, setGeneratedPreviewUrl] = useState<string | null>(
    currentImageState.imageUrl || null
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const ASPECT_RATIOS: Array<{ ratio: SupportedAspectRatio; label: string; icon: string }> = [
    { ratio: "1:1", label: "Square (1:1)", icon: "■" },
    { ratio: "16:9", label: "Landscape (16:9)", icon: "▬" },
    { ratio: "9:16", label: "Vertical Story (9:16)", icon: "▮" },
    { ratio: "4:3", label: "Standard Photo (4:3)", icon: "▰" },
    { ratio: "3:4", label: "Portrait (3:4)", icon: "▰" },
    { ratio: "3:2", label: "Classic 35mm (3:2)", icon: "▬" },
    { ratio: "2:3", label: "Tall Portrait (2:3)", icon: "▮" },
    { ratio: "21:9", label: "Cinematic Ultrawide (21:9)", icon: "═" },
  ];

  const SIZES: Array<{ size: SupportedImageSize; label: string; desc: string }> = [
    { size: "1K", label: "1K (1024px)", desc: "Fast rendering, web standard" },
    { size: "2K", label: "2K (2048px)", desc: "High density retina display" },
    { size: "4K", label: "4K (4096px)", desc: "Ultra studio-quality print & billboard" },
  ];

  // Handle local reference image file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please upload a valid image file (PNG, JPEG, WebP).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setReferenceImageUrl(dataUrl);
      setSuccessNotice("Reference image uploaded for style transfer.");
    };
    reader.onerror = () => {
      setErrorMessage("Failed to read image file.");
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setErrorMessage("Please enter an image prompt description.");
      return;
    }

    setIsGenerating(true);
    setErrorMessage(null);
    setSuccessNotice(null);

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          model,
          imageSize,
          aspectRatio,
          stylePreset: selectedPreset,
          referenceImage: activeMode === "style-transfer" ? referenceImageUrl : undefined,
          artisticStyle: activeMode === "style-transfer" ? selectedArtisticStyle : undefined,
          styleStrength: styleTransferStrength,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Image generation failed");
      }

      setGeneratedPreviewUrl(data.imageUrl);
      setSuccessNotice(
        activeMode === "style-transfer"
          ? `Style transfer generated with style '${selectedArtisticStyle}' (${imageSize}, ${aspectRatio})!`
          : `Generated visual with ${model} at ${imageSize} resolution (${aspectRatio})!`
      );

      // Update state
      onApplyImage({
        model,
        imageSize,
        aspectRatio,
        prompt,
        stylePreset: selectedPreset,
        imageUrl: data.imageUrl,
        isLoading: false,
        error: null,
        referenceImageUrl: activeMode === "style-transfer" ? referenceImageUrl : null,
        artisticStyle: activeMode === "style-transfer" ? selectedArtisticStyle : undefined,
        styleTransferStrength,
        imageSourceType: activeMode === "style-transfer" ? "style-transfer" : "ai-generated",
        attribution: {
          source: activeMode === "style-transfer" ? "Style Transfer" : "Gemini AI",
        },
      });
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Failed to generate image. Please verify connection.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSmartPromptOptimize = () => {
    const presetObj = STYLE_PRESETS.find((p) => p.label === selectedPreset) || STYLE_PRESETS[0];
    const styleObj = ARTISTIC_STYLES.find((s) => s.id === selectedArtisticStyle);

    let extra = presetObj.promptSuffix;
    if (activeMode === "style-transfer" && styleObj) {
      extra = `${styleObj.promptKeywords}, ${presetObj.promptSuffix}`;
    }

    const optimized = `Commercial advertising studio hero visual of ${productName || "modern innovation"}. ${productDescription.slice(0, 140)}. ${extra}, balanced negative space for banner typography overlays.`;
    setPrompt(optimized);
  };

  // Handler when a stock photo is selected in the modal
  const handleStockPhotoSelected = (
    photo: StockPhoto,
    applyToAll?: boolean,
    asStyleTransferRef?: boolean
  ) => {
    if (asStyleTransferRef) {
      // Set as reference image for style transfer
      setReferenceImageUrl(photo.url);
      setActiveMode("style-transfer");
      setSuccessNotice(`Set "${photo.alt}" as reference image for AI style transfer.`);
      return;
    }

    // Set directly as banner ad image
    setGeneratedPreviewUrl(photo.url);
    const newImageState: AIImageState = {
      model,
      imageSize,
      aspectRatio,
      prompt: photo.alt,
      stylePreset: "Stock Photography",
      imageUrl: photo.url,
      isLoading: false,
      error: null,
      imageSourceType: "stock-photo",
      attribution: {
        source: photo.source,
        authorName: photo.authorName,
        authorUrl: photo.authorUrl,
      },
    };

    onApplyImage(newImageState);
    if (applyToAll && onApplyToAllVariants) {
      onApplyToAllVariants(photo.url);
    }
    setSuccessNotice(`Stock photo applied from ${photo.source} (Photo by ${photo.authorName}).`);
  };

  return (
    <div id="ai-image-generator-panel" className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-slate-100 shadow-xl">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <Wand2 className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              AI Banner Visual & Style Studio
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Synthesize visuals with Gemini, execute reference style transfer, or import stock photography.
          </p>
        </div>

        {/* Action Tools & Stock Photo Button */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            id="open-stock-photos-btn"
            type="button"
            onClick={() => setIsStockModalOpen(true)}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <FolderSearch className="w-3.5 h-3.5 text-blue-400" />
            <span>Search Stock Library</span>
          </button>

          {/* Model Selector Pill */}
          <div className="flex items-center bg-slate-800/80 p-1 rounded-lg border border-slate-700/60">
            <button
              type="button"
              onClick={() => setModel("gemini-3-pro-image-preview")}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
                model === "gemini-3-pro-image-preview"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
              title="Studio-Quality Images (Supports 1K, 2K, 4K & all aspect ratios)"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>gemini-3-pro-image-preview</span>
              <span className="text-[10px] bg-amber-400/20 text-amber-300 px-1 rounded uppercase font-mono">
                Studio
              </span>
            </button>

            <button
              type="button"
              onClick={() => setModel("gemini-3.1-flash-image-preview")}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
                model === "gemini-3.1-flash-image-preview"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
              title="Fast General Purpose Image Generation"
            >
              <span>gemini-3.1-flash-image-preview</span>
              <span className="text-[10px] bg-sky-400/20 text-sky-300 px-1 rounded uppercase font-mono">
                Fast
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mode Tabs: Standard Generation vs Style Transfer */}
      <div className="flex items-center gap-2 mt-4 border-b border-slate-800 pb-3">
        <button
          type="button"
          onClick={() => setActiveMode("standard")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
            activeMode === "standard"
              ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-xs"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Text-to-Image Synthesis</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMode("style-transfer")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
            activeMode === "style-transfer"
              ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-xs"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Style Transfer & Reference Image</span>
          <span className="text-[9px] bg-amber-500/30 text-amber-300 px-1.5 py-0.5 rounded font-mono font-bold uppercase">
            New
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-5">
        {/* Left Column: Configuration Controls */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* Style Transfer Options (Visible when activeMode is style-transfer) */}
          {activeMode === "style-transfer" && (
            <div className="p-4 bg-slate-950/80 border border-amber-500/30 rounded-xl space-y-4 shadow-inner">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                  <Palette className="w-4 h-4 text-amber-400" />
                  <span>Artistic Style Preset</span>
                </label>
                <span className="text-[11px] text-slate-400">
                  Select artistic movement to transfer
                </span>
              </div>

              {/* Artistic Style Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {ARTISTIC_STYLES.map((style) => (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => setSelectedArtisticStyle(style.id)}
                    className={`p-2.5 rounded-lg text-left border transition-all flex flex-col justify-between ${
                      selectedArtisticStyle === style.id
                        ? "bg-amber-500/15 border-amber-400 text-white ring-1 ring-amber-400/40 shadow-xs"
                        : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-xs">{style.label}</p>
                        {selectedArtisticStyle === style.id && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                        {style.tagline}
                      </p>
                    </div>
                    {/* Palette Bar */}
                    <div className="flex items-center gap-1 mt-2">
                      {style.colors.map((c, i) => (
                        <span
                          key={i}
                          className="w-2.5 h-2.5 rounded-full border border-black/30"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </button>
                ))}
              </div>

              {/* Reference Image Upload & Preview Section */}
              <div className="pt-2 border-t border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-amber-400" />
                    <span>Reference Image (Style Anchor)</span>
                  </label>
                  {referenceImageUrl && (
                    <button
                      type="button"
                      onClick={() => setReferenceImageUrl(null)}
                      className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1"
                    >
                      <X className="w-3 h-3" />
                      Remove Reference
                    </button>
                  )}
                </div>

                {referenceImageUrl ? (
                  <div className="flex items-center gap-3 p-2 bg-slate-900 rounded-lg border border-slate-800">
                    <img
                      src={referenceImageUrl}
                      alt="Reference thumbnail"
                      className="w-14 h-14 object-cover rounded-md border border-slate-700"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-white truncate">
                        Reference Image Active
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Lighting, color palette and textures will be transferred to generation.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 rounded border border-slate-700"
                    >
                      Replace
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-800 hover:border-amber-500/50 rounded-lg p-3 text-center cursor-pointer transition-colors bg-slate-900/40 hover:bg-slate-900"
                  >
                    <Upload className="w-5 h-5 mx-auto mb-1 text-slate-400" />
                    <p className="text-xs font-medium text-slate-200">
                      Upload your reference image (PNG, JPG, WebP)
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Or pick from curated sample references below
                    </p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {/* Sample Reference Images Picker */}
                <div className="flex items-center gap-2 pt-1 overflow-x-auto pb-1">
                  <span className="text-[10px] text-slate-500 uppercase font-mono whitespace-nowrap">
                    Sample Refs:
                  </span>
                  {ARTISTIC_STYLES.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        setReferenceImageUrl(s.sampleReferenceUrl);
                        setSelectedArtisticStyle(s.id);
                      }}
                      className="flex items-center gap-1.5 text-[11px] bg-slate-900 hover:bg-slate-800 px-2 py-1 rounded border border-slate-800 text-slate-300 hover:text-white whitespace-nowrap"
                    >
                      <img
                        src={s.sampleReferenceUrl}
                        alt={s.label}
                        className="w-3.5 h-3.5 rounded-full object-cover"
                      />
                      <span>{s.label}</span>
                    </button>
                  ))}
                </div>

                {/* Style Transfer Strength Slider */}
                <div className="pt-2">
                  <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                    <span>Style Transfer Strength:</span>
                    <span className="font-mono text-amber-400 font-bold">
                      {styleTransferStrength}% (
                      {styleTransferStrength < 40
                        ? "Subtle"
                        : styleTransferStrength < 75
                        ? "Balanced"
                        : "Intense"}
                      )
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={styleTransferStrength}
                    onChange={(e) => setStyleTransferStrength(parseInt(e.target.value, 10))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Prompt Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <span>Visual Asset Subject Description</span>
              </label>
              <button
                type="button"
                onClick={handleSmartPromptOptimize}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium hover:underline"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Auto-Draft from Product</span>
              </button>
            </div>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Minimalist studio photograph of matte black wireless headphones on marble podium, dramatic lighting..."
              className="w-full bg-slate-950 border border-slate-700/80 rounded-lg p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-sans leading-relaxed"
            />
            {/* Quick Style Tags */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="text-[11px] text-slate-400 py-0.5">Quick Tags:</span>
              {[
                "+ Studio Lighting",
                "+ Clean Pedestal",
                "+ High Contrast",
                "+ Soft Bokeh",
                "+ Minimalist",
                "+ Floating Device",
              ].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setPrompt((prev) => `${prev.trim()}, ${tag.replace("+ ", "")}`)}
                  className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-0.5 rounded border border-slate-700 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Standard Style Preset Selector (shown when not in style-transfer mode) */}
          {activeMode === "standard" && (
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 block">
                Aesthetic Style Preset
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {STYLE_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setSelectedPreset(preset.label)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium text-left border transition-all ${
                      selectedPreset === preset.label
                        ? "bg-indigo-600/20 border-indigo-500 text-white shadow-xs"
                        : "bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/80"
                    }`}
                  >
                    <p className="font-semibold">{preset.label}</p>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">
                      {preset.promptSuffix.slice(0, 24)}...
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Image Size (1K, 2K, 4K) Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Maximize2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Image Resolution / Size</span>
              </label>
              <span className="text-[11px] text-indigo-400 font-mono font-medium">
                Affordance: 1K &bull; 2K &bull; 4K
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {SIZES.map((s) => (
                <button
                  key={s.size}
                  type="button"
                  onClick={() => setImageSize(s.size)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    imageSize === s.size
                      ? "bg-indigo-600/25 border-indigo-500 text-white shadow-sm ring-1 ring-indigo-500/50"
                      : "bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/80"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold font-mono">{s.size}</span>
                    {imageSize === s.size && (
                      <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                    )}
                  </div>
                  <p className="text-[11px] font-medium text-slate-200 mt-0.5">{s.label}</p>
                  <p className="text-[10px] text-slate-400 mt-1 leading-tight">{s.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Aspect Ratio Selector (1:1, 2:3, 3:2, 3:4, 4:3, 9:16, 16:9, 21:9) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                <span>Aspect Ratio Control</span>
              </label>
              <span className="text-[11px] text-slate-400 font-mono">
                Current: {aspectRatio}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {ASPECT_RATIOS.map((item) => (
                <button
                  key={item.ratio}
                  type="button"
                  onClick={() => setAspectRatio(item.ratio)}
                  className={`px-2.5 py-2 rounded-lg text-xs font-medium border flex items-center justify-between transition-all ${
                    aspectRatio === item.ratio
                      ? "bg-indigo-600 text-white border-indigo-500 shadow-sm"
                      : "bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/80"
                  }`}
                >
                  <span className="font-mono font-bold">{item.ratio}</span>
                  <span className="text-sm opacity-80">{item.icon}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              id="generate-visual-btn"
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating}
              className={`w-full sm:w-auto flex-1 py-3 px-6 rounded-lg font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all ${
                isGenerating
                  ? "bg-indigo-800/60 text-indigo-200 cursor-not-allowed"
                  : activeMode === "style-transfer"
                  ? "bg-amber-600 hover:bg-amber-500 text-white hover:shadow-amber-500/25 active:scale-[0.99]"
                  : "bg-indigo-600 hover:bg-indigo-500 text-white hover:shadow-indigo-500/25 active:scale-[0.99]"
              }`}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>
                    {activeMode === "style-transfer"
                      ? `Synthesizing Style Transfer (${selectedArtisticStyle})...`
                      : `Synthesizing Visual (${model} • ${imageSize})...`}
                  </span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>
                    {activeMode === "style-transfer"
                      ? `Generate Style Transfer (${selectedArtisticStyle})`
                      : `Generate Visual with ${model}`}
                  </span>
                </>
              )}
            </button>

            {generatedPreviewUrl && onApplyToAllVariants && (
              <button
                type="button"
                onClick={() => onApplyToAllVariants(generatedPreviewUrl)}
                className="w-full sm:w-auto px-4 py-3 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                title="Sync this hero visual across all A/B testing variants"
              >
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                <span>Apply to All Variants</span>
              </button>
            )}
          </div>

          {errorMessage && (
            <div className="flex items-center gap-2 p-3 bg-red-950/50 border border-red-800 text-red-300 text-xs rounded-lg">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successNotice && (
            <div className="flex items-center gap-2 p-3 bg-emerald-950/50 border border-emerald-800 text-emerald-300 text-xs rounded-lg">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successNotice}</span>
            </div>
          )}
        </div>

        {/* Right Column: Visual Preview & Asset Gallery */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
              <span>Generated Visual Preview</span>
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              {aspectRatio} &bull; {imageSize}
            </span>
          </div>

          {/* Main Visual Display */}
          <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 aspect-video flex items-center justify-center shadow-inner group">
            {generatedPreviewUrl ? (
              <img
                src={generatedPreviewUrl}
                alt="AI Generated Visual"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-6 text-center text-slate-500">
                <ImageIcon className="w-10 h-10 mb-2 opacity-40" />
                <p className="text-xs font-medium">No image generated yet</p>
                <p className="text-[10px] text-slate-600 mt-1">
                  Click &apos;Generate Asset&apos; or pick a stock photo
                </p>
              </div>
            )}

            {isGenerating && (
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center">
                <div className="w-10 h-10 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mb-3" />
                <p className="text-xs font-bold text-white">
                  Rendering {imageSize} Visual
                </p>
                <p className="text-[11px] text-indigo-300 font-mono mt-1">
                  {activeMode === "style-transfer"
                    ? `Style Transfer: ${selectedArtisticStyle}`
                    : `Model: ${model}`}
                </p>
                <p className="text-[10px] text-slate-400 mt-2 max-w-[200px]">
                  Configuring {aspectRatio} optical composition...
                </p>
              </div>
            )}

            {generatedPreviewUrl && (
              <div className="absolute bottom-2 left-2 right-2 bg-slate-900/90 backdrop-blur-md rounded-md p-2 flex items-center justify-between border border-slate-700/50">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] bg-indigo-500 text-white font-mono px-1.5 py-0.5 rounded font-bold">
                    {imageSize}
                  </span>
                  <span className="text-[10px] text-slate-300 font-mono">
                    {aspectRatio}
                  </span>
                  {currentImageState.imageSourceType && (
                    <span className="text-[10px] bg-slate-800 text-slate-300 border border-slate-700 px-1.5 py-0.5 rounded font-mono">
                      {currentImageState.imageSourceType === "stock-photo"
                        ? "Stock Photo"
                        : currentImageState.imageSourceType === "style-transfer"
                        ? `Style: ${currentImageState.artisticStyle}`
                        : "AI Generated"}
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Active in Variant
                </span>
              </div>
            )}
          </div>

          {/* Quick Curated Stock / Style Assets */}
          <div className="mt-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400">
                Curated Commercial Stock Assets:
              </span>
              <button
                type="button"
                onClick={() => setIsStockModalOpen(true)}
                className="text-xs text-blue-400 hover:text-blue-300 font-medium hover:underline"
              >
                Browse All ({campaign ? "Product Matched" : "30+ Photos"}) &rarr;
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[
                {
                  url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
                  tag: "Studio Clean",
                  source: "Unsplash",
                  author: "Kiran CK",
                },
                {
                  url: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80",
                  tag: "Warm Ambient",
                  source: "Unsplash",
                  author: "Lee Campbell",
                },
                {
                  url: "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=600&q=80",
                  tag: "Dark Cyber",
                  source: "Unsplash",
                  author: "Lorenzo Herrera",
                },
                {
                  url: "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=600&q=80",
                  tag: "Editorial",
                  source: "Unsplash",
                  author: "Burgess Milner",
                },
              ].map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setGeneratedPreviewUrl(item.url);
                    onApplyImage({
                      model,
                      imageSize,
                      aspectRatio,
                      prompt: item.tag,
                      stylePreset: "Commercial Stock",
                      imageUrl: item.url,
                      isLoading: false,
                      error: null,
                      imageSourceType: "stock-photo",
                      attribution: {
                        source: "Unsplash",
                        authorName: item.author,
                        authorUrl: "https://unsplash.com",
                      },
                    });
                  }}
                  className="relative aspect-video rounded-lg overflow-hidden border border-slate-800 hover:border-indigo-500 transition-all group"
                  title={`Apply ${item.tag} (${item.source})`}
                >
                  <img
                    src={item.url}
                    alt={item.tag}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                  />
                  <span className="absolute inset-x-0 bottom-0 bg-black/75 text-[9px] text-white py-0.5 text-center font-mono">
                    {item.tag}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stock Photo Modal */}
      {campaign && (
        <StockPhotoModal
          isOpen={isStockModalOpen}
          onClose={() => setIsStockModalOpen(false)}
          campaign={campaign}
          onSelectPhoto={handleStockPhotoSelected}
        />
      )}
    </div>
  );
};
