import React, { useState } from 'react';
import { sound } from '../utils/audio';
import { PROTOCOL_CA, PROTOCOL_CA_SHORT, SOCIAL_LINKS } from '../constants/links';
import { PixelMushroomLogo } from './PixelMushroomLogo';

interface FooterProps {
  onOpenDocs: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenDocs }) => {
  const [copied, setCopied] = useState(false);
  const caText = PROTOCOL_CA;

  const handleCopy = () => {
    sound.playBip(1000);
    navigator.clipboard?.writeText(caText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer className="w-full bg-[#352d40] border-t-2 border-[#1f182a] text-[#f7edff] font-mono text-xs">
      <div className="max-w-[1140px] mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left Side Status */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <PixelMushroomLogo size={24} />
            <div className="flex items-center gap-1.5 text-[#5affa3] bg-[#1f182a]/40 px-2 py-0.5 border border-[#1f182a] text-[10px] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#5affa3] inline-block animate-ping"></span>
              <span>COLONY ONLINE</span>
            </div>
          </div>
          <div className="flex items-center bg-[#ffffff] text-[#1f182a] px-2 py-0.5 border border-[#1f182a] text-[10px]">
            <span className="text-[#5a3f46] mr-1.5 font-bold">CA:</span>
            <span className="font-bold">{PROTOCOL_CA_SHORT}</span>
            <button
              onClick={handleCopy}
              className="ml-2 bg-[#1f182a] text-[#ffffff] px-1.5 py-0.2 hover:bg-[#b60059] transition-none uppercase font-bold text-[9px] cursor-pointer"
            >
              {copied ? 'COPIED' : 'COPY'}
            </button>
          </div>
        </div>

        {/* Links */}
        <nav className="flex items-center flex-wrap gap-4 text-[11px] uppercase tracking-wider text-[#eadef7] font-bold">
          <button
            onClick={onOpenDocs}
            className="hover:text-[#ffd9e1] transition-none cursor-pointer"
          >
            Docs
          </button>
          <a
            href={SOCIAL_LINKS.x}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#5affa3] transition-none flex items-center gap-1"
          >
            <span>𝕏 Twitter</span>
          </a>
          <a
            href={SOCIAL_LINKS.pumpfun}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#5affa3] hover:text-white transition-none flex items-center gap-1 font-bold"
          >
            <span>💊 Pump.fun</span>
          </a>
        </nav>
      </div>

      <div className="border-t border-[#1f182a]/40 max-w-[1140px] mx-auto px-4 py-2 flex flex-col sm:flex-row justify-between items-center text-[#e2bdc5] text-[9px] sm:text-[10px] gap-1">
        <span>ESOTERIC CYBER-BIOLOGICAL PROTOCOL // SOLANA PROGRAM V2.4.0</span>
        <span>SYSTEM LOG ID: #009384-OX</span>
      </div>
    </footer>
  );
};
