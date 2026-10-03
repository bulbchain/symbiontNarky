import React from 'react';

interface PixelMushroomLogoProps {
  size?: number; // size in px
  className?: string;
}

/**
 * Pixel art mushroom logo for Symbiont.
 * Renders an authentic 16x16 pixelated alien mycorrhizal bio-fungus
 * with high-contrast neo-brutalist cyberpunk colors.
 */
export const PixelMushroomLogo: React.FC<PixelMushroomLogoProps> = ({
  size = 32,
  className = '',
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center bg-[#1f182a] border-2 border-[#1f182a] shadow-[2px_2px_0px_#1f182a] p-0.5 select-none shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 16 16"
        className="w-full h-full block"
        style={{ shapeRendering: 'crispEdges' }}
      >
        {/* Glow & Aura Spores */}
        <rect x="2" y="2" width="1" height="1" fill="#5affa3" />
        <rect x="13" y="3" width="1" height="1" fill="#ffd9e1" />
        <rect x="1" y="11" width="1" height="1" fill="#5affa3" />
        <rect x="14" y="10" width="1" height="1" fill="#df1871" />

        {/* Mushroom Cap Crown */}
        <rect x="5" y="2" width="6" height="1" fill="#df1871" />
        <rect x="3" y="3" width="10" height="2" fill="#df1871" />
        <rect x="2" y="5" width="12" height="3" fill="#b60059" />
        <rect x="1" y="6" width="14" height="2" fill="#df1871" />

        {/* Cap Bio-Spots */}
        <rect x="4" y="3" width="2" height="1" fill="#ffffff" />
        <rect x="9" y="3" width="2" height="1" fill="#ffffff" />
        <rect x="3" y="5" width="2" height="2" fill="#ffffff" />
        <rect x="11" y="5" width="2" height="2" fill="#5affa3" />
        <rect x="7" y="5" width="2" height="1" fill="#ffd9e1" />

        {/* Stem / Stalk */}
        <rect x="6" y="8" width="4" height="5" fill="#fef7ff" />
        <rect x="5" y="12" width="6" height="2" fill="#eadef7" />

        {/* Cyber Eyes */}
        <rect x="7" y="9" width="1" height="2" fill="#1f182a" />
        <rect x="8" y="9" width="1" height="2" fill="#1f182a" />

        {/* Mycorrhizal Roots */}
        <rect x="4" y="14" width="2" height="1" fill="#5affa3" />
        <rect x="10" y="14" width="2" height="1" fill="#5affa3" />
        <rect x="7" y="14" width="2" height="1" fill="#006d3d" />
      </svg>
    </div>
  );
};
