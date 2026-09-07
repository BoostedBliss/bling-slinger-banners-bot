export type StandardBannerSizeId =
  | "med_rect_300x250"
  | "leaderboard_728x90"
  | "wide_skyscraper_160x600"
  | "half_page_300x600"
  | "large_rect_336x280"
  | "mobile_leaderboard_320x50"
  | "billboard_970x250"
  | "square_250x250"
  | "social_square_1080x1080"
  | "social_story_1080x1920";

export interface BannerDimension {
  id: StandardBannerSizeId;
  name: string;
  width: number;
  height: number;
  category: "standard" | "horizontal" | "vertical" | "mobile" | "social";
  description: string;
  isPopular?: boolean;
  aspectRatioLabel: string;
}

export const STANDARD_BANNER_SIZES: BannerDimension[] = [
  {
    id: "med_rect_300x250",
    name: "Medium Rectangle",
    width: 300,
    height: 250,
    category: "standard",
    description: "IAB standard workhorse. Highest click-through rate across web placements.",
    isPopular: true,
    aspectRatioLabel: "6:5",
  },
  {
    id: "leaderboard_728x90",
    name: "Leaderboard",
    width: 728,
    height: 90,
    category: "horizontal",
    description: "Premium top-of-page desktop placement with maximum initial visibility.",
    isPopular: true,
    aspectRatioLabel: "8:1",
  },
  {
    id: "half_page_300x600",
    name: "Half Page / Monster",
    width: 300,
    height: 600,
    category: "vertical",
    description: "High impact mega-unit. Ample canvas space for brand storytelling.",
    isPopular: true,
    aspectRatioLabel: "1:2",
  },
  {
    id: "wide_skyscraper_160x600",
    name: "Wide Skyscraper",
    width: 160,
    height: 600,
    category: "vertical",
    description: "Persistent sidebar inventory with sustained dwell time as users scroll.",
    isPopular: false,
    aspectRatioLabel: "4:15",
  },
  {
    id: "large_rect_336x280",
    name: "Large Rectangle",
    width: 336,
    height: 280,
    category: "standard",
    description: "Enhanced editorial embed format providing extra breathing room.",
    isPopular: false,
    aspectRatioLabel: "6:5",
  },
  {
    id: "mobile_leaderboard_320x50",
    name: "Mobile Banner",
    width: 320,
    height: 50,
    category: "mobile",
    description: "Everywhere on smartphones. Crisp, single-line headline with rapid CTA tap target.",
    isPopular: true,
    aspectRatioLabel: "32:5",
  },
  {
    id: "billboard_970x250",
    name: "Billboard",
    width: 970,
    height: 250,
    category: "horizontal",
    description: "Flagship desktop unit across premium publishers and mastheads.",
    isPopular: false,
    aspectRatioLabel: "3.8:1",
  },
  {
    id: "square_250x250",
    name: "Square Unit",
    width: 250,
    height: 250,
    category: "standard",
    description: "Compact sidebar and modular content grid display.",
    isPopular: false,
    aspectRatioLabel: "1:1",
  },
  {
    id: "social_square_1080x1080",
    name: "Social Feed (1:1)",
    width: 1080,
    height: 1080,
    category: "social",
    description: "Native high-density square format for Instagram, LinkedIn, & Facebook feeds.",
    isPopular: true,
    aspectRatioLabel: "1:1",
  },
  {
    id: "social_story_1080x1920",
    name: "Story / Vertical (9:16)",
    width: 1080,
    height: 1920,
    category: "social",
    description: "Immersive full-screen vertical canvas for mobile stories and video feeds.",
    isPopular: true,
    aspectRatioLabel: "9:16",
  },
];

export type SupportedImageModel =
  | "gemini-3-pro-image-preview"
  | "gemini-3.1-flash-image-preview";

export type SupportedImageSize = "1K" | "2K" | "4K";

export type SupportedAspectRatio =
  | "1:1"
  | "2:3"
  | "3:2"
  | "3:4"
  | "4:3"
  | "9:16"
  | "16:9"
  | "21:9";

export type ArtisticStyle =
  | "minimalist"
  | "vibrant"
  | "vintage"
  | "futuristic"
  | "luxury-editorial"
  | "pop-art"
  | "cyberpunk"
  | "warm-organic"
  | "clay-3d";

export interface StockPhoto {
  id: string;
  url: string;
  thumbUrl: string;
  alt: string;
  authorName: string;
  authorUrl: string;
  source: "Unsplash" | "Pexels";
  category: string;
  tags: string[];
  width?: number;
  height?: number;
}

export interface DynamicVariable {
  key: string; // e.g. "discount_percentage"
  label: string; // e.g. "Discount %"
  defaultValue: string; // e.g. "35"
  sampleValues?: string[]; // e.g. ["20", "35", "50"]
}

export interface AIImageState {
  model: SupportedImageModel;
  imageSize: SupportedImageSize;
  aspectRatio: SupportedAspectRatio;
  prompt: string;
  stylePreset: string;
  imageUrl: string;
  isLoading: boolean;
  error?: string | null;
  // Style Transfer additions
  referenceImageUrl?: string | null;
  artisticStyle?: ArtisticStyle | string;
  styleTransferStrength?: number; // 10 to 100
  imageSourceType?: "ai-generated" | "style-transfer" | "stock-photo";
  attribution?: {
    source: "Unsplash" | "Pexels" | "Gemini AI" | "Style Transfer";
    authorName?: string;
    authorUrl?: string;
  };
}

export type TemplateTheme =
  | "modern-glass"
  | "bold-vibrant"
  | "luxury-minimal"
  | "cyber-neon"
  | "warm-organic";

export type QRCodeThemeStyle =
  | "glass-glow"
  | "gold-luxury"
  | "cyber-matrix"
  | "clean-minimal";

export interface FancyQRCodeConfig {
  enabled: boolean;
  style: QRCodeThemeStyle;
  customDeepLink?: string;
  trackingCampaign?: string;
  labelText?: string;
  showScanIcon?: boolean;
  cornerMarkerStyle?: "bracket" | "rounded" | "dots";
}

export interface TemplateCustomization {
  theme: TemplateTheme;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  textColor: string;
  fontFamily: "Outfit" | "Plus Jakarta Sans" | "Space Grotesk" | "Cinzel";
  overlayOpacity: number; // 0.1 to 0.9
  layoutAlign: "left" | "center" | "right";
  buttonStyle: "rounded-md" | "rounded-full" | "rounded-none";
  showBadge: boolean;
  showBorder: boolean;
  badgeStyle: "pill" | "ribbon" | "outline";
  showSecondaryCta?: boolean;
  qrCode?: FancyQRCodeConfig;
}

export interface AdCopy {
  brandName: string;
  headline: string;
  subheadline: string;
  ctaText: string;
  secondaryCtaText?: string;
  alternativeCtas?: string[]; // e.g. ["Shop Now", "Learn More", "Get Offer", "Claim 35% Off"]
  badgeText: string;
  targetUrl: string;
  dynamicVariables?: Record<string, string>; // e.g. { discount_percentage: "35", promo_code: "SAVE35" }
}

export interface CtaMetric {
  ctaText: string;
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  cvr: number;
}

export interface VariantSchedule {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  status: "scheduled" | "active" | "ended" | "paused";
  timeZone?: string;
  dayPartingEnabled?: boolean;
  activeDays?: string[]; // e.g. ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  budgetAllocationPct?: number;
  flightObjective?: string;
}

export interface AdVariant {
  id: string;
  name: string;
  badgeTag: "Variant A" | "Variant B" | "Variant C";
  hypothesis: string;
  copy: AdCopy;
  template: TemplateCustomization;
  image: AIImageState;
  trafficWeight: number; // Percentage, e.g. 50%
  schedule?: VariantSchedule;
  ctaMetrics?: Record<string, CtaMetric>;
  variableMetrics?: Record<string, { impressions: number; clicks: number; ctr: number }>;
}

export interface CampaignData {
  id: string;
  name: string;
  productDescription: string;
  targetUrl: string;
  tone: string;
  audience: string;
  createdAt: string;
  activeVariantId: string;
  variants: AdVariant[];
}

export interface VariantMetric {
  variantId: string;
  variantName: string;
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number; // Percentage
  cvr: number; // Percentage
  spend: number;
  revenue: number;
  roas: number;
  costPerClick: number;
  sizePerformance: Record<
    string,
    {
      impressions: number;
      clicks: number;
      conversions: number;
      ctr: number;
    }
  >;
  history: Array<{
    day: string;
    impressions: number;
    clicks: number;
    conversions: number;
  }>;
}

export interface ABTestReport {
  campaignId: string;
  totalImpressions: number;
  totalClicks: number;
  totalConversions: number;
  totalSpend: number;
  totalRevenue: number;
  overallRoas: number;
  confidenceRate: number; // e.g., 96.8%
  pValue: number;
  isSignificant: boolean;
  winnerVariantId: string | null;
  liftPct: number;
  aiTakeaway: string;
  aiInsights: string[];
  recommendations: Array<{
    title: string;
    description: string;
    expectedLift: string;
  }>;
  variantMetrics: VariantMetric[];
}

export interface CompetitorAnalysisResult {
  competitorUrl: string;
  competitorDomain: string;
  detectedStructure: {
    layoutType: string;
    visualDensity: "Minimal" | "Balanced" | "Cluttered";
    colorPalette: string[];
    headlineStyle: string;
    ctaStrategy: string;
    badgeUsage: string;
    estimatedReadability: string;
  };
  identifiedWeaknesses: string[];
  differentiationTactic: {
    themeRecommendation: TemplateTheme;
    recommendedPrimaryColor: string;
    recommendedAccentColor: string;
    recommendedHeadline: string;
    recommendedSubheadline: string;
    recommendedCta: string;
    badgeSuggestion: string;
    designContrastAdvice: string;
    actionItems: string[];
  };
}

export interface BrandKitPreset {
  id: string;
  name: string;
  sourceUrl: string;
  domain: string;
  brandVibe: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  textColor: string;
  fontFamily: "Outfit" | "Plus Jakarta Sans" | "Space Grotesk" | "Cinzel";
  bodyFont?: string;
  theme: TemplateTheme;
  buttonStyle: "rounded-md" | "rounded-full" | "rounded-none";
  colorPalette?: string[];
  createdAt: string;
}
