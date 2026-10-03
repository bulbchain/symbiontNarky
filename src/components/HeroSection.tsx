import React, { useState } from 'react';
import { MEADOW_IMAGE_URL } from '../data/protocolData';
import { sound } from '../utils/audio';
import { SOCIAL_LINKS } from '../constants/links';
import { PixelMushroomLogo } from './PixelMushroomLogo';

interface HeroSectionProps {
  onGraftClick: () => void;
  onHowItFeedsClick: () => void;
  onSelectSpore: (symbol: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onGraftClick,
  onHowItFeedsClick,
  onSelectSpore,
}) => {
  const [activeHabitat, setActiveHabitat] = useState<'meadow' | 'deep-mycelium'>('meadow');

  return (
    <section className="w-full grid grid-cols-1 lg:grid-cols-12 gap-5 mb-8 items-start">
      {/* Left Hero Dossier */}
      <div className="lg:col-span-6 bg-[#ffffff] border-2 border-[#1f182a] p-5 sm:p-6 shadow-[6px_6px_0px_#1f182a] relative">
        {/* Decorative corner nodes */}
        <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-[#b60059] border border-[#1f182a]"></div>
        <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-[#5affa3] border border-[#1f182a]"></div>
        <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-[#7658f8] border border-[#1f182a]"></div>
        <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-[#352d40] border border-[#1f182a]"></div>

        <div className="inline-flex items-center gap-2 bg-[#eadef7] border border-[#1f182a] px-2.5 py-1 font-mono text-[9px] sm:text-[10px] uppercase mb-4 text-[#5a3f46]">
          <span className="w-2 h-2 bg-[#b60059] inline-block"></span>
          SPECIMEN #042 // SPECIES: SYMBIONT (HYPHA-BURNING MYCELIUM)
        </div>

        <div className="flex items-center gap-3 mb-3">
          <PixelMushroomLogo size={42} />
          <h1 className="font-['Space_Grotesk'] text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#1f182a] uppercase tracking-tight leading-none drop-shadow-[2px_2px_0px_#ffd9e1]">
            Symbiont
          </h1>
        </div>

        <p className="font-['Space_Mono'] text-sm sm:text-[15px] text-[#5a3f46] mb-5 border-l-4 border-[#b60059] pl-3 leading-relaxed">
          Tokens bonded directly to their hosts. Every speculative bloom feeds the parent tree
          through continuous auto-incineration and direct fee absorption.
        </p>

        {/* Metrics Box */}
        <div className="grid grid-cols-2 gap-3 bg-[#faf0ff] border border-[#1f182a] p-3 mb-6">
          <div className="bg-[#ffffff] p-2.5 border border-[#1f182a]">
            <span className="block font-mono text-[9px] text-[#5a3f46] uppercase font-bold">
              Ecosystem Topology
            </span>
            <span className="font-['Space_Grotesk'] text-lg sm:text-xl font-bold text-[#b60059] leading-tight">
              Parasitic
            </span>
          </div>
          <div className="bg-[#ffffff] p-2.5 border border-[#1f182a]">
            <span className="block font-mono text-[9px] text-[#5a3f46] uppercase font-bold">
              Burn Efficiency
            </span>
            <span className="font-['Space_Grotesk'] text-lg sm:text-xl font-bold text-[#006d3d] leading-tight">
              50.0% Realtime
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              sound.playGraft();
              onGraftClick();
            }}
            className="bg-[#df1871] text-[#fffbff] px-5 py-2.5 font-mono text-xs sm:text-[13px] font-bold uppercase border-2 border-[#1f182a] shadow-[4px_4px_0px_#1f182a] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none transition-none flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">biotech</span>
            Graft a Host
          </button>
          <button
            onClick={() => {
              sound.playBip(600);
              onHowItFeedsClick();
            }}
            className="bg-[#ffffff] text-[#1f182a] px-5 py-2.5 font-mono text-xs sm:text-[13px] font-bold uppercase border-2 border-[#1f182a] shadow-[3px_3px_0px_#1f182a] hover:bg-[#f0e3fd] active:translate-x-1 active:translate-y-1 active:shadow-none transition-none flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">psychology_alt</span>
            How it Feeds
          </button>
          <a
            href={SOCIAL_LINKS.pumpfun}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#5affa3] text-[#004724] hover:bg-[#1f182a] hover:text-[#5affa3] px-3.5 py-2.5 font-mono text-xs font-bold uppercase border-2 border-[#1f182a] shadow-[3px_3px_0px_#1f182a] transition-none flex items-center gap-1.5"
            title="Pump.fun Bonding Curve"
          >
            <span>💊 Pump.fun</span>
            <span className="material-symbols-outlined text-[14px]">open_in_new</span>
          </a>
        </div>
      </div>

      {/* Right Hero Visual Chamber */}
      <div className="lg:col-span-6 bg-[#eadef7] border-2 border-[#1f182a] p-3 shadow-[6px_6px_0px_#1f182a] relative">
        <div className="bg-[#352d40] text-[#f7edff] px-3 py-1 font-mono text-[10px] border-b border-[#1f182a] flex justify-between items-center mb-1.5">
          <span className="flex items-center gap-1.5 font-bold">
            <span className="w-2 h-2 bg-[#5affa3] inline-block"></span>
            BIO-CHAMBER 01: [MEADOW HABITAT]
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[#5affa3] font-bold hidden sm:inline">16-BIT SPECIMEN FEED</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#5affa3] animate-ping"></span>
          </div>
        </div>

        {/* Viewport Frame */}
        <div className="relative w-full aspect-video border-2 border-[#1f182a] overflow-hidden bg-[#f5eaff] select-none">
          <img
            alt="16-bit retro alien meadow filled with luminous pink mushrooms and cyber biological spores"
            className="w-full h-full object-cover pixelated"
            src={MEADOW_IMAGE_URL}
          />

          {/* Overlay Specimen Spore Badges - Positioned cleanly below top logo & text level */}
          <div
            onClick={() => {
              sound.playBip(950);
              onSelectSpore('$SPORE');
            }}
            className="absolute bottom-9 left-1 bg-[#ffffff] border-2 border-[#1f182a] px-2.5 py-1 shadow-[2px_2px_0px_#1f182a] font-mono text-[9px] sm:text-[10px] uppercase flex items-center gap-1.5 cursor-pointer hover:bg-[#ffd9e1] z-10"
            title="Click to view $SPORE"
          >
            <span className="w-2 h-2 rounded-full bg-[#b60059] inline-block animate-ping"></span>
            <span className="font-bold text-[#b60059]">$SPORE</span>
            <span className="text-[#006d3d] font-bold">+22.8%</span>
          </div>

          <div
            onClick={() => {
              sound.playBurn();
              onSelectSpore('$HYPHA');
            }}
            className="absolute top-9 right-1 bg-[#ffffff] border-2 border-[#1f182a] px-2 py-0.5 shadow-[2px_2px_0px_#1f182a] font-mono text-[9px] sm:text-[10px] uppercase flex items-center gap-1.5 cursor-pointer hover:bg-[#ffd9e1]"
            title="Burning Mycelium"
          >
            <span className="w-2 h-2 rounded-full bg-[#5affa3] inline-block"></span>
            <span className="font-bold text-[#006d3d]">$HYPHA</span>
            <span className="text-[#006d3d] font-bold">BURNING</span>
          </div>

          <div
            onClick={() => {
              sound.playBip(700);
              onSelectSpore('$MYCO');
            }}
            className="absolute top-1/2 left-1 bg-[#ffffff] border-2 border-[#1f182a] px-2 py-0.5 shadow-[2px_2px_0px_#1f182a] font-mono text-[9px] sm:text-[10px] uppercase flex items-center gap-1.5 cursor-pointer hover:bg-[#f0e3fd]"
            title="Host: $CASHCAT"
          >
            <span className="w-2 h-2 bg-[#7658f8] inline-block"></span>
            <span className="font-bold text-[#5d3ade]">$MYCO</span>
            <span className="text-[#5a3f46]">HOST: $CASHCAT</span>
          </div>

          <div
            onClick={() => {
              sound.playGraft();
              onSelectSpore('$BLOOM');
            }}
            className="absolute bottom-24 right-1 bg-[#ffffff] border-2 border-[#1f182a] px-2 py-0.5 shadow-[2px_2px_0px_#1f182a] font-mono text-[9px] sm:text-[10px] uppercase flex items-center gap-1.5 cursor-pointer hover:bg-[#ffd9e1]"
            title="Specimen Live"
          >
            <span className="w-2 h-2 rounded-full bg-[#006d3d] inline-block animate-pulse"></span>
            <span className="font-bold text-[#1f182a]">$BLOOM</span>
            <span className="text-[#df1871] font-bold">LIVE</span>
          </div>
        </div>

        {/* Micro readout strip */}
        <div className="mt-2 grid grid-cols-3 gap-2 font-mono text-[9px] sm:text-[10px] text-center">
          <div className="bg-[#ffffff] border border-[#1f182a] py-1 px-1">
            <span className="text-[#5a3f46] block">O2 SATURATION</span>
            <span className="font-bold text-[#b60059]">98.2%</span>
          </div>
          <div className="bg-[#ffffff] border border-[#1f182a] py-1 px-1">
            <span className="text-[#5a3f46] block">SPORE HARVEST</span>
            <span className="font-bold text-[#006d3d]">3,412.0 G/S</span>
          </div>
          <div className="bg-[#ffffff] border border-[#1f182a] py-1 px-1">
            <span className="text-[#5a3f46] block">GROWTH INDEX</span>
            <span className="font-bold text-[#5d3ade]">x1.618</span>
          </div>
        </div>
      </div>
    </section>
  );
};
