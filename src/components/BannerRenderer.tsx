import React from "react";
import { BannerDimension, AdVariant } from "../types";
import { ExternalLink, Sparkles, ShieldCheck, Camera } from "lucide-react";
import { interpolateDynamicText } from "../utils/dynamicText";
import { FancyQRCode } from "./FancyQRCode";

interface BannerRendererProps {
  size: BannerDimension;
  variant: AdVariant;
  scale?: number;
  interactive?: boolean;
  onClickAd?: () => void;
  className?: string;
  showAdBadge?: boolean;
  activeCtaOverride?: string;
}

export const BannerRenderer: React.FC<BannerRendererProps> = ({
  size,
  variant,
  scale = 1,
  interactive = true,
  onClickAd,
  className = "",
  showAdBadge = true,
  activeCtaOverride,
}) => {
  const { copy, template, image } = variant;
  const { width, height } = size;

  // Interpolate dynamic placeholders (e.g. {{discount_percentage}}%, {{city}}, {{promo_code}})
  const dynamicVars = copy.dynamicVariables || {};
  const headline = interpolateDynamicText(copy.headline, dynamicVars);
  const subheadline = interpolateDynamicText(copy.subheadline, dynamicVars);
  const badgeText = copy.badgeText
    ? interpolateDynamicText(copy.badgeText, dynamicVars)
    : "";
  const rawCta = activeCtaOverride || copy.ctaText;
  const ctaText = interpolateDynamicText(rawCta, dynamicVars);
  const secondaryCtaText = copy.secondaryCtaText
    ? interpolateDynamicText(copy.secondaryCtaText, dynamicVars)
    : "Learn More";
  const brandName = interpolateDynamicText(copy.brandName, dynamicVars);

  // Derive font family css class
  const getFontFamily = () => {
    switch (template.fontFamily) {
      case "Space Grotesk":
        return "font-['Space_Grotesk']";
      case "Cinzel":
        return "font-['Cinzel']";
      case "Plus Jakarta Sans":
        return "font-['Plus_Jakarta_Sans']";
      case "Outfit":
      default:
        return "font-['Outfit']";
    }
  };

  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace("www.", "");
    } catch {
      return "aura-acoustics.audio";
    }
  };

  const domain = getDomain(copy.targetUrl);

  const handleClick = (e: React.MouseEvent) => {
    if (!interactive) return;
    if (onClickAd) {
      onClickAd();
    }
  };

  // Specialized formatting helpers
  const isBillboard = size.id === "billboard_970x250";
  const isMobileBanner = size.id === "mobile_leaderboard_320x50";

  return (
    <div
      className={`relative select-none overflow-hidden transition-shadow ${
        interactive ? "cursor-pointer hover:shadow-xl" : ""
      } ${className}`}
      style={{
        width: `${width * scale}px`,
        height: `${height * scale}px`,
      }}
      onClick={handleClick}
      id={`banner-${size.id}-${variant.id}`}
      title={`Banner ${size.width}x${size.height} - Click to simulate interaction`}
    >
      {/* Scaled Inner Wrapper */}
      <div
        className={`absolute top-0 left-0 origin-top-left flex flex-col justify-between ${getFontFamily()}`}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          transform: `scale(${scale})`,
          backgroundColor: template.primaryColor,
          color: template.textColor,
          border: template.showBorder ? "1px solid rgba(255,255,255,0.18)" : "none",
        }}
      >
        {/* Background Image Layer */}
        {image.imageUrl && (
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <img
              src={image.imageUrl}
              alt={headline}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center transform transition-transform duration-700 hover:scale-105"
            />
            {/* Darkening / Gradient Overlay */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  template.theme === "bold-vibrant"
                    ? `linear-gradient(135deg, rgba(0,0,0,${template.overlayOpacity + 0.1}) 0%, rgba(0,0,0,${template.overlayOpacity * 0.7}) 100%)`
                    : template.theme === "cyber-neon"
                    ? `radial-gradient(circle at 20% 50%, rgba(15,23,42,${template.overlayOpacity}) 0%, rgba(2,6,23,0.92) 100%)`
                    : `linear-gradient(to top, rgba(15,23,42,0.95) 0%, rgba(15,23,42,${template.overlayOpacity}) 60%, rgba(15,23,42,0.4) 100%)`,
              }}
            />
          </div>
        )}

        {/* Ad Marker (IAB Compliant) */}
        {showAdBadge && (
          <div className="absolute top-1 right-1 z-30 flex items-center gap-0.5 bg-black/60 backdrop-blur-xs px-1.5 py-0.5 rounded text-[9px] font-mono text-white/70 pointer-events-none">
            <span>Ad</span>
            <ExternalLink className="w-2.5 h-2.5 opacity-60" />
          </div>
        )}

        {/* Stock Photo / Asset Attribution (Subtle corner) */}
        {image.attribution?.authorName && (
          <div className="absolute bottom-1 left-1 z-20 flex items-center gap-1 bg-black/40 backdrop-blur-xs px-1.5 py-0.5 rounded text-[8px] font-mono text-white/60 pointer-events-none">
            <Camera className="w-2.5 h-2.5" />
            <span className="truncate max-w-[110px]">
              {image.attribution.authorName} ({image.attribution.source || "Stock"})
            </span>
          </div>
        )}

        {/* --- FORMAT 1: MOBILE BANNER (320x50) --- */}
        {isMobileBanner && (
          <div className="relative z-10 w-full h-full flex items-center justify-between px-3 py-1 bg-black/40 backdrop-blur-xs">
            <div className="flex flex-col justify-center min-w-0 pr-2">
              <span className="text-[9px] uppercase tracking-wider font-semibold text-white/75 truncate">
                {brandName}
              </span>
              <p className="text-[11px] font-bold leading-tight text-white truncate">
                {headline}
              </p>
            </div>
            <button
              id={`btn-cta-${size.id}`}
              className={`shrink-0 text-[10px] font-bold px-2.5 py-1 text-white shadow-sm transition-all hover:brightness-110 active:scale-95 whitespace-nowrap ${template.buttonStyle}`}
              style={{ backgroundColor: template.accentColor }}
            >
              {ctaText}
            </button>
          </div>
        )}

        {/* --- FORMAT 2: LEADERBOARD (728x90) --- */}
        {size.id === "leaderboard_728x90" && (
          <div className="relative z-10 w-full h-full flex items-center justify-between px-6 py-2">
            {/* Left: Brand & Badge */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] uppercase tracking-widest font-bold text-white/80">
                  {brandName}
                </span>
                {template.showBadge && badgeText && (
                  <span className="inline-block text-[10px] font-semibold text-amber-300">
                    ★ {badgeText}
                  </span>
                )}
              </div>
            </div>

            {/* Middle: Headline & Subheadline */}
            <div className="flex flex-col items-center text-center px-4 max-w-[340px]">
              <h3 className="text-[16px] font-extrabold leading-snug text-white tracking-tight drop-shadow-sm truncate max-w-full">
                {headline}
              </h3>
              <p className="text-[11px] text-white/85 line-clamp-1 font-medium">
                {subheadline}
              </p>
            </div>

            {/* Right: Primary & Secondary CTA */}
            <div className="flex items-center gap-2 shrink-0">
              {template.showSecondaryCta && (
                <button
                  type="button"
                  className="px-3 py-2 text-[11px] font-bold text-white/90 bg-white/10 hover:bg-white/20 border border-white/30 rounded-md transition-all whitespace-nowrap"
                >
                  {secondaryCtaText}
                </button>
              )}
              <div className="flex flex-col items-end gap-1">
                <button
                  id={`btn-cta-${size.id}`}
                  className={`px-5 py-2 text-[12px] font-extrabold text-white shadow-lg transition-all hover:brightness-110 active:scale-95 whitespace-nowrap flex items-center gap-1.5 ${template.buttonStyle}`}
                  style={{ backgroundColor: template.accentColor }}
                >
                  <span>{ctaText}</span>
                </button>
                <span className="text-[9px] text-white/60 tracking-wider">
                  {domain}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* --- FORMAT 3: BILLBOARD (970x250) --- */}
        {isBillboard && (
          <div className="relative z-10 w-full h-full flex items-center justify-between p-8">
            <div className="max-w-[560px] flex flex-col gap-3">
              {/* Brand & Badge */}
              <div className="flex items-center gap-3">
                <span className="text-xs uppercase tracking-widest font-bold px-2 py-0.5 rounded bg-white/15 text-white">
                  {brandName}
                </span>
                {template.showBadge && badgeText && (
                  <span
                    className="text-xs font-semibold px-2.5 py-0.5 rounded-full text-black font-mono"
                    style={{ backgroundColor: "#fbbf24" }}
                  >
                    {badgeText}
                  </span>
                )}
              </div>

              {/* Headline */}
              <h2 className="text-3xl font-extrabold text-white leading-tight tracking-tight">
                {headline}
              </h2>

              {/* Subheadline */}
              <p className="text-base text-white/85 leading-relaxed line-clamp-2">
                {subheadline}
              </p>

              {/* Multiple Action Buttons */}
              <div className="flex items-center gap-3 mt-2">
                <button
                  id={`btn-cta-${size.id}`}
                  className={`px-7 py-3 text-sm font-bold text-white shadow-xl transition-all hover:brightness-110 active:scale-95 whitespace-nowrap ${template.buttonStyle}`}
                  style={{ backgroundColor: template.accentColor }}
                >
                  {ctaText}
                </button>

                {template.showSecondaryCta && (
                  <button
                    type="button"
                    className="px-6 py-3 text-sm font-bold text-white bg-white/10 hover:bg-white/20 border border-white/30 rounded-lg transition-all whitespace-nowrap"
                  >
                    {secondaryCtaText}
                  </button>
                )}

                <div className="flex items-center gap-1 text-xs text-white/70 ml-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Official Store • {domain}</span>
                </div>
              </div>
            </div>

            {/* QR Code Overlay (Right Side) */}
            {template.qrCode?.enabled && (
              <div className="shrink-0 pl-6 flex items-center justify-center">
                <FancyQRCode
                  rawUrl={copy.targetUrl}
                  config={template.qrCode}
                  sizePx={88}
                  bannerSizeId={size.id}
                  variantId={variant.id}
                  accentColor={template.accentColor}
                />
              </div>
            )}
          </div>
        )}

        {/* --- FORMAT 4: WIDE SKYSCRAPER (160x600) --- */}
        {size.id === "wide_skyscraper_160x600" && (
          <div className="relative z-10 w-full h-full flex flex-col justify-between p-3.5 text-center">
            {/* Top Brand Header */}
            <div className="flex flex-col items-center gap-1 pt-2">
              <span className="text-[10px] uppercase tracking-widest font-bold text-white/80">
                {brandName}
              </span>
              {template.showBadge && badgeText && (
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-black truncate max-w-[130px]">
                  {badgeText}
                </span>
              )}
            </div>

            {/* Middle Message */}
            <div className="flex flex-col items-center my-auto py-4">
              <h3 className="text-base font-extrabold text-white leading-snug tracking-tight mb-2">
                {headline}
              </h3>
              <p className="text-[11px] text-white/80 leading-normal line-clamp-3">
                {subheadline}
              </p>
            </div>

            {/* Bottom Multiple CTAs & QR Code */}
            <div className="flex flex-col items-center gap-2 pb-2">
              {template.qrCode?.enabled && (
                <div className="mb-1">
                  <FancyQRCode
                    rawUrl={copy.targetUrl}
                    config={template.qrCode}
                    sizePx={58}
                    bannerSizeId={size.id}
                    variantId={variant.id}
                    accentColor={template.accentColor}
                  />
                </div>
              )}

              <button
                id={`btn-cta-${size.id}`}
                className={`w-full py-2.5 text-xs font-bold text-white shadow-lg transition-all hover:brightness-110 active:scale-95 whitespace-nowrap ${template.buttonStyle}`}
                style={{ backgroundColor: template.accentColor }}
              >
                {ctaText}
              </button>

              {template.showSecondaryCta && (
                <button
                  type="button"
                  className="w-full py-2 text-[11px] font-semibold text-white/85 bg-white/10 hover:bg-white/20 border border-white/20 rounded-md transition-all whitespace-nowrap"
                >
                  {secondaryCtaText}
                </button>
              )}

              <span className="text-[9px] text-white/60 truncate max-w-full">
                {domain}
              </span>
            </div>
          </div>
        )}

        {/* --- FORMAT 5: HALF PAGE / MONSTER (300x600) --- */}
        {size.id === "half_page_300x600" && (
          <div className="relative z-10 w-full h-full flex flex-col justify-between p-6">
            {/* Top Header */}
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest font-extrabold text-white/90">
                {brandName}
              </span>
              {template.showBadge && badgeText && (
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-400 text-black">
                  {badgeText}
                </span>
              )}
            </div>

            {/* Middle / Bottom Content */}
            <div className="mt-auto flex flex-col gap-3">
              <h2 className="text-2xl font-black text-white leading-tight tracking-tight drop-shadow-md">
                {headline}
              </h2>
              <p className="text-sm text-white/90 leading-relaxed font-medium line-clamp-3">
                {subheadline}
              </p>

              {/* QR Code Section */}
              {template.qrCode?.enabled && (
                <div className="flex justify-center py-1">
                  <FancyQRCode
                    rawUrl={copy.targetUrl}
                    config={template.qrCode}
                    sizePx={72}
                    bannerSizeId={size.id}
                    variantId={variant.id}
                    accentColor={template.accentColor}
                  />
                </div>
              )}

              {/* Multiple CTAs */}
              <div className="pt-2 space-y-2">
                <button
                  id={`btn-cta-${size.id}`}
                  className={`w-full py-3 text-sm font-extrabold text-white shadow-2xl transition-all hover:brightness-110 active:scale-95 whitespace-nowrap ${template.buttonStyle}`}
                  style={{ backgroundColor: template.accentColor }}
                >
                  {ctaText}
                </button>

                {template.showSecondaryCta && (
                  <button
                    type="button"
                    className="w-full py-2.5 text-xs font-bold text-white bg-white/15 hover:bg-white/25 border border-white/30 rounded-lg transition-all whitespace-nowrap"
                  >
                    {secondaryCtaText}
                  </button>
                )}

                <p className="text-center text-[10px] text-white/70 pt-1 font-mono">
                  Visit {domain}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* --- FORMAT 6: RECTANGLES & SQUARES (300x250, 336x280, 250x250) --- */}
        {(size.id === "med_rect_300x250" ||
          size.id === "large_rect_336x280" ||
          size.id === "square_250x250") && (
          <div className="relative z-10 w-full h-full flex flex-col justify-between p-4">
            {/* Top Bar */}
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider font-extrabold text-white/85">
                {brandName}
              </span>
              {template.showBadge && badgeText && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-black">
                  {badgeText}
                </span>
              )}
            </div>

            {/* Middle Content with optional QR Code */}
            <div className="my-auto py-1 flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-black text-white leading-snug tracking-tight mb-1">
                  {headline}
                </h3>
                <p className="text-xs text-white/85 leading-normal line-clamp-2">
                  {subheadline}
                </p>
              </div>

              {template.qrCode?.enabled && (
                <div className="shrink-0">
                  <FancyQRCode
                    rawUrl={copy.targetUrl}
                    config={template.qrCode}
                    sizePx={size.id === "square_250x250" ? 52 : 62}
                    bannerSizeId={size.id}
                    variantId={variant.id}
                    accentColor={template.accentColor}
                  />
                </div>
              )}
            </div>

            {/* Bottom Bar: Action buttons & domain */}
            <div className="flex items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-1.5">
                <button
                  id={`btn-cta-${size.id}`}
                  className={`px-4 py-2 text-xs font-bold text-white shadow-md transition-all hover:brightness-110 active:scale-95 whitespace-nowrap ${template.buttonStyle}`}
                  style={{ backgroundColor: template.accentColor }}
                >
                  {ctaText}
                </button>
                {template.showSecondaryCta && (
                  <button
                    type="button"
                    className="px-2.5 py-2 text-[10px] font-bold text-white/80 bg-white/10 hover:bg-white/20 border border-white/20 rounded-md transition-all whitespace-nowrap"
                  >
                    {secondaryCtaText}
                  </button>
                )}
              </div>
              <span className="text-[10px] text-white/60 font-mono truncate">
                {domain}
              </span>
            </div>
          </div>
        )}

        {/* --- FORMAT 7: SOCIAL SQUARE (1080x1080) --- */}
        {size.id === "social_square_1080x1080" && (
          <div className="relative z-10 w-full h-full flex flex-col justify-between p-16">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center border border-white/30 shadow-lg">
                  <Sparkles className="w-8 h-8 text-amber-300" />
                </div>
                <span className="text-3xl uppercase tracking-widest font-black text-white">
                  {brandName}
                </span>
              </div>
              {template.showBadge && badgeText && (
                <span className="text-2xl font-bold px-6 py-2 rounded-full bg-amber-400 text-black shadow-md">
                  {badgeText}
                </span>
              )}
            </div>

            <div className="flex items-end justify-between gap-8 mb-8">
              <div className="flex flex-col gap-6 max-w-[700px]">
                <h2 className="text-6xl font-black text-white leading-tight tracking-tight drop-shadow-lg">
                  {headline}
                </h2>
                <p className="text-2xl text-white/90 leading-relaxed font-medium">
                  {subheadline}
                </p>
                <div className="flex items-center gap-6 mt-4">
                  <button
                    id={`btn-cta-${size.id}`}
                    className={`px-12 py-5 text-2xl font-black text-white shadow-2xl transition-all hover:brightness-110 active:scale-95 whitespace-nowrap ${template.buttonStyle}`}
                    style={{ backgroundColor: template.accentColor }}
                  >
                    {ctaText}
                  </button>

                  {template.showSecondaryCta && (
                    <button
                      type="button"
                      className="px-10 py-5 text-2xl font-bold text-white bg-white/20 hover:bg-white/30 border border-white/40 rounded-xl transition-all whitespace-nowrap"
                    >
                      {secondaryCtaText}
                    </button>
                  )}

                  <span className="text-xl text-white/70 font-mono">
                    {domain}
                  </span>
                </div>
              </div>

              {template.qrCode?.enabled && (
                <div className="shrink-0 pb-2">
                  <FancyQRCode
                    rawUrl={copy.targetUrl}
                    config={template.qrCode}
                    sizePx={160}
                    bannerSizeId={size.id}
                    variantId={variant.id}
                    accentColor={template.accentColor}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- FORMAT 8: SOCIAL STORY (1080x1920) --- */}
        {size.id === "social_story_1080x1920" && (
          <div className="relative z-10 w-full h-full flex flex-col justify-between p-16 pb-24">
            <div className="flex items-center justify-between pt-8">
              <span className="text-3xl uppercase tracking-widest font-black text-white">
                {brandName}
              </span>
              {template.showBadge && badgeText && (
                <span className="text-2xl font-bold px-6 py-2 rounded-full bg-amber-400 text-black">
                  {badgeText}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-8 mb-12">
              <h2 className="text-7xl font-black text-white leading-tight tracking-tight drop-shadow-xl">
                {headline}
              </h2>
              <p className="text-3xl text-white/90 leading-relaxed font-medium">
                {subheadline}
              </p>

              {template.qrCode?.enabled && (
                <div className="flex justify-center py-2">
                  <FancyQRCode
                    rawUrl={copy.targetUrl}
                    config={template.qrCode}
                    sizePx={170}
                    bannerSizeId={size.id}
                    variantId={variant.id}
                    accentColor={template.accentColor}
                  />
                </div>
              )}

              <div className="pt-4 space-y-4">
                <button
                  id={`btn-cta-${size.id}`}
                  className={`w-full py-7 text-3xl font-black text-white shadow-2xl transition-all hover:brightness-110 active:scale-95 whitespace-nowrap ${template.buttonStyle}`}
                  style={{ backgroundColor: template.accentColor }}
                >
                  {ctaText}
                </button>

                {template.showSecondaryCta && (
                  <button
                    type="button"
                    className="w-full py-6 text-2xl font-bold text-white bg-white/20 hover:bg-white/30 border border-white/40 rounded-2xl transition-all whitespace-nowrap"
                  >
                    {secondaryCtaText}
                  </button>
                )}

                <p className="text-center text-xl text-white/60 mt-6 font-mono tracking-widest uppercase">
                  Swipe Up or Visit {domain}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
