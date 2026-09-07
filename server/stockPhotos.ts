export interface StockPhotoItem {
  id: string;
  url: string;
  thumbUrl: string;
  alt: string;
  authorName: string;
  authorUrl: string;
  source: "Unsplash" | "Pexels";
  category: string;
  tags: string[];
  width: number;
  height: number;
}

export const CURATED_STOCK_PHOTOS: StockPhotoItem[] = [
  // Audio & Electronics
  {
    id: "stock-audio-1",
    url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1600&q=85",
    thumbUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
    alt: "Premium wireless headphones on black background with studio lighting",
    authorName: "Kiran CK",
    authorUrl: "https://unsplash.com/@kirancool",
    source: "Unsplash",
    category: "Electronics",
    tags: ["headphones", "audio", "music", "wireless", "studio", "sound", "gadget", "black"],
    width: 1600,
    height: 1067,
  },
  {
    id: "stock-audio-2",
    url: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1600&q=85",
    thumbUrl: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80",
    alt: "Wireless over-ear headphones floating against warm ambient background",
    authorName: "Lee Campbell",
    authorUrl: "https://unsplash.com/@leecampbell",
    source: "Unsplash",
    category: "Electronics",
    tags: ["headphones", "audio", "warm", "vibrant", "sound", "listening", "device"],
    width: 1600,
    height: 1067,
  },
  {
    id: "stock-audio-3",
    url: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1600&q=85",
    thumbUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80",
    alt: "True wireless earbuds in open sleek charging case",
    authorName: "C-Head",
    authorUrl: "https://unsplash.com/@chead",
    source: "Unsplash",
    category: "Electronics",
    tags: ["earbuds", "earphones", "audio", "wireless", "gadget", "bluetooth", "white"],
    width: 1600,
    height: 1067,
  },
  {
    id: "stock-tech-4",
    url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1600&q=85",
    thumbUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
    alt: "Minimalist modern smart wrist watch on clean surface",
    authorName: "Rachit Tank",
    authorUrl: "https://unsplash.com/@rachitank",
    source: "Unsplash",
    category: "Electronics",
    tags: ["smartwatch", "watch", "wearable", "tech", "minimal", "clean", "fitness"],
    width: 1600,
    height: 1067,
  },

  // Footwear & Fashion
  {
    id: "stock-fashion-1",
    url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1600&q=85",
    thumbUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
    alt: "Iconic red running sneaker on stark clean neutral background",
    authorName: "Domino Studio",
    authorUrl: "https://unsplash.com/@dominostudio",
    source: "Unsplash",
    category: "Fashion & Footwear",
    tags: ["sneakers", "shoes", "running", "red", "athletic", "sports", "footwear", "vibrant"],
    width: 1600,
    height: 1067,
  },
  {
    id: "stock-fashion-2",
    url: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=1600&q=85",
    thumbUrl: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=600&q=80",
    alt: "Classic black and white canvas sneakers on vibrant yellow background",
    authorName: "Malvestida",
    authorUrl: "https://unsplash.com/@malvestida",
    source: "Unsplash",
    category: "Fashion & Footwear",
    tags: ["sneakers", "skate", "canvas", "yellow", "youth", "streetwear", "retro"],
    width: 1600,
    height: 1067,
  },
  {
    id: "stock-fashion-3",
    url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1600&q=85",
    thumbUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80",
    alt: "High-fashion model in vibrant yellow designer outfit",
    authorName: "Dom Hill",
    authorUrl: "https://unsplash.com/@domhill",
    source: "Unsplash",
    category: "Fashion & Footwear",
    tags: ["fashion", "apparel", "clothing", "editorial", "model", "vibrant", "style"],
    width: 1600,
    height: 2400,
  },
  {
    id: "stock-fashion-4",
    url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=85",
    thumbUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80",
    alt: "Luxury apparel display with elegant minimalist earth tones",
    authorName: "Burgess Milner",
    authorUrl: "https://unsplash.com/@burgessmilner",
    source: "Unsplash",
    category: "Fashion & Footwear",
    tags: ["luxury", "clothing", "minimalist", "aesthetic", "editorial", "boutique", "fashion"],
    width: 1600,
    height: 1067,
  },

  // Tech & Workspace & SaaS
  {
    id: "stock-saas-1",
    url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=85",
    thumbUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
    alt: "Financial analytical dashboard and business data analytics",
    authorName: "Carlos Muza",
    authorUrl: "https://unsplash.com/@kmuza",
    source: "Unsplash",
    category: "Tech & Software",
    tags: ["analytics", "saas", "dashboard", "data", "business", "charts", "finance", "growth"],
    width: 1600,
    height: 1067,
  },
  {
    id: "stock-saas-2",
    url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=85",
    thumbUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
    alt: "High-tech business intelligence graph with colorful charts",
    authorName: "Luke Chesser",
    authorUrl: "https://unsplash.com/@lukechesser",
    source: "Unsplash",
    category: "Tech & Software",
    tags: ["software", "tech", "data", "cloud", "saas", "charts", "metrics", "modern"],
    width: 1600,
    height: 1067,
  },
  {
    id: "stock-workspace-3",
    url: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1600&q=85",
    thumbUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80",
    alt: "Clean modern designer desk setup with curved monitor and peripherals",
    authorName: "Josh Sorenson",
    authorUrl: "https://unsplash.com/@joshsorenson",
    source: "Unsplash",
    category: "Tech & Software",
    tags: ["workspace", "desk", "computer", "productivity", "office", "minimal", "gadget"],
    width: 1600,
    height: 1067,
  },

  // Beauty, Wellness & Cosmetics
  {
    id: "stock-cosmetics-1",
    url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1600&q=85",
    thumbUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80",
    alt: "Luxury cosmetic makeup brushes and skincare bottles on marble",
    authorName: "Raphael Lovaski",
    authorUrl: "https://unsplash.com/@lovaski",
    source: "Unsplash",
    category: "Beauty & Wellness",
    tags: ["cosmetics", "skincare", "beauty", "luxury", "glow", "organic", "wellness", "cream"],
    width: 1600,
    height: 1067,
  },
  {
    id: "stock-cosmetics-2",
    url: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=1600&q=85",
    thumbUrl: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=600&q=80",
    alt: "Minimalist amber cosmetic dropper bottle with natural botanical shadows",
    authorName: "Curology",
    authorUrl: "https://unsplash.com/@curology",
    source: "Unsplash",
    category: "Beauty & Wellness",
    tags: ["skincare", "serum", "dropper", "organic", "clean", "botanical", "amber", "bottle"],
    width: 1600,
    height: 1067,
  },
  {
    id: "stock-wellness-3",
    url: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1600&q=85",
    thumbUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
    alt: "Healthy fresh organic green salad bowl on textured table",
    authorName: "Anna Pelzer",
    authorUrl: "https://unsplash.com/@annapelzer",
    source: "Unsplash",
    category: "Food & Beverage",
    tags: ["healthy", "organic", "food", "nutrition", "diet", "fresh", "wellness", "green"],
    width: 1600,
    height: 1067,
  },

  // Food, Coffee & Beverage
  {
    id: "stock-coffee-1",
    url: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1600&q=85",
    thumbUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80",
    alt: "Artisanal coffee cup with intricate latte art on rustic wood",
    authorName: "Nathan Dumlao",
    authorUrl: "https://unsplash.com/@nate_dumlao",
    source: "Unsplash",
    category: "Food & Beverage",
    tags: ["coffee", "latte", "cafe", "espresso", "beverage", "drink", "morning", "warm"],
    width: 1600,
    height: 1067,
  },
  {
    id: "stock-drink-2",
    url: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1600&q=85",
    thumbUrl: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80",
    alt: "Sparkling refreshing craft citrus cocktail with ice cubes and mint",
    authorName: "Mae Mu",
    authorUrl: "https://unsplash.com/@picoftasty",
    source: "Unsplash",
    category: "Food & Beverage",
    tags: ["cocktail", "drink", "refreshing", "citrus", "beverage", "ice", "bar", "summer"],
    width: 1600,
    height: 2400,
  },

  // Minimal, Abstract & Architectural
  {
    id: "stock-minimal-1",
    url: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1600&q=85",
    thumbUrl: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=600&q=80",
    alt: "Minimal architectural concrete wall with dramatic sharp sunlight and shadows",
    authorName: "Simone Hutsch",
    authorUrl: "https://unsplash.com/@heysupersimi",
    source: "Unsplash",
    category: "Minimal & Studio",
    tags: ["minimalist", "architecture", "concrete", "shadow", "modern", "geometric", "clean"],
    width: 1600,
    height: 1067,
  },
  {
    id: "stock-minimal-2",
    url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1600&q=85",
    thumbUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80",
    alt: "Abstract vibrant oil painting textured background",
    authorName: "Europeana",
    authorUrl: "https://unsplash.com/@europeana",
    source: "Unsplash",
    category: "Minimal & Studio",
    tags: ["abstract", "art", "texture", "vibrant", "creative", "oil", "colorful", "vintage"],
    width: 1600,
    height: 2000,
  },
  {
    id: "stock-futuristic-3",
    url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1600&q=85",
    thumbUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80",
    alt: "Futuristic neon illumination and retro tech hardware",
    authorName: "Lorenzo Herrera",
    authorUrl: "https://unsplash.com/@lorenzoherrera",
    source: "Unsplash",
    category: "Electronics",
    tags: ["futuristic", "cyberpunk", "neon", "retro", "tech", "gaming", "glow", "violet"],
    width: 1600,
    height: 1067,
  },
];

/**
 * Searches stock photos using query, category, and keyword matching.
 */
export async function searchStockPhotos(params: {
  query?: string;
  category?: string;
  perPage?: number;
}): Promise<{
  photos: StockPhotoItem[];
  source: "Unsplash Live API" | "Curated Unsplash Library" | "Pexels Live API";
  total: number;
}> {
  const query = (params.query || "").toLowerCase().trim();
  const category = params.category || "All";
  const perPage = params.perPage || 18;

  // 1. If user has an Unsplash Access Key configured in environment, attempt live query
  if (process.env.UNSPLASH_ACCESS_KEY && query) {
    try {
      const resp = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
          query
        )}&per_page=${perPage}&orientation=landscape`,
        {
          headers: {
            Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
          },
        }
      );
      if (resp.ok) {
        const json: any = await resp.json();
        const photos: StockPhotoItem[] = (json.results || []).map((p: any) => ({
          id: p.id,
          url: p.urls?.regular || p.urls?.full,
          thumbUrl: p.urls?.small || p.urls?.thumb,
          alt: p.alt_description || p.description || "Stock photo",
          authorName: p.user?.name || "Unsplash Creator",
          authorUrl: p.user?.links?.html || "https://unsplash.com",
          source: "Unsplash" as const,
          category: category !== "All" ? category : "Search",
          tags: (p.tags || []).map((t: any) => t.title).filter(Boolean),
          width: p.width,
          height: p.height,
        }));
        return {
          photos,
          source: "Unsplash Live API",
          total: json.total || photos.length,
        };
      }
    } catch (apiErr) {
      console.warn("Live Unsplash query failed, falling back to curated collection:", apiErr);
    }
  }

  // 2. Filter curated high-resolution ad library
  let filtered = CURATED_STOCK_PHOTOS;

  if (category && category !== "All") {
    filtered = filtered.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (query) {
    const queryTerms = query.split(/\s+/).filter((t) => t.length > 1);
    filtered = filtered.filter((photo) => {
      const matchInTags = photo.tags.some((tag) =>
        queryTerms.some((term) => tag.toLowerCase().includes(term))
      );
      const matchInAlt = queryTerms.some((term) =>
        photo.alt.toLowerCase().includes(term)
      );
      const matchInCategory = queryTerms.some((term) =>
        photo.category.toLowerCase().includes(term)
      );
      return matchInTags || matchInAlt || matchInCategory;
    });
  }

  // If search was too narrow, fall back to returning popular items
  if (filtered.length === 0) {
    filtered = CURATED_STOCK_PHOTOS;
  }

  return {
    photos: filtered.slice(0, perPage),
    source: "Curated Unsplash Library",
    total: filtered.length,
  };
}
