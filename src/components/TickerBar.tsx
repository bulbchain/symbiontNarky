import React, { useState } from 'react';
import { sound } from '../utils/audio';
import { PROTOCOL_CA, PROTOCOL_CA_SHORT, SOCIAL_LINKS } from '../constants/links';
import { PixelMushroomLogo } from './PixelMushroomLogo';

export const TickerBar: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const contractAddress = PROTOCOL_CA;

  const copyCA = () => {
    sound.playBip(1000);
    navigator.clipboard?.writeText(contractAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full bg-[#352d40] text-[#f7edff] py-1.5 px-3 sm:px-4 border-2 border-[#1f182a] shadow-[4px_4px_0px_#1f182a] mb-6 overflow-hidden flex items-center justify-between">
      <div className="flex items-center gap-3 sm:gap-4 whitespace-nowrap overflow-x-auto select-none py-0.5 text-[10px] sm:text-[11px] font-mono">
        <div className="flex items-center gap-1.5 shrink-0">
          <PixelMushroomLogo size={20} />
          <span className="text-[#5affa3] font-bold">
            SPORES ACTIVE: 142
          </span>
        </div>
        <span className="text-[#e2bdc5]">::</span>
        <span className="text-[#fef7ff]">
          LIVE HOSTS: <strong className="text-[#ffd9e1]">18</strong>
        </span>
        <span className="text-[#e2bdc5]">::</span>
        <span className="text-[#f0e3fd]">
          HOST VALUE NURTURED: <strong className="text-[#5affa3]">4,829.4 SOL</strong>
        </span>
        <span className="text-[#e2bdc5]">::</span>
        <span className="text-[#ffd9e1]">
          AUTO-INCINERATED: <strong className="text-[#ffffff]">1,940 SOL</strong> (39.8%)
        </span>
        <span className="text-[#e2bdc5]">::</span>
        <div className="flex items-center bg-[#ffffff] text-[#1f182a] px-1.5 py-0.5 border border-[#1f182a] text-[9px] sm:text-[10px]">
          <span className="text-[#5a3f46] mr-1">CA:</span>
          <span className="font-bold">{PROTOCOL_CA_SHORT}</span>
          <button
            onClick={copyCA}
            className="ml-2 bg-[#b60059] text-[#ffffff] px-1.5 hover:bg-[#1f182a] transition-none uppercase active:translate-x-0.5 active:translate-y-0.5 cursor-pointer font-bold"
          >
            {copied ? 'COPIED!' : 'COPY'}
          </button>
        </div>
      </div>
      <div className="hidden lg:flex items-center gap-2 text-[10px] shrink-0 font-mono">
        <a
          href={SOCIAL_LINKS.pumpfun}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#5affa3] hover:underline font-bold flex items-center gap-1 bg-[#1f182a]/60 px-2 py-0.5 border border-[#1f182a]"
        >
          <span>💊 PUMP.FUN LIVE</span>
        </a>
      </div>
    </div>
  );
};
