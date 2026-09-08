import React, { useState } from 'react';
import { normalizeImageUrl } from '../../utils/imageUrlHelper';

export const OFFICIAL_SRA_LOGO_URL = 'https://dl.dropboxusercontent.com/scl/fi/nb2nlqyg2burby32mfadd/SRA-logo-jpg.jpg.jpeg?rlkey=0dvqdlukpnotnkudj76bfdw24&st=5rg8xcav&raw=1';

interface SRALogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'full' | 'icon-only' | 'text-only' | 'stacked' | 'horizontal';
  showSubtitle?: boolean;
  subtitleText?: string;
  theme?: 'colored' | 'white' | 'dark-bg';
  logoUrl?: string;
}

export const SRALogo: React.FC<SRALogoProps> = ({
  className = '',
  size = 'md',
  variant = 'full',
  showSubtitle = true,
  subtitleText = 'ALLKURMA Official Store',
  theme = 'colored',
  logoUrl = OFFICIAL_SRA_LOGO_URL
}) => {
  const [imgError, setImgError] = useState(false);
  const activeLogoSrc = normalizeImageUrl(logoUrl || OFFICIAL_SRA_LOGO_URL);

  // Dimension presets
  const sizeMap = {
    xs: { icon: 26, font: 'text-sm', sub: 'text-[9px]', gap: 'gap-1.5' },
    sm: { icon: 34, font: 'text-lg', sub: 'text-[10px]', gap: 'gap-2' },
    md: { icon: 44, font: 'text-2xl', sub: 'text-xs', gap: 'gap-2.5' },
    lg: { icon: 56, font: 'text-3xl', sub: 'text-xs', gap: 'gap-3' },
    xl: { icon: 72, font: 'text-4xl', sub: 'text-sm', gap: 'gap-3.5' },
    '2xl': { icon: 96, font: 'text-5xl', sub: 'text-base', gap: 'gap-4' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  const greenColor = theme === 'white' ? '#FFFFFF' : '#009A44'; // Emerald Leaf Green
  const blueColor = theme === 'white' ? '#FFFFFF' : (theme === 'dark-bg' ? '#60A5FA' : '#1E3A8A'); // Royal Navy Blue

  // Vector Knot Symbol (Exact geometry matching the four-loop interlocking ribbon in the user image)
  const KnotIcon = ({ iconSize }: { iconSize: number }) => (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform duration-300 group-hover:scale-105"
    >
      <g stroke={greenColor} strokeWidth="22" strokeLinecap="round" strokeLinejoin="round">
        <path d="M 68,96 L 68,60 C 68,40 82,24 100,24 C 118,24 132,40 132,60 L 132,96" />
        <path d="M 132,104 L 132,140 C 132,160 118,176 100,176 C 82,176 68,160 68,140 L 68,104" />
        <path d="M 96,132 L 60,132 C 40,132 24,118 24,100 C 24,82 40,68 60,68 L 96,68" />
        <path d="M 104,68 L 140,68 C 160,68 176,82 176,100 C 176,118 160,132 140,132 L 104,132" />
        <path d="M 68,68 L 132,132" />
        <path d="M 132,68 L 68,132" />
      </g>
    </svg>
  );

  const LogoVisual = ({ iconSize }: { iconSize: number }) => {
    if (!imgError && activeLogoSrc) {
      return (
        <div 
          style={{ width: iconSize, height: iconSize }}
          className="rounded-lg overflow-hidden bg-white shadow-xs border border-stone-200/80 shrink-0 flex items-center justify-center p-0.5"
        >
          <img
            src={activeLogoSrc}
            alt="SRA AllKurma Logo"
            className="w-full h-full object-contain"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
          />
        </div>
      );
    }
    return <KnotIcon iconSize={iconSize} />;
  };

  if (variant === 'icon-only') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <LogoVisual iconSize={currentSize.icon} />
      </div>
    );
  }

  if (variant === 'stacked') {
    return (
      <div className={`flex flex-col items-center text-center ${currentSize.gap} ${className}`}>
        <div className="p-2 rounded-2xl bg-white shadow-xs border border-emerald-100 flex items-center justify-center">
          <LogoVisual iconSize={currentSize.icon} />
        </div>
        <div>
          <span 
            className={`font-black tracking-wider ${currentSize.font} leading-none block font-['Plus_Jakarta_Sans',sans-serif]`}
            style={{ color: blueColor }}
          >
            SRA
          </span>
          {showSubtitle && (
            <p className={`${currentSize.sub} font-semibold tracking-wider uppercase text-emerald-600 mt-1`}>
              {subtitleText}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center ${currentSize.gap} ${className}`}>
      <LogoVisual iconSize={currentSize.icon} />
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-1.5">
          <span
            className={`font-black tracking-tight ${currentSize.font} leading-none font-['Plus_Jakarta_Sans',sans-serif]`}
            style={{ color: blueColor }}
          >
            SRA
          </span>
          <span className="text-xs font-extrabold px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300/80 leading-none">
            ALLKURMA
          </span>
        </div>
        {showSubtitle && (
          <span className={`${currentSize.sub} font-semibold text-stone-500 tracking-wide mt-0.5`}>
            {subtitleText}
          </span>
        )}
      </div>
    </div>
  );
};
