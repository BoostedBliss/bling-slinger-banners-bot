import { DynamicVariable, ArtisticStyle } from "../types";

export const PRESET_DYNAMIC_VARIABLES: DynamicVariable[] = [
  {
    key: "discount_percentage",
    label: "Discount %",
    defaultValue: "35",
    sampleValues: ["20", "35", "50"],
  },
  {
    key: "promo_code",
    label: "Promo Code",
    defaultValue: "FLASH35",
    sampleValues: ["WELCOME10", "FLASH35", "VIP50"],
  },
  {
    key: "inventory_left",
    label: "Scarcity Inventory",
    defaultValue: "14",
    sampleValues: ["5", "14", "25"],
  },
  {
    key: "price",
    label: "Price Display",
    defaultValue: "$199",
    sampleValues: ["$149", "$199", "$249"],
  },
  {
    key: "city",
    label: "Geo Target City",
    defaultValue: "New York",
    sampleValues: ["New York", "San Francisco", "London", "Tokyo"],
  },
  {
    key: "rating",
    label: "Customer Rating",
    defaultValue: "4.9★",
    sampleValues: ["4.8★", "4.9★", "5.0★"],
  },
];

export const DEFAULT_ALTERNATIVE_CTAS: string[] = [
  "Shop Now",
  "Claim 35% Off",
  "Learn More",
  "Get Offer",
  "Order Today",
  "Start Free Trial",
];

export interface ArtisticStyleConfig {
  id: ArtisticStyle;
  label: string;
  tagline: string;
  description: string;
  colors: string[];
  promptKeywords: string;
  sampleReferenceUrl: string;
}

export const ARTISTIC_STYLES: ArtisticStyleConfig[] = [
  {
    id: "minimalist",
    label: "Minimalist",
    tagline: "Pure lines & generous negative space",
    description: "Architectural clean studio composition with serene diffuse lighting, muted neutrals, and zero clutter.",
    colors: ["#f8fafc", "#cbd5e1", "#475569", "#0f172a"],
    promptKeywords: "ultra minimalist aesthetics, bauhaus simplicity, vast negative space, soft ambient natural shadows, matte studio textures",
    sampleReferenceUrl: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "vibrant",
    label: "Vibrant Pop",
    tagline: "High-saturation energy & punchy hues",
    description: "Bold dynamic colors, contrasting complementary tones, studio pop-art energy for high-CTR sales.",
    colors: ["#ef4444", "#f59e0b", "#10b981", "#3b82f6"],
    promptKeywords: "vibrant high-saturation commercial aesthetic, bold color-blocked background, striking dynamic studio lighting, crisp punchy contrast",
    sampleReferenceUrl: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "vintage",
    label: "Vintage Film",
    tagline: "Warm retro grain & 70s editorial feel",
    description: "Analog 35mm film photography warmth, subtle authentic grain, warm golden hour tones, timeless prestige.",
    colors: ["#78350f", "#b45309", "#d97706", "#fef3c7"],
    promptKeywords: "vintage 35mm film aesthetic, Kodak Portra tones, warm nostalgic color grading, subtle film grain, soft warm flares",
    sampleReferenceUrl: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "futuristic",
    label: "Futuristic / Sci-Fi",
    tagline: "Sleek obsidian & volumetric neon illumination",
    description: "Next-generation technological aesthetic with sleek dark reflections, holographic accents, and clean titanium.",
    colors: ["#020617", "#06b6d4", "#3b82f6", "#8b5cf6"],
    promptKeywords: "futuristic sci-fi tech aesthetic, sleek obsidian pedestals, volumetric blue and cyan rim lighting, clean aerospace materials, 8k",
    sampleReferenceUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "luxury-editorial",
    label: "Luxury Editorial",
    tagline: "Vogue-grade architectural prestige",
    description: "Polished Italian marble, subtle champagne gold accents, dramatic high-fashion chiaroscuro shadows.",
    colors: ["#09090b", "#27272a", "#d4af37", "#f5f5f4"],
    promptKeywords: "luxury editorial high-fashion photography, architectural marble surface, refined gold accents, razor-sharp studio optics",
    sampleReferenceUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "cyberpunk",
    label: "Cyberpunk",
    tagline: "Neon-soaked electric nocturnal energy",
    description: "Deep noir shadows illuminated by hot magenta, cyan, and electric violet edge reflections.",
    colors: ["#030712", "#ec4899", "#8b5cf6", "#06b6d4"],
    promptKeywords: "cyberpunk nocturnal city lighting, high-contrast magenta and electric cyan rim glows, dark wet asphalt reflections",
    sampleReferenceUrl: "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "warm-organic",
    label: "Warm Organic",
    tagline: "Earthy botanical & sunlit calmness",
    description: "Soft terracotta, raw linen textures, gentle botanical dappled light, calm Scandinavian lifestyle.",
    colors: ["#292524", "#78716c", "#10b981", "#f5f5f4"],
    promptKeywords: "warm organic aesthetic, raw natural textures, dappled morning sunlight through foliage, calm earthy tones, serene mood",
    sampleReferenceUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "clay-3d",
    label: "Clay 3D Render",
    tagline: "Playful tactile isometric 3D shapes",
    description: "Smooth matte tactile pastel shapes, clean isometric angle, soft ambient occlusion, toy-like tactile charm.",
    colors: ["#f43f5e", "#fb923c", "#38bdf8", "#a855f7"],
    promptKeywords: "smooth 3d clay render, blender cycles style, soft matte finish, cute isometric layout, clean ambient occlusion shadows",
    sampleReferenceUrl: "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=600&q=80",
  },
];

/**
 * Interpolates variables in a string, replacing {{key}} with corresponding values.
 * If a variable is not provided, defaults to sensible fallback or cleans the braces.
 */
export function interpolateDynamicText(
  templateStr: string,
  variables?: Record<string, string>
): string {
  if (!templateStr) return "";
  if (!variables || Object.keys(variables).length === 0) {
    // Return with default placeholder replacements if no map provided
    return templateStr.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key) => {
      const preset = PRESET_DYNAMIC_VARIABLES.find((p) => p.key === key);
      return preset ? preset.defaultValue : key;
    });
  }

  return templateStr.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key) => {
    if (variables[key] !== undefined && variables[key] !== "") {
      return variables[key];
    }
    const preset = PRESET_DYNAMIC_VARIABLES.find((p) => p.key === key);
    return preset ? preset.defaultValue : match;
  });
}

/**
 * Extracts high-converting search keywords from a product name, description, and URL
 */
export function extractKeywordsFromProduct(
  name: string,
  description: string,
  url: string
): string[] {
  const combined = `${name} ${description} ${url}`.toLowerCase();
  const stopWords = new Set([
    "a", "an", "the", "and", "or", "in", "on", "at", "to", "for", "with", "of",
    "by", "from", "is", "are", "was", "were", "be", "been", "being", "have",
    "has", "had", "do", "does", "did", "can", "could", "will", "would", "shall",
    "should", "may", "might", "must", "that", "which", "who", "whom", "this",
    "these", "those", "it", "its", "they", "them", "their", "we", "us", "our",
    "you", "your", "he", "him", "his", "she", "her", "http", "https", "com",
    "www", "pro", "one", "new", "get", "all", "best", "high", "over", "into"
  ]);

  // Clean words
  const words = combined
    .replace(/[^\w\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w));

  // Count frequencies
  const freq: Record<string, number> = {};
  for (const w of words) {
    freq[w] = (freq[w] || 0) + 1;
  }

  const sorted = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .map(([w]) => w);

  // Guarantee high-value marketing categories if list is too short
  const defaults = ["headphones", "audio", "studio", "wireless", "tech", "gadget", "minimal"];
  const set = new Set([...sorted, ...defaults]);
  return Array.from(set).slice(0, 10);
}
