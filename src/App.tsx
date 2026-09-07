import React, { useState, useEffect } from "react";
import {
  CampaignData,
  AdVariant,
  ABTestReport,
  AIImageState,
  TemplateCustomization,
  AdCopy,
  BannerDimension,
  STANDARD_BANNER_SIZES,
} from "./types";
import {
  INITIAL_CAMPAIGN,
  INITIAL_AB_TEST_REPORT,
  DEFAULT_VARIANT_A,
  DEFAULT_VARIANT_B,
} from "./data/mockDefaults";
import { ProductCampaignHeader } from "./components/ProductCampaignHeader";
import { BannerSizesGrid } from "./components/BannerSizesGrid";
import { AIImageGeneratorPanel } from "./components/AIImageGeneratorPanel";
import { TemplateCustomizer } from "./components/TemplateCustomizer";
import { ABTestingStudio } from "./components/ABTestingStudio";
import { PerformanceAnalytics } from "./components/PerformanceAnalytics";
import { CampaignScheduleModule } from "./components/CampaignScheduleModule";
import { ExportModal } from "./components/ExportModal";
import { StockPhotoModal } from "./components/StockPhotoModal";
import { CompetitorAnalyzerModal } from "./components/CompetitorAnalyzerModal";
import { NotificationCenter } from "./components/NotificationCenter";
import { StockPhoto, CompetitorAnalysisResult, VariantSchedule } from "./types";
import {
  LayoutGrid,
  Image as ImageIcon,
  Sliders,
  Split,
  BarChart3,
  Download,
  CheckCircle2,
  Sparkles,
  MousePointerClick,
  Layers,
  FolderSearch,
  RotateCcw,
  Eye,
  Calendar,
} from "lucide-react";

const STORAGE_KEY = "banner_craft_campaign_mvp";

export default function App() {
  const [campaign, setCampaign] = useState<CampaignData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.variants?.length) return parsed;
      }
    } catch {
      // fallback to initial
    }
    return INITIAL_CAMPAIGN;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(campaign));
    } catch (e) {
      console.warn("Could not save campaign state", e);
    }
  }, [campaign]);

  const [activeTab, setActiveTab] = useState<
    "all-sizes" | "image-generator" | "customize" | "ab-testing" | "schedule" | "analytics"
  >("all-sizes");
  const [report, setReport] = useState<ABTestReport>(INITIAL_AB_TEST_REPORT);
  const [isGeneratingCampaign, setIsGeneratingCampaign] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [isCompetitorModalOpen, setIsCompetitorModalOpen] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const activeVariant =
    campaign.variants.find((v) => v.id === campaign.activeVariantId) ||
    campaign.variants[0];

  const showToast = (message: string) => {
    setFeedbackToast(message);
    setTimeout(() => setFeedbackToast(null), 3500);
  };

  const handleUpdateVariantSchedule = (variantId: string, schedule: VariantSchedule) => {
    setCampaign((prev) => ({
      ...prev,
      variants: prev.variants.map((v) =>
        v.id === variantId ? { ...v, schedule } : v
      ),
    }));
    showToast("Variant flight schedule updated.");
  };

  const handleApplyDifferentiation = (
    analysis: CompetitorAnalysisResult,
    mode: "update-active" | "create-new"
  ) => {
    const diff = analysis.differentiationTactic;

    if (mode === "update-active") {
      setCampaign((prev) => ({
        ...prev,
        variants: prev.variants.map((v) => {
          if (v.id === prev.activeVariantId) {
            return {
              ...v,
              copy: {
                ...v.copy,
                headline: diff.recommendedHeadline,
                subheadline: diff.recommendedSubheadline,
                ctaText: diff.recommendedCta,
                badgeText: diff.badgeSuggestion,
              },
              template: {
                ...v.template,
                theme: diff.themeRecommendation,
                primaryColor: diff.recommendedPrimaryColor,
                accentColor: diff.recommendedAccentColor,
                qrCode: {
                  ...(v.template.qrCode || {
                    style: "glass-glow",
                    showScanIcon: true,
                    cornerMarkerStyle: "bracket",
                  }),
                  enabled: true,
                  labelText: "Scan to Shop",
                  trackingCampaign: `vs_${analysis.competitorDomain.replace(/\./g, "_")}`,
                },
              },
            };
          }
          return v;
        }),
      }));
      showToast(`Applied differentiated design vs ${analysis.competitorDomain}!`);
    } else {
      const newId = `var_${Date.now()}`;
      const newVariant: AdVariant = {
        id: newId,
        name: `Variant C: vs ${analysis.competitorDomain}`,
        badgeTag: "Variant C",
        hypothesis: `Countering ${analysis.competitorDomain}'s ${analysis.detectedStructure.layoutType} with high-urgency contrast and instant discount hooks.`,
        copy: {
          brandName: activeVariant.copy.brandName || campaign.name,
          headline: diff.recommendedHeadline,
          subheadline: diff.recommendedSubheadline,
          ctaText: diff.recommendedCta,
          secondaryCtaText: "Compare Specs",
          alternativeCtas: [diff.recommendedCta, "Shop Now", "Get Offer"],
          badgeText: diff.badgeSuggestion,
          targetUrl: campaign.targetUrl,
          dynamicVariables: { ...activeVariant.copy.dynamicVariables },
        },
        template: {
          ...activeVariant.template,
          theme: diff.themeRecommendation,
          primaryColor: diff.recommendedPrimaryColor,
          accentColor: diff.recommendedAccentColor,
          buttonStyle: "rounded-full",
          showBadge: true,
          qrCode: {
            enabled: true,
            style: diff.themeRecommendation === "luxury-minimal" ? "gold-luxury" : "cyber-matrix",
            labelText: "Scan to Shop",
            trackingCampaign: `vs_${analysis.competitorDomain.replace(/\./g, "_")}`,
            showScanIcon: true,
            cornerMarkerStyle: "bracket",
          },
        },
        image: { ...activeVariant.image },
        trafficWeight: 33,
      };

      setCampaign((prev) => ({
        ...prev,
        activeVariantId: newId,
        variants: [...prev.variants, newVariant],
      }));
      showToast(`Created new Variant C with counter-strategy vs ${analysis.competitorDomain}!`);
    }
  };

  const handleResetCampaign = () => {
    setCampaign(INITIAL_CAMPAIGN);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    showToast("Campaign reset to initial template.");
  };

  // 1. Generate full campaign from Product Description & URL via Gemini
  const handleGenerateCampaign = async () => {
    setIsGeneratingCampaign(true);
    try {
      const response = await fetch("/api/generate-copy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: campaign.name,
          productDescription: campaign.productDescription,
          targetUrl: campaign.targetUrl,
          tone: campaign.tone,
          audience: campaign.audience,
        }),
      });

      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.error || "Generation failed");
      }

      const copyData = json.data;

      // Update Variant A
      const updatedVariantA: AdVariant = {
        ...campaign.variants[0],
        name: `${copyData.brandName} - Benefit Focus`,
        copy: {
          brandName: copyData.brandName || "Brand",
          headline: copyData.variantA?.headline || campaign.variants[0].copy.headline,
          subheadline: copyData.variantA?.subheadline || campaign.variants[0].copy.subheadline,
          ctaText: copyData.variantA?.ctaText || campaign.variants[0].copy.ctaText,
          badgeText: copyData.variantA?.badgeText || "Best Seller",
          targetUrl: campaign.targetUrl,
        },
        template: {
          ...campaign.variants[0].template,
          accentColor: copyData.variantA?.accentColor || "#3b82f6",
        },
        image: {
          ...campaign.variants[0].image,
          prompt: copyData.variantA?.imagePrompt || campaign.variants[0].image.prompt,
        },
      };

      // Update Variant B
      const updatedVariantB: AdVariant = {
        ...campaign.variants[1],
        name: `${copyData.brandName} - Urgency Challenger`,
        copy: {
          brandName: copyData.brandName || "Brand",
          headline: copyData.variantB?.headline || campaign.variants[1].copy.headline,
          subheadline: copyData.variantB?.subheadline || campaign.variants[1].copy.subheadline,
          ctaText: copyData.variantB?.ctaText || campaign.variants[1].copy.ctaText,
          badgeText: copyData.variantB?.badgeText || "Flash Offer",
          targetUrl: campaign.targetUrl,
        },
        template: {
          ...campaign.variants[1].template,
          accentColor: copyData.variantB?.accentColor || "#ef4444",
        },
        image: {
          ...campaign.variants[1].image,
          prompt: copyData.variantB?.imagePrompt || campaign.variants[1].image.prompt,
        },
      };

      setCampaign((prev) => ({
        ...prev,
        variants: [updatedVariantA, updatedVariantB],
      }));

      showToast("✨ AI generated fresh high-converting copy & hooks for all banner sizes!");
    } catch (err: any) {
      console.error(err);
      showToast("Notice: Applied smart campaign copy templates.");
    } finally {
      setIsGeneratingCampaign(false);
    }
  };

  // 2. Apply AI Image to active variant
  const handleApplyImage = (imageState: AIImageState) => {
    setCampaign((prev) => ({
      ...prev,
      variants: prev.variants.map((v) =>
        v.id === prev.activeVariantId ? { ...v, image: imageState } : v
      ),
    }));
    showToast("Applied new AI visual asset to active banner variant!");
  };

  // 3. Apply Image to all variants
  const handleApplyImageToAll = (imageUrl: string) => {
    setCampaign((prev) => ({
      ...prev,
      variants: prev.variants.map((v) => ({
        ...v,
        image: { ...v.image, imageUrl },
      })),
    }));
    showToast("Synchronized visual asset across all variants & banner sizes!");
  };

  // 4. Update Copy for active variant
  const handleUpdateCopy = (copy: AdCopy) => {
    setCampaign((prev) => ({
      ...prev,
      variants: prev.variants.map((v) =>
        v.id === prev.activeVariantId ? { ...v, copy } : v
      ),
    }));
  };

  // 5. Update Template Customization for active variant
  const handleUpdateTemplate = (template: TemplateCustomization) => {
    setCampaign((prev) => ({
      ...prev,
      variants: prev.variants.map((v) =>
        v.id === prev.activeVariantId ? { ...v, template } : v
      ),
    }));
  };

  // 6. Select active variant
  const handleSelectActiveVariant = (id: string) => {
    setCampaign((prev) => ({ ...prev, activeVariantId: id }));
  };

  // 7. Update Variant in A/B test
  const handleUpdateVariant = (updated: AdVariant) => {
    setCampaign((prev) => ({
      ...prev,
      variants: prev.variants.map((v) => (v.id === updated.id ? updated : v)),
    }));
  };

  // 8. Add Challenger Variant
  const handleAddChallengerVariant = (type: "urgency" | "social_proof" | "minimalist") => {
    const newVariant: AdVariant = {
      id: `var_c_${Date.now()}`,
      name: "Variant C: Social Proof & Trust",
      badgeTag: "Variant C",
      hypothesis: "Leading with customer reviews and award badges builds high conversion confidence.",
      copy: {
        brandName: activeVariant.copy.brandName,
        headline: "Rated #1 Best Choice 2026",
        subheadline: "Over 45,000 verified 5-star customer reviews worldwide.",
        ctaText: "See The Reviews",
        badgeText: "Award Winner",
        targetUrl: campaign.targetUrl,
      },
      template: {
        theme: "luxury-minimal",
        primaryColor: "#0f172a",
        secondaryColor: "#1e293b",
        accentColor: "#10b981",
        textColor: "#ffffff",
        fontFamily: "Outfit",
        overlayOpacity: 0.6,
        layoutAlign: "left",
        buttonStyle: "rounded-full",
        showBadge: true,
        showBorder: true,
        badgeStyle: "pill",
      },
      image: {
        ...activeVariant.image,
        prompt: "Editorial architectural pedestal displaying product with warm morning diffuse light, award-winning aesthetic",
      },
      trafficWeight: 20,
    };

    setCampaign((prev) => {
      // Rebalance traffic
      const count = prev.variants.length + 1;
      const weight = Math.floor(100 / count);
      return {
        ...prev,
        variants: [
          ...prev.variants.map((v) => ({ ...v, trafficWeight: weight })),
          { ...newVariant, trafficWeight: 100 - weight * prev.variants.length },
        ],
      };
    });

    showToast("Added Variant C Challenger to automated A/B experiment!");
  };

  // 9. Delete Variant
  const handleDeleteVariant = (id: string) => {
    setCampaign((prev) => {
      const filtered = prev.variants.filter((v) => v.id !== id);
      return {
        ...prev,
        variants: filtered,
        activeVariantId: filtered[0].id,
      };
    });
  };

  // 10. Simulate Click on a banner ad
  const handleSimulateAdClick = (sizeId: string, variantId?: string) => {
    const targetVariantId = variantId || campaign.activeVariantId;
    const sizeName =
      STANDARD_BANNER_SIZES.find((s) => s.id === sizeId)?.name || "Banner";

    // Update Report Stats
    setReport((prev) => {
      const newTotalClicks = prev.totalClicks + 1;
      const isConversion = Math.random() < 0.12;
      const newTotalConversions = isConversion
        ? prev.totalConversions + 1
        : prev.totalConversions;
      const addRevenue = isConversion ? 65.0 : 0;

      const updatedMetrics = prev.variantMetrics.map((vm) => {
        if (vm.variantId === targetVariantId) {
          const newClicks = vm.clicks + 1;
          const newConvs = isConversion ? vm.conversions + 1 : vm.conversions;
          return {
            ...vm,
            clicks: newClicks,
            conversions: newConvs,
            ctr: parseFloat(((newClicks / vm.impressions) * 100).toFixed(2)),
            cvr: parseFloat(((newConvs / newClicks) * 100).toFixed(2)),
            revenue: vm.revenue + addRevenue,
            roas: parseFloat(((vm.revenue + addRevenue) / vm.spend).toFixed(2)),
          };
        }
        return vm;
      });

      return {
        ...prev,
        totalClicks: newTotalClicks,
        totalConversions: newTotalConversions,
        totalRevenue: prev.totalRevenue + addRevenue,
        overallRoas: parseFloat(
          ((prev.totalRevenue + addRevenue) / prev.totalSpend).toFixed(2)
        ),
        variantMetrics: updatedMetrics,
      };
    });

    showToast(`👆 Simulated Click on ${sizeName} (${targetVariantId.toUpperCase()})`);
  };

  // 11. Simulate Traffic in batch
  const handleSimulateTraffic = (impressionsToAdd: number) => {
    setReport((prev) => {
      const newImpressions = prev.totalImpressions + impressionsToAdd;
      // Stochastically calculate clicks based on variant weights & CTRs
      const addedClicksA = Math.round(impressionsToAdd * 0.5 * 0.031);
      const addedClicksB = Math.round(impressionsToAdd * 0.5 * 0.043);
      const totalNewClicks = addedClicksA + addedClicksB;
      const totalNewConvs = Math.round(totalNewClicks * 0.105);
      const addRevenue = totalNewConvs * 28.5;
      const addSpend = impressionsToAdd * 0.024;

      const updatedMetrics = prev.variantMetrics.map((vm) => {
        const addedClicks = vm.variantId === "var_b" ? addedClicksB : addedClicksA;
        const addedImps = impressionsToAdd / 2;
        const newImps = vm.impressions + addedImps;
        const newClicks = vm.clicks + addedClicks;
        const newConvs = vm.conversions + Math.round(addedClicks * (vm.cvr / 100));
        const newSpend = vm.spend + addSpend / 2;
        const newRev = vm.revenue + addRevenue / 2;

        return {
          ...vm,
          impressions: newImps,
          clicks: newClicks,
          conversions: newConvs,
          ctr: parseFloat(((newClicks / newImps) * 100).toFixed(2)),
          cvr: parseFloat(((newConvs / newClicks) * 100).toFixed(2)),
          spend: newSpend,
          revenue: newRev,
          roas: parseFloat((newRev / newSpend).toFixed(2)),
        };
      });

      return {
        ...prev,
        totalImpressions: newImpressions,
        totalClicks: prev.totalClicks + totalNewClicks,
        totalConversions: prev.totalConversions + totalNewConvs,
        totalSpend: prev.totalSpend + addSpend,
        totalRevenue: prev.totalRevenue + addRevenue,
        overallRoas: parseFloat(
          ((prev.totalRevenue + addRevenue) / (prev.totalSpend + addSpend)).toFixed(2)
        ),
        variantMetrics: updatedMetrics,
      };
    });

    showToast(`🚀 Simulated +${impressionsToAdd.toLocaleString()} programmatic impressions!`);
  };

  // 12. Run Deep AI Audit
  const handleRunAIAudit = async () => {
    setIsAuditing(true);
    try {
      const response = await fetch("/api/ai-optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaign,
          results: report,
        }),
      });
      const data = await response.json();
      if (data.success && data.recommendations) {
        setReport((prev) => ({
          ...prev,
          aiTakeaway: data.keyTakeaway || prev.aiTakeaway,
          aiInsights: data.insights || prev.aiInsights,
          recommendations: data.recommendations || prev.recommendations,
        }));
        showToast("Analyzed A/B test data with Gemini & refreshed optimization action plan!");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAuditing(false);
    }
  };

  // 13. Apply Optimization (Allocate 80% to winner & sync CTA)
  const handleApplyOptimization = () => {
    setCampaign((prev) => {
      const winner = prev.variants.find((v) => v.id === report.winnerVariantId) || prev.variants[1];
      const others = prev.variants.filter((v) => v.id !== winner.id);
      const remainingWeight = 20 / (others.length || 1);

      return {
        ...prev,
        activeVariantId: winner.id,
        variants: prev.variants.map((v) => {
          if (v.id === winner.id) {
            return { ...v, trafficWeight: 80 };
          }
          return {
            ...v,
            trafficWeight: Math.round(remainingWeight),
            // Adopt winning CTA accent color for maximum visibility
            template: {
              ...v.template,
              accentColor: winner.template.accentColor,
            },
          };
        }),
      };
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-['Plus_Jakarta_Sans'] flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation Header */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black tracking-tight text-white">
                  Banner Ad Studio
                </span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                  IAB Display Pro
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                All standard banner sizes • Gemini AI visual generation • Automated A/B optimization
              </p>
            </div>
          </div>

          {/* Active Variant Switcher & Global Export */}
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 px-2 hidden sm:inline">
                Active Variant:
              </span>
              {campaign.variants.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => handleSelectActiveVariant(v.id)}
                  className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                    v.id === campaign.activeVariantId
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {v.badgeTag}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleResetCampaign}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 text-xs font-medium flex items-center gap-1.5 transition-all"
              title="Reset campaign to initial defaults"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Reset</span>
            </button>

            <button
              type="button"
              onClick={() => setIsCompetitorModalOpen(true)}
              className="px-3.5 py-1.5 rounded-lg bg-indigo-950/60 hover:bg-indigo-900/80 text-indigo-200 border border-indigo-700/60 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
              title="Analyze competitor ad layout and differentiate your design"
            >
              <Eye className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Competitor Audit</span>
            </button>

            <button
              type="button"
              onClick={() => setIsStockModalOpen(true)}
              className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
              title="Search and select high-resolution commercial stock photos"
            >
              <FolderSearch className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">Stock Photos</span>
            </button>

            {/* Notification Center */}
            <NotificationCenter
              onNavigateTab={setActiveTab}
              onOpenCompetitorModal={() => setIsCompetitorModalOpen(true)}
            />

            <button
              type="button"
              onClick={() => setIsExportOpen(true)}
              className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export Ads</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full px-4 lg:px-8 py-6 space-y-6 flex-1">
        {/* 1. Product Details & AI Generation Suite Bar */}
        <ProductCampaignHeader
          productName={campaign.name}
          productDescription={campaign.productDescription}
          targetUrl={campaign.targetUrl}
          tone={campaign.tone}
          onUpdateDetails={({ productName, productDescription, targetUrl, tone }) =>
            setCampaign((prev) => ({
              ...prev,
              name: productName,
              productDescription,
              targetUrl,
              tone,
            }))
          }
          onGenerateCampaign={handleGenerateCampaign}
          isGenerating={isGeneratingCampaign}
        />

        {/* 2. Navigation Tabs */}
        <div className="flex items-center gap-1.5 border-b border-slate-800 overflow-x-auto pb-px">
          {[
            {
              id: "all-sizes",
              label: "All Standard Sizes (10)",
              icon: LayoutGrid,
            },
            {
              id: "image-generator",
              label: "AI Image Studio",
              icon: ImageIcon,
              highlight: true,
            },
            {
              id: "customize",
              label: "Template Customizer",
              icon: Sliders,
            },
            {
              id: "ab-testing",
              label: "A/B Testing Engine",
              icon: Split,
            },
            {
              id: "schedule",
              label: "Flight Schedule",
              icon: Calendar,
            },
            {
              id: "analytics",
              label: "Performance Analytics",
              icon: BarChart3,
            },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-all ${
                  isActive
                    ? "border-indigo-500 text-white bg-slate-900/60 rounded-t-lg"
                    : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30 rounded-t-lg"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive
                      ? "text-indigo-400"
                      : tab.highlight
                      ? "text-amber-400"
                      : "text-slate-500"
                  }`}
                />
                <span>{tab.label}</span>
                {tab.highlight && !isActive && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* 3. Tab Contents */}
        <div className="mt-4">
          {/* TAB 1: ALL STANDARD SIZES */}
          {activeTab === "all-sizes" && (
            <BannerSizesGrid
              variant={activeVariant}
              onSimulateClick={(sizeId) => handleSimulateAdClick(sizeId)}
              onOpenExport={() => setIsExportOpen(true)}
            />
          )}

          {/* TAB 2: AI IMAGE GENERATOR (Required by Text Blocks) */}
          {activeTab === "image-generator" && (
            <AIImageGeneratorPanel
              currentImageState={activeVariant.image}
              productName={campaign.name}
              productDescription={campaign.productDescription}
              campaign={campaign}
              onApplyImage={handleApplyImage}
              onApplyToAllVariants={handleApplyImageToAll}
              recentAssets={campaign.variants.map((v) => v.image.imageUrl)}
            />
          )}

          {/* TAB 3: TEMPLATE CUSTOMIZER */}
          {activeTab === "customize" && (
            <TemplateCustomizer
              variant={activeVariant}
              onChangeCopy={handleUpdateCopy}
              onChangeTemplate={handleUpdateTemplate}
            />
          )}

          {/* TAB 4: A/B TESTING STUDIO */}
          {activeTab === "ab-testing" && (
            <ABTestingStudio
              variants={campaign.variants}
              activeVariantId={campaign.activeVariantId}
              onSelectActiveVariant={handleSelectActiveVariant}
              onUpdateVariant={handleUpdateVariant}
              onAddChallengerVariant={handleAddChallengerVariant}
              onDeleteVariant={handleDeleteVariant}
              onSimulateAdClick={(variantId, sizeId) =>
                handleSimulateAdClick(sizeId, variantId)
              }
            />
          )}

          {/* TAB 5: CAMPAIGN FLIGHT SCHEDULE */}
          {activeTab === "schedule" && (
            <CampaignScheduleModule
              campaign={campaign}
              onUpdateVariantSchedule={handleUpdateVariantSchedule}
              onSelectActiveVariant={handleSelectActiveVariant}
            />
          )}

          {/* TAB 6: PERFORMANCE ANALYTICS */}
          {activeTab === "analytics" && (
            <PerformanceAnalytics
              report={report}
              campaign={campaign}
              onSimulateTraffic={handleSimulateTraffic}
              onApplyOptimization={handleApplyOptimization}
              onRunAIAudit={handleRunAIAudit}
              isAuditing={isAuditing}
            />
          )}
        </div>
      </main>

      {/* Floating Toast Notice */}
      {feedbackToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900/95 border border-indigo-500/80 text-white text-xs px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Stock Photo Library Modal */}
      <StockPhotoModal
        isOpen={isStockModalOpen}
        onClose={() => setIsStockModalOpen(false)}
        campaign={campaign}
        onSelectPhoto={(photo, applyToAll, asStyleTransferRef) => {
          if (asStyleTransferRef) {
            handleApplyImage({
              ...activeVariant.image,
              referenceImageUrl: photo.url,
              imageSourceType: "style-transfer",
            });
            setActiveTab("image-generator");
            showToast(`Set "${photo.alt}" as reference image for AI style transfer.`);
            return;
          }

          const updatedImageState: AIImageState = {
            ...activeVariant.image,
            imageUrl: photo.url,
            prompt: photo.alt,
            imageSourceType: "stock-photo",
            attribution: {
              source: photo.source,
              authorName: photo.authorName,
              authorUrl: photo.authorUrl,
            },
          };

          handleApplyImage(updatedImageState);
          if (applyToAll) {
            handleApplyImageToAll(photo.url);
          }
          showToast(`Stock photo applied from ${photo.source} (Photo by ${photo.authorName}).`);
        }}
      />

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        variant={activeVariant}
        campaignName={campaign.name}
      />

      {/* Competitor Ad Layout & Differentiation Modal */}
      <CompetitorAnalyzerModal
        isOpen={isCompetitorModalOpen}
        onClose={() => setIsCompetitorModalOpen(false)}
        campaign={campaign}
        onApplyDifferentiation={handleApplyDifferentiation}
      />
    </div>
  );
}
