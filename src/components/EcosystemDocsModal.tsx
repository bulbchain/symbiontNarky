import React from 'react';
import { sound } from '../utils/audio';
import { PROTOCOL_CA, SOCIAL_LINKS } from '../constants/links';

interface DocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EcosystemDocsModal: React.FC<DocsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#1f182a]/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 font-mono">
      <div className="bg-[#ffffff] border-2 border-[#1f182a] shadow-[6px_6px_0px_#1f182a] max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-[#352d40] text-[#f7edff] p-3 sm:p-4 border-b-2 border-[#1f182a] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#5affa3] text-[20px]">menu_book</span>
            <span className="font-['Space_Grotesk'] text-base sm:text-lg font-bold uppercase tracking-tight text-[#fef7ff]">
              Ecosystem Documentation // Protocol v2.4.0
            </span>
          </div>
          <button
            onClick={() => {
              sound.playBip(500);
              onClose();
            }}
            className="text-lg font-bold hover:text-[#df1871] cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-xs text-[#1f182a] leading-relaxed">
          <div>
            <span className="px-2 py-0.5 bg-[#df1871] text-white uppercase font-bold text-[9px] border border-[#1f182a]">
              01 // The Parasitic Paradigm
            </span>
            <h3 className="font-['Space_Grotesk'] text-lg font-bold uppercase text-[#1f182a] mt-1.5 mb-1">
              Mutualistic Cyber-Biological DeFi
            </h3>
            <p className="text-[#5a3f46]">
              Symbionts do not launch in native SOL pairs. Instead, every Symbiont token’s dynamic bonding curve pairs exclusively against an established Solana memetic host (e.g. $CASHCAT, $STONK, $PIPPIN, $POPCAT, and $BONK). This anchors specimen liquidity into the host soil while continually extracting nutrients.
            </p>
          </div>

          <div className="border-t border-[#1f182a]/20 pt-4">
            <span className="px-2 py-0.5 bg-[#006d3d] text-[#5affa3] uppercase font-bold text-[9px] border border-[#1f182a]">
              02 // Metabolic 1.00% Tax Engine
            </span>
            <h3 className="font-['Space_Grotesk'] text-lg font-bold uppercase text-[#1f182a] mt-1.5 mb-1">
              Every Trade Fertilizes
            </h3>
            <p className="text-[#5a3f46] mb-2">
              Every buy, sell, and transfer across Jupiter DEX and Meteora DBC incurs a fixed 1.00% harvest fee distributed automatically via on-chain CPI:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-[#5a3f46]">
              <li>
                <strong className="text-[#b60059]">50% Auto-Burn Trigger:</strong> Instantly swapped to the host token and dispatched to the permanent Solana burn address.
              </li>
              <li>
                <strong className="text-[#5d3ade]">30% Botanist Graft Royalty:</strong> Directly streamed to the specimen creator&apos;s Phantom wallet.
              </li>
              <li>
                <strong className="text-[#006d3d]">20% Colony DAO Reserve:</strong> Bolsters the liquidity reserve required to achieve automated Raydium CPMM graduation.
              </li>
            </ul>
          </div>

          <div className="border-t border-[#1f182a]/20 pt-4">
            <span className="px-2 py-0.5 bg-[#7658f8] text-white uppercase font-bold text-[9px] border border-[#1f182a]">
              03 // Keeper Consensus &amp; Incubation
            </span>
            <h3 className="font-['Space_Grotesk'] text-lg font-bold uppercase text-[#1f182a] mt-1.5 mb-1">
              Decentralized Oracle Inoculation
            </h3>
            <p className="text-[#5a3f46]">
              Before a new host token can be grafted, five independent Solana keeper nodes must verify Pyth/Switchboard price feeds, verify liquidity depth, and sign the consensus ring. Users can accelerate keeper warming by pledging 0.05 SOL in validator gas.
            </p>
          </div>

          <div className="bg-[#faf0ff] border-2 border-[#1f182a] p-3 text-[11px]">
            <span className="font-bold text-[#b60059] block mb-1">IMMUTABLE PROGRAM GUARANTEES:</span>
            <span>✓ No ruggable developer allocation (100% fair launch)</span><br />
            <span>✓ Irreversible on-chain burn verification via Solana CPI</span><br />
            <span>✓ Single-click Jupiter / Meteora DBC automated liquidity graduation</span>
          </div>

          <div className="border-t border-[#1f182a]/20 pt-4">
            <span className="px-2 py-0.5 bg-[#352d40] text-[#f7edff] uppercase font-bold text-[9px] border border-[#1f182a]">
              04 // Community &amp; Verified Program Address
            </span>
            <div className="mt-2 bg-[#f0e3fd] border border-[#1f182a] p-2.5 space-y-2 text-[11px]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-[#5a3f46] font-bold">Protocol CA:</span>
                <span className="font-mono font-bold text-[#1f182a] break-all select-all">{PROTOCOL_CA}</span>
              </div>
              <div className="flex flex-wrap gap-2 pt-1 border-t border-[#1f182a]/15 text-[10px] font-bold">
                <a
                  href={SOCIAL_LINKS.x}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 bg-white hover:bg-[#df1871] hover:text-white border border-[#1f182a] flex items-center gap-1"
                >
                  <span>𝕏 Twitter</span>
                </a>
                <a
                  href={SOCIAL_LINKS.pumpfun}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 bg-[#5affa3] text-[#004724] hover:bg-[#1f182a] hover:text-[#5affa3] border border-[#1f182a] flex items-center gap-1 font-bold"
                >
                  <span>💊 Pump.fun</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#f0e3fd] border-t-2 border-[#1f182a] flex justify-end">
          <button
            onClick={() => {
              sound.playBip(500);
              onClose();
            }}
            className="px-4 py-1.5 bg-[#df1871] text-white border-2 border-[#1f182a] font-mono text-xs uppercase font-bold shadow-[2px_2px_0px_#1f182a] cursor-pointer"
          >
            Close Documentation
          </button>
        </div>
      </div>
    </div>
  );
};
