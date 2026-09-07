import React, { useState, useEffect } from "react";
import {
  Search,
  X,
  Sparkles,
  ExternalLink,
  Check,
  Palette,
  Loader2,
  SlidersHorizontal,
  Image as ImageIcon,
} from "lucide-react";
import { StockPhoto, CampaignData } from "../types";
import { extractKeywordsFromProduct } from "../utils/dynamicText";

interface StockPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: CampaignData;
  onSelectPhoto: (
    photo: StockPhoto,
    applyToAll?: boolean,
    asStyleTransferRef?: boolean
  ) => void;
}

const CATEGORIES = [
  "All",
  "Electronics",
  "Fashion & Footwear",
  "Tech & Software",
  "Beauty & Wellness",
  "Food & Beverage",
  "Minimal & Studio",
];

export const StockPhotoModal: React.FC<StockPhotoModalProps> = ({
  isOpen,
  onClose,
  campaign,
  onSelectPhoto,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [photos, setPhotos] = useState<StockPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null);
  const [sourceName, setSourceName] = useState("Curated Unsplash Library");

  const productKeywords = React.useMemo(() => {
    return extractKeywordsFromProduct(
      campaign.name,
      campaign.productDescription,
      campaign.targetUrl
    );
  }, [campaign.name, campaign.productDescription, campaign.targetUrl]);

  // Initial load or search
  const fetchPhotos = async (term: string, cat: string) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (term) params.set("q", term);
      if (cat && cat !== "All") params.set("category", cat);
      params.set("perPage", "24");

      const res = await fetch(`/api/stock-photos?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setPhotos(json.data);
          if (json.source) setSourceName(json.source);
        }
      }
    } catch (err) {
      console.error("Error fetching stock photos:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      // Default to product-focused term if no search
      const initialTerm = productKeywords[0] || "";
      setSearchTerm(initialTerm);
      fetchPhotos(initialTerm, selectedCategory);
    }
  }, [isOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPhotos(searchTerm, selectedCategory);
  };

  const handleCategoryClick = (cat: string) => {
    setSelectedCategory(cat);
    fetchPhotos(searchTerm, cat);
  };

  const handleKeywordClick = (kw: string) => {
    setSearchTerm(kw);
    fetchPhotos(kw, selectedCategory);
  };

  if (!isOpen) return null;

  return (
    <div
      id="stock-photo-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 sm:p-6"
    >
      <div
        id="stock-photo-modal-container"
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-100"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                Stock Photography Library
              </h2>
              <p className="text-xs text-slate-400">
                Commercial high-resolution assets &middot; Sourced via {sourceName}
              </p>
            </div>
          </div>
          <button
            id="stock-photo-modal-close-btn"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Controls */}
        <div className="p-6 border-b border-slate-800/80 space-y-4 bg-slate-900/40">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="stock-photo-search-input"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search stock photos by keywords (e.g. headphones, running, minimal, coffee)..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              id="stock-photo-search-btn"
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              Search
            </button>
          </form>

          {/* Smart Product Keywords */}
          {productKeywords.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Product Match Keywords:
              </span>
              {productKeywords.map((kw) => (
                <button
                  key={kw}
                  type="button"
                  onClick={() => handleKeywordClick(kw)}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                    searchTerm.toLowerCase() === kw.toLowerCase()
                      ? "bg-blue-500/20 text-blue-300 border-blue-500/40"
                      : "bg-slate-950/60 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white"
                  }`}
                >
                  #{kw}
                </button>
              ))}
            </div>
          )}

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryClick(cat)}
                className={`text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? "bg-slate-800 text-white border border-slate-700 shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Photo Results Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="h-64 flex flex-col items-center justify-center gap-3 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              <p className="text-sm">Fetching high-resolution commercial stock photos...</p>
            </div>
          ) : photos.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center gap-2 text-center text-slate-400">
              <ImageIcon className="w-10 h-10 text-slate-600 mb-2" />
              <p className="text-sm font-medium text-slate-300">No photos found matching &ldquo;{searchTerm}&rdquo;</p>
              <p className="text-xs text-slate-500 max-w-sm">
                Try searching for related product keywords or select one of the category chips above.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {photos.map((photo) => {
                const isSelected = selectedPhotoId === photo.id;
                return (
                  <div
                    key={photo.id}
                    className={`group relative rounded-xl overflow-hidden border transition-all bg-slate-950 flex flex-col ${
                      isSelected
                        ? "border-blue-500 ring-2 ring-blue-500/30 shadow-lg"
                        : "border-slate-800 hover:border-slate-700 hover:shadow-md"
                    }`}
                  >
                    {/* Image Preview Container */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                      <img
                        src={photo.thumbUrl || photo.url}
                        alt={photo.alt}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                        <div className="flex items-center justify-between text-xs text-slate-200">
                          <span className="truncate max-w-[140px] font-medium">
                            {photo.authorName}
                          </span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-black/60 backdrop-blur-sm border border-white/10">
                            {photo.source}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Meta info & Action bar */}
                    <div className="p-3 bg-slate-950 flex flex-col gap-2">
                      <p className="text-xs text-slate-400 line-clamp-1" title={photo.alt}>
                        {photo.alt}
                      </p>

                      <div className="flex items-center gap-1.5 pt-1 border-t border-slate-900">
                        {/* Use as banner ad image */}
                        <button
                          id={`use-stock-btn-${photo.id}`}
                          type="button"
                          onClick={() => {
                            setSelectedPhotoId(photo.id);
                            onSelectPhoto(photo, false, false);
                            onClose();
                          }}
                          className="flex-1 py-1.5 px-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Use in Banner
                        </button>

                        {/* Use as style transfer reference */}
                        <button
                          id={`style-ref-btn-${photo.id}`}
                          type="button"
                          title="Use this photo's aesthetic and color palette as reference for AI style transfer"
                          onClick={() => {
                            setSelectedPhotoId(photo.id);
                            onSelectPhoto(photo, false, true);
                            onClose();
                          }}
                          className="p-1.5 bg-slate-800 hover:bg-amber-500/20 text-slate-300 hover:text-amber-400 rounded-lg text-xs transition-colors border border-slate-700"
                        >
                          <Palette className="w-3.5 h-3.5" />
                        </button>

                        {/* Direct link */}
                        <a
                          href={photo.authorUrl}
                          target="_blank"
                          rel="noreferrer"
                          title="View on Unsplash"
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 rounded-lg text-xs transition-colors border border-slate-700"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800/80 bg-slate-900/60 flex items-center justify-between text-xs text-slate-400">
          <span>
            Displaying {photos.length} advertising-grade assets. Selected image replaces visual layer on active banner.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
