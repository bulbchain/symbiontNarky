import React from 'react';

export interface EvolutionStageInfo {
  level: number;
  name: string;
  subtitle: string;
  thresholdMin: number;
  thresholdMax: number;
  color: string;
  badgeBg: string;
  description: string;
  auraClass: string;
}

export const EVOLUTION_STAGES: EvolutionStageInfo[] = [
  {
    level: 1,
    name: 'Spore Embryo',
    subtitle: 'Dormant Seedling',
    thresholdMin: 0,
    thresholdMax: 25000,
    color: '#006d3d',
    badgeBg: '#50fd9f',
    description: 'Freshly grafted nucleus. Trades begin warming up mycorrhizal root connection.',
    auraClass: 'shadow-[0_0_8px_rgba(41,226,136,0.5)]',
  },
  {
    level: 2,
    name: 'Germinated Hypha',
    subtitle: 'Mycelial Sprout',
    thresholdMin: 25000,
    thresholdMax: 100000,
    color: '#7658f8',
    badgeBg: '#f0e3fd',
    description: 'Roots penetrate host liquidity pool; cap develops active fee incineration pores.',
    auraClass: 'shadow-[0_0_12px_rgba(118,88,248,0.6)]',
  },
  {
    level: 3,
    name: 'Apex Mycelium',
    subtitle: 'Fruiting Bio-Cap',
    thresholdMin: 100000,
    thresholdMax: 300000,
    color: '#df1871',
    badgeBg: '#ffd9e1',
    description: 'Fully matured parasite fungus actively digesting host supply with 50% auto-burn.',
    auraClass: 'shadow-[0_0_16px_rgba(223,24,113,0.7)]',
  },
  {
    level: 4,
    name: 'Ancient Titan',
    subtitle: 'Eldritch Symbiote',
    thresholdMin: 300000,
    thresholdMax: Infinity,
    color: '#ba005c',
    badgeBg: '#ffd9e1',
    description: 'Crowned biological chimera; highest tier host incinerator with perpetual yield halo.',
    auraClass: 'shadow-[0_0_20px_rgba(223,24,113,0.9)] ring-2 ring-[#ffd9e1]',
  },
];

export const getSporeStage = (burnVolumeUsd: number): EvolutionStageInfo => {
  if (burnVolumeUsd >= 300000) return EVOLUTION_STAGES[3];
  if (burnVolumeUsd >= 100000) return EVOLUTION_STAGES[2];
  if (burnVolumeUsd >= 25000) return EVOLUTION_STAGES[1];
  return EVOLUTION_STAGES[0];
};

interface SporeEvolvingSpriteProps {
  burnVolumeUsd: number;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  showBadge?: boolean;
}

export const SporeEvolvingSprite: React.FC<SporeEvolvingSpriteProps> = ({
  burnVolumeUsd,
  size = 'md',
  onClick,
  showBadge = true,
}) => {
  const stage = getSporeStage(burnVolumeUsd);

  const dim = size === 'sm' ? 28 : size === 'lg' ? 64 : 40;

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center justify-center p-1 bg-[#1f182a] border-2 border-[#1f182a] ${
        stage.auraClass
      } ${onClick ? 'cursor-pointer hover:scale-105 active:scale-95' : ''} transition-transform select-none`}
      style={{ width: dim + 6, height: dim + 6 }}
      title={`${stage.name} (LVL ${stage.level}) — $${burnVolumeUsd.toLocaleString()} burn volume generated. Click for dossier.`}
    >
      {/* 16x16 Pixel Art Sprite SVG based on stage */}
      <svg
        viewBox="0 0 16 16"
        className="w-full h-full pixelated block"
        style={{ shapeRendering: 'crispEdges' }}
      >
        {/* Stage 1: Embryo Seedling */}
        {stage.level === 1 && (
          <g>
            {/* Background aura dots */}
            <rect x="2" y="3" width="1" height="1" fill="#5affa3" opacity="0.6" />
            <rect x="13" y="4" width="1" height="1" fill="#5affa3" opacity="0.8" />
            <rect x="3" y="12" width="1" height="1" fill="#3be8ff" opacity="0.7" />
            <rect x="12" y="11" width="1" height="1" fill="#ffb1c5" opacity="0.5" />

            {/* Central glowing spore seed */}
            <rect x="6" y="5" width="4" height="6" fill="#50fd9f" />
            <rect x="5" y="6" width="6" height="4" fill="#50fd9f" />
            {/* Inner nucleus */}
            <rect x="6" y="6" width="3" height="3" fill="#ffffff" />
            <rect x="7" y="7" width="2" height="2" fill="#006d3d" />
            {/* Seedling roots */}
            <rect x="7" y="11" width="2" height="2" fill="#29e288" />
            <rect x="6" y="13" width="1" height="1" fill="#29e288" />
            <rect x="9" y="13" width="1" height="1" fill="#29e288" />
          </g>
        )}

        {/* Stage 2: Germinated Hypha (Young Mushroom) */}
        {stage.level === 2 && (
          <g>
            {/* Spore dots */}
            <rect x="2" y="4" width="1" height="1" fill="#caa6fe" />
            <rect x="13" y="3" width="1" height="1" fill="#5affa3" />
            <rect x="1" y="11" width="1" height="1" fill="#7658f8" />
            <rect x="14" y="12" width="1" height="1" fill="#df1871" />

            {/* Cap Outline & Fill */}
            <rect x="5" y="4" width="6" height="1" fill="#7658f8" />
            <rect x="4" y="5" width="8" height="3" fill="#7658f8" />
            <rect x="3" y="6" width="10" height="2" fill="#7658f8" />
            {/* Cap White spots */}
            <rect x="5" y="5" width="2" height="1" fill="#ffffff" />
            <rect x="9" y="6" width="2" height="1" fill="#5affa3" />
            {/* Stem */}
            <rect x="7" y="8" width="2" height="5" fill="#f0e3fd" />
            <rect x="6" y="13" width="4" height="1" fill="#f0e3fd" />
            {/* Cute eyes */}
            <rect x="7" y="9" width="1" height="1" fill="#1f182a" />
            <rect x="8" y="9" width="1" height="1" fill="#1f182a" />
          </g>
        )}

        {/* Stage 3: Apex Mycelium (Mature Arcade Cap) */}
        {stage.level === 3 && (
          <g>
            {/* Floating Energy Spores */}
            <rect x="1" y="3" width="1" height="1" fill="#ffb1c5" />
            <rect x="14" y="4" width="1" height="1" fill="#ffd9e1" />
            <rect x="2" y="13" width="1" height="1" fill="#50fd9f" />
            <rect x="13" y="11" width="1" height="1" fill="#df1871" />

            {/* Broad Cap */}
            <rect x="4" y="3" width="8" height="1" fill="#df1871" />
            <rect x="3" y="4" width="10" height="1" fill="#df1871" />
            <rect x="2" y="5" width="12" height="3" fill="#df1871" />
            {/* Cap Spots */}
            <rect x="4" y="4" width="2" height="2" fill="#ffffff" />
            <rect x="8" y="4" width="2" height="1" fill="#ffd9e1" />
            <rect x="11" y="6" width="2" height="1" fill="#50fd9f" />
            <rect x="3" y="6" width="2" height="1" fill="#ffffff" />
            {/* Antennae */}
            <rect x="7" y="1" width="2" height="2" fill="#ffd9e1" />
            <rect x="7" y="2" width="2" height="1" fill="#df1871" />
            {/* Sturdy Stalk */}
            <rect x="6" y="8" width="4" height="6" fill="#fef7ff" />
            <rect x="5" y="13" width="6" height="2" fill="#eadef7" />
            {/* Antennas / eyes */}
            <rect x="7" y="10" width="1" height="2" fill="#1f182a" />
            <rect x="8" y="10" width="1" height="2" fill="#1f182a" />
          </g>
        )}

        {/* Stage 4: Ancient Titan Chimera (Crowned Eldritch Fungus) */}
        {stage.level === 4 && (
          <g>
            {/* Prismatic Crown Horns */}
            <rect x="3" y="1" width="2" height="2" fill="#ff9f1c" />
            <rect x="7" y="0" width="2" height="2" fill="#50fd9f" />
            <rect x="11" y="1" width="2" height="2" fill="#ff9f1c" />

            {/* Majestic Crowned Cap */}
            <rect x="3" y="2" width="10" height="2" fill="#b60059" />
            <rect x="2" y="4" width="12" height="2" fill="#df1871" />
            <rect x="1" y="6" width="14" height="3" fill="#df1871" />

            {/* Glowing Golden Gems & Cyan Bio-Pores */}
            <rect x="4" y="4" width="2" height="2" fill="#ffffff" />
            <rect x="10" y="4" width="2" height="2" fill="#5affa3" />
            <rect x="7" y="5" width="2" height="2" fill="#ffd9e1" />
            <rect x="2" y="7" width="2" height="1" fill="#ff9f1c" />
            <rect x="12" y="7" width="2" height="1" fill="#5affa3" />

            {/* Titan Body & Floating Energy Rings */}
            <rect x="5" y="9" width="6" height="5" fill="#f0e3fd" />
            <rect x="4" y="13" width="8" height="2" fill="#ffd9e1" />
            {/* Glowing Eyes */}
            <rect x="6" y="10" width="1" height="2" fill="#df1871" />
            <rect x="9" y="10" width="1" height="2" fill="#df1871" />
            {/* Energy halo dots */}
            <rect x="0" y="8" width="1" height="1" fill="#5affa3" />
            <rect x="15" y="8" width="1" height="1" fill="#5affa3" />
            <rect x="2" y="14" width="1" height="1" fill="#ff9f1c" />
            <rect x="13" y="14" width="1" height="1" fill="#ff9f1c" />
          </g>
        )}
      </svg>

      {/* Level Badge Overlay */}
      {showBadge && (
        <span
          className="absolute -top-1.5 -right-1.5 px-1 py-0.2 font-mono text-[7px] font-bold uppercase border border-[#1f182a] leading-none"
          style={{ backgroundColor: stage.badgeBg, color: stage.color }}
        >
          {stage.level === 4 ? 'LV.4 ★' : `L${stage.level}`}
        </span>
      )}
    </div>
  );
};
