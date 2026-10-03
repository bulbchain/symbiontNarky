import React, { useState } from 'react';
import { sound } from '../utils/audio';
import { CustomBridgeHost, FAMOUS_INTERMEDIATE_HOSTS } from '../types/bridge';

interface SwapRoutingSectionProps {
  onOpenSwap: (customHost?: string) => void;
  activeHost?: string;
  onSelectHost?: (hostSymbol: string) => void;
}

export const SwapRoutingSection: React.FC<SwapRoutingSectionProps> = ({
  onOpenSwap,
  activeHost,
  onSelectHost,
}) => {
  const [hosts, setHosts] = useState<CustomBridgeHost[]>(FAMOUS_INTERMEDIATE_HOSTS);
  const [selectedHostSymbol, setSelectedHostSymbol] = useState<string>(activeHost || '$CASHCAT');
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [isAddingToken, setIsAddingToken] = useState<boolean>(false);
  const [customSymbolInput, setCustomSymbolInput] = useState<string>('');
  const [customNameInput, setCustomNameInput] = useState<string>('');
  const [customMintInput, setCustomMintInput] = useState<string>('');
  const [customBurnRate, setCustomBurnRate] = useState<number>(50);

  const activeBridgeHost =
    hosts.find(h => h.symbol === selectedHostSymbol) || hosts[0];

  const categories = ['ALL', 'AI & CAT', 'AI & DOG', 'VIRAL SENSATIONS', 'OG RESERVOIRS', 'CUSTOM'];

  const filteredHosts =
    activeCategory === 'ALL'
      ? hosts
      : activeCategory === 'CUSTOM'
      ? hosts.filter(h => h.isCustom)
      : hosts.filter(h => h.category === activeCategory);

  const handleSelect = (symbol: string) => {
    sound.playBip(750);
    setSelectedHostSymbol(symbol);
    if (onSelectHost) onSelectHost(symbol);
  };

  const handleAddCustomToken = (e: React.FormEvent) => {
    e.preventDefault();
    let symbol = customSymbolInput.trim().toUpperCase();
    if (!symbol) return;
    if (!symbol.startsWith('$')) symbol = '$' + symbol;

    const name = customNameInput.trim() || `${symbol} Host Reservoir`;
    const mint =
      customMintInput.trim() ||
      `${symbol.replace('$', '')}M1nt` +
        Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

    const newHost: CustomBridgeHost = {
      symbol,
      name,
      mintAddress: mint,
      burnRatePercent: customBurnRate,
      isCustom: true,
      category: 'CUSTOM',
      tag: 'USER INSERTED',
    };

    sound.playGraft();
    setHosts(prev => {
      const filtered = prev.filter(h => h.symbol !== symbol);
      return [newHost, ...filtered];
    });

    setSelectedHostSymbol(symbol);
    if (onSelectHost) onSelectHost(symbol);

    setCustomSymbolInput('');
    setCustomNameInput('');
    setCustomMintInput('');
    setIsAddingToken(false);
  };

  return (
    <section className="w-full mb-8">
      <div className="bg-[#ffffff] border-2 border-[#1f182a] p-4 sm:p-5 shadow-[4px_4px_0px_#1f182a]">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-[#1f182a] pb-2.5 mb-3 gap-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#b60059] text-[20px]">hub</span>
            <span className="font-mono text-xs sm:text-sm uppercase font-bold text-[#1f182a]">
              Inter-Cellular Swap Chain Routing
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[10px] sm:text-[11px] bg-[#50fd9f] text-[#007240] px-2 py-0.5 font-bold border border-[#1f182a]">
              JUPITER DEX / METEORA DBC
            </span>
            <button
              onClick={() => {
                sound.playBip(800);
                setIsAddingToken(prev => !prev);
              }}
              className="font-mono text-[10px] sm:text-[11px] bg-[#f0e3fd] hover:bg-[#eadef7] text-[#1f182a] px-2.5 py-0.5 font-bold border border-[#1f182a] shadow-[2px_2px_0px_#1f182a] flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[14px]">
                {isAddingToken ? 'close' : 'add_circle'}
              </span>
              <span>{isAddingToken ? 'Cancel' : '+ Inoculate Any Token In-Between'}</span>
            </button>
            <button
              onClick={() => {
                sound.playSwap();
                onOpenSwap(selectedHostSymbol);
              }}
              className="font-mono text-[10px] sm:text-[11px] bg-[#df1871] text-[#fffbff] px-2.5 py-0.5 font-bold border border-[#1f182a] shadow-[2px_2px_0px_#1f182a] hover:bg-[#b60059] cursor-pointer"
            >
              Open Swap
            </button>
          </div>
        </div>

        {/* Famous & Recent Intermediate Token Selector */}
        <div className="mb-4 bg-[#faf0ff] border border-[#1f182a] p-2.5 sm:p-3 font-mono">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1f182a]/20 pb-2 mb-2">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] uppercase font-bold text-[#1f182a] flex items-center gap-1">
                <span className="text-[#df1871]">⚡</span> Intermediate Soil Reservoir (Famous &amp; Recent Hits):
              </span>
              <span className="text-[9px] bg-[#ffd9e1] text-[#b60059] px-1.5 py-0.2 font-bold border border-[#1f182a]">
                {hosts.length} Available
              </span>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1 flex-wrap">
              {categories.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    sound.playBip(650);
                    setActiveCategory(cat);
                  }}
                  className={`text-[9px] px-2 py-0.5 border border-[#1f182a] font-bold uppercase cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-[#1f182a] text-[#5affa3]'
                      : 'bg-white text-[#5a3f46] hover:bg-gray-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Tokens Grid */}
          <div className="flex flex-wrap gap-1.5">
            {filteredHosts.map(h => {
              const isSelected = selectedHostSymbol === h.symbol;
              return (
                <button
                  key={h.symbol}
                  type="button"
                  onClick={() => handleSelect(h.symbol)}
                  className={`px-2 py-1 border border-[#1f182a] text-[11px] font-bold uppercase transition-none cursor-pointer flex items-center gap-1.5 shadow-[1px_1px_0px_#1f182a] ${
                    isSelected
                      ? 'bg-[#df1871] text-white'
                      : 'bg-white text-[#1f182a] hover:bg-[#ffd9e1]'
                  }`}
                >
                  <span>{h.symbol}</span>
                  {h.tag && (
                    <span
                      className={`text-[8px] px-1 py-0.2 font-mono ${
                        isSelected
                          ? 'bg-[#1f182a] text-[#5affa3]'
                          : 'bg-[#f0e3fd] text-[#5a3f46]'
                      }`}
                    >
                      {h.tag}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-2.5 pt-2 border-t border-[#1f182a]/15 flex flex-col sm:flex-row sm:items-center justify-between text-[10px] text-[#5a3f46]">
            <span>
              Active In-Between Pipeline:{' '}
              <strong className="text-[#1f182a]">SOLANA (SOL)</strong> →{' '}
              <strong className="text-[#df1871] bg-white px-1.5 py-0.2 border border-[#1f182a]">
                {activeBridgeHost.symbol} ({activeBridgeHost.name})
              </strong>{' '}
              → <strong className="text-[#006d3d]">$SPORE TOKEN</strong>
            </span>
            <span className="text-[#b60059] font-bold mt-1 sm:mt-0">
              🔥 50% Programmatic Burn Triggered on {activeBridgeHost.symbol}
            </span>
          </div>
        </div>

        {/* Add Custom Intermediate Token Form */}
        {isAddingToken && (
          <form
            onSubmit={handleAddCustomToken}
            className="mb-4 bg-[#f0e3fd] border-2 border-[#1f182a] p-3 sm:p-4 shadow-[3px_3px_0px_#1f182a] font-mono"
          >
            <div className="flex items-center justify-between border-b border-[#1f182a]/30 pb-2 mb-3">
              <span className="text-xs font-bold uppercase text-[#1f182a] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#df1871] text-[16px]">add_link</span>
                Inoculate Any Custom Token In-Between Solana &amp; Spore
              </span>
              <span className="text-[9px] bg-white px-2 py-0.5 border border-[#1f182a] text-[#5a3f46]">
                SOLANA CPI ROUTABLE
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 mb-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase text-[#5a3f46] mb-1">
                  Token Symbol*
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. $FARTCOIN, $ZEREBRO"
                  value={customSymbolInput}
                  onChange={e => setCustomSymbolInput(e.target.value)}
                  className="w-full bg-white border border-[#1f182a] p-1.5 font-bold text-[#1f182a] uppercase focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-[#5a3f46] mb-1">
                  Reservoir Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Fartcoin Reservoir"
                  value={customNameInput}
                  onChange={e => setCustomNameInput(e.target.value)}
                  className="w-full bg-white border border-[#1f182a] p-1.5 text-[#1f182a] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-[#5a3f46] mb-1">
                  Solana Mint / CA Address (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 9BBW...pump"
                  value={customMintInput}
                  onChange={e => setCustomMintInput(e.target.value)}
                  className="w-full bg-white border border-[#1f182a] p-1.5 text-[#1f182a] font-mono text-[11px] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-[#5a3f46] mb-1">
                  Auto-Burn Rate ({customBurnRate}%)
                </label>
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="range"
                    min="10"
                    max="90"
                    step="5"
                    value={customBurnRate}
                    onChange={e => setCustomBurnRate(Number(e.target.value))}
                    className="w-full accent-[#df1871]"
                  />
                  <span className="font-bold text-[#df1871] text-xs min-w-[32px]">
                    {customBurnRate}%
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddingToken(false)}
                className="px-3 py-1 bg-white border border-[#1f182a] text-xs font-bold uppercase hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1 bg-[#df1871] hover:bg-[#b60059] text-white border border-[#1f182a] text-xs font-bold uppercase shadow-[2px_2px_0px_#1f182a] cursor-pointer"
              >
                Insert Between SOL &amp; $SPORE
              </button>
            </div>
          </form>
        )}

        {/* 3 Interlinked Nodes (Preserving the restored 3-node diagram layout) */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 py-2">
          {/* SOL Node */}
          <div className="w-full md:w-1/3 bg-[#f0e3fd] border-2 border-[#1f182a] p-3 text-center shadow-[2px_2px_0px_#1f182a]">
            <span className="font-mono text-[10px] text-[#5a3f46] uppercase block font-bold">
              Source Asset
            </span>
            <span className="font-['Space_Grotesk'] text-lg font-bold text-[#1f182a] block mt-0.5">
              SOLANA (SOL)
            </span>
            <span className="block font-mono text-[11px] text-[#5a3f46] mt-1">
              User&apos;s native balance
            </span>
          </div>

          <div className="shrink-0 flex items-center justify-center text-[#df1871]">
            <span className="material-symbols-outlined text-[28px] rotate-90 md:rotate-0">
              arrow_right_alt
            </span>
          </div>

          {/* Host Pool Node (Dynamic in-between token: famous recent or user inserted) */}
          <div className="w-full md:w-1/3 bg-[#ffd9e1] border-2 border-[#1f182a] p-3 text-center shadow-[2px_2px_0px_#1f182a] relative">
            <span className="absolute -top-2.5 right-2 bg-[#df1871] text-white border border-[#1f182a] px-1.5 py-0.2 text-[8px] font-mono font-bold">
              {activeBridgeHost.tag || 'INTERMEDIATE RESERVOIR'}
            </span>
            <span className="font-mono text-[10px] text-[#b60059] uppercase font-bold block">
              Host Soil Reservoir
            </span>
            <span className="font-['Space_Grotesk'] text-lg font-bold text-[#3f001a] block mt-0.5">
              {activeBridgeHost.symbol} POOL
            </span>
            <span className="block font-mono text-[11px] text-[#5a3f46] mt-1">
              1% Tax Ingested &amp; {activeBridgeHost.burnRatePercent}% Burned
            </span>
          </div>

          <div className="shrink-0 flex items-center justify-center text-[#006d3d]">
            <span className="material-symbols-outlined text-[28px] rotate-90 md:rotate-0">
              arrow_right_alt
            </span>
          </div>

          {/* Symbiont Node */}
          <div className="w-full md:w-1/3 bg-[#5affa3]/40 border-2 border-[#1f182a] p-3 text-center shadow-[2px_2px_0px_#1f182a]">
            <span className="font-mono text-[10px] text-[#006d3d] uppercase font-bold block">
              Terminal Specimen
            </span>
            <span className="font-['Space_Grotesk'] text-lg font-bold text-[#006d3d] block mt-0.5">
              $SPORE TOKEN
            </span>
            <span className="block font-mono text-[11px] text-[#5a3f46] mt-1">
              Direct wallet custody
            </span>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="mt-3 bg-[#352d40] text-[#f7edff] p-2.5 font-mono text-[10px] sm:text-[11px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5 border border-[#1f182a]">
          <span className="flex items-center gap-1.5">
            <span className="text-[#5affa3]">⚡</span>
            <span>
              Single-click route execution via Jupiter / Meteora DBC integration. Route: SOL →{' '}
              {activeBridgeHost.symbol} → $SPORE.
            </span>
          </span>
          <span className="text-[#5affa3] font-bold whitespace-nowrap self-end sm:self-auto">
            SLIPPAGE TOLERANCE: 1.5%
          </span>
        </div>
      </div>
    </section>
  );
};
