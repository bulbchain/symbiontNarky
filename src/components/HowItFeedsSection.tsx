import React, { useState } from 'react';
import { sound } from '../utils/audio';

interface TokenDetail {
  symbol: string;
  name: string;
  contractAddress: string;
}

const DEFAULT_SPECIMEN_TOKENS: TokenDetail[] = [
  { symbol: '$SPORE', name: 'Symbiont Prime', contractAddress: 'SYMB10NTxK298vPuMp9vP12kQzCa6xjnB7YaB1pPB97q4' },
  { symbol: '$MYCO', name: 'Mycelium Core', contractAddress: 'MYC0rT1kL98vPuMp9vP12kQzCa6xjnB7YaB1pPB89x' },
  { symbol: '$HYPHA', name: 'Hypha Fungal Spore', contractAddress: 'HYPH4b3Etp7vPuMp9vP12kQzCa6xjnB7YaB1pPB62q' },
  { symbol: '$BLOOM', name: 'Sporocarp Bloom', contractAddress: 'BL00M74nLx2vPuMp9vP12kQzCa6xjnB7YaB1pPB51w' },
];

const DEFAULT_HOST_SOILS: TokenDetail[] = [
  { symbol: '$CASHCAT', name: 'CashCat AI Inoculation', contractAddress: 'CA5HCaT1KzL98vPuMp9vP12kQzCa6xjnB7YaB1pPB97q' },
  { symbol: '$STONK', name: 'Stonk Cat Reservoir', contractAddress: 'SToNKCaTEKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYx' },
  { symbol: '$PIPPIN', name: 'Pippin Autonomous AI', contractAddress: 'Dfh5DzRgSvvCFDoYc2ciTkMrbDfRKybA4So2gDEwpump' },
  { symbol: '$POPCAT', name: 'Popcat Colonized', contractAddress: '7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYpump' },
];

export const HowItFeedsSection: React.FC = () => {
  const [tradeVolume, setTradeVolume] = useState<number>(1000000);
  
  // Specimen tokens state
  const [specimenTokens, setSpecimenTokens] = useState<TokenDetail[]>(DEFAULT_SPECIMEN_TOKENS);
  const [activeSpecimen, setActiveSpecimen] = useState<TokenDetail>(DEFAULT_SPECIMEN_TOKENS[0]);
  const [isAddingCustomSpecimen, setIsAddingCustomSpecimen] = useState<boolean>(false);
  const [customSpecimenSymbol, setCustomSpecimenSymbol] = useState<string>('');
  const [customSpecimenName, setCustomSpecimenName] = useState<string>('');
  const [customSpecimenCA, setCustomSpecimenCA] = useState<string>('');

  // Host soil tokens state
  const [hostTokens, setHostTokens] = useState<TokenDetail[]>(DEFAULT_HOST_SOILS);
  const [activeHost, setActiveHost] = useState<TokenDetail>(DEFAULT_HOST_SOILS[0]);
  const [isAddingCustomHost, setIsAddingCustomHost] = useState<boolean>(false);
  const [customHostSymbol, setCustomHostSymbol] = useState<string>('');
  const [customHostName, setCustomHostName] = useState<string>('');
  const [customHostCA, setCustomHostCA] = useState<string>('');

  const [activeCellHover, setActiveCellHover] = useState<string | null>(null);

  const userToken = activeSpecimen.symbol;
  const selectedHost = activeHost.symbol;

  const totalFee = tradeVolume * 0.01;
  const hostBurned = totalFee * 0.50;
  const graftRoyalty = totalFee * 0.30;
  const daoGrowth = totalFee * 0.20;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setTradeVolume(val);
    if (val % 500000 === 0) {
      sound.playBip(600 + (val / 1000000) * 100);
    }
  };

  const handleAddCustomSpecimen = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!customSpecimenSymbol.trim()) return;

    let symbol = customSpecimenSymbol.trim().toUpperCase();
    if (!symbol.startsWith('$')) symbol = '$' + symbol;

    const name = customSpecimenName.trim() || `${symbol.slice(1)} Specimen`;
    const ca = customSpecimenCA.trim() || `${symbol.slice(1)}7x...pump`;

    const newDetail: TokenDetail = {
      symbol,
      name,
      contractAddress: ca,
    };

    setSpecimenTokens(prev => {
      const filtered = prev.filter(t => t.symbol !== symbol);
      return [...filtered, newDetail];
    });
    setActiveSpecimen(newDetail);
    setCustomSpecimenSymbol('');
    setCustomSpecimenName('');
    setCustomSpecimenCA('');
    setIsAddingCustomSpecimen(false);
    sound.playGraft();
  };

  const handleAddCustomHost = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!customHostSymbol.trim()) return;

    let symbol = customHostSymbol.trim().toUpperCase();
    if (!symbol.startsWith('$')) symbol = '$' + symbol;

    const name = customHostName.trim() || `${symbol.slice(1)} Host Soil`;
    const ca = customHostCA.trim() || `${symbol.slice(1)}8v...soil`;

    const newDetail: TokenDetail = {
      symbol,
      name,
      contractAddress: ca,
    };

    setHostTokens(prev => {
      const filtered = prev.filter(t => t.symbol !== symbol);
      return [...filtered, newDetail];
    });
    setActiveHost(newDetail);
    setCustomHostSymbol('');
    setCustomHostName('');
    setCustomHostCA('');
    setIsAddingCustomHost(false);
    sound.playGraft();
  };

  return (
    <section className="w-full mb-8" id="how-it-feeds">
      {/* Explainer Header */}
      <div className="border-2 border-[#1f182a] bg-[#faf0ff] p-4 sm:p-5 shadow-[4px_4px_0px_#1f182a] mb-5 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <span className="font-mono text-[9px] sm:text-[10px] bg-[#b60059] text-[#ffffff] px-2 py-0.5 border border-[#1f182a] uppercase font-bold">
            Metabolic Anatomy
          </span>
          <h2 className="font-['Space_Grotesk'] text-2xl sm:text-[26px] font-bold uppercase text-[#1f182a] mt-1.5 leading-none">
            How a Symbiont Feeds
          </h2>
          <p className="font-['Space_Mono'] text-xs sm:text-sm text-[#5a3f46] mt-1">
            One token thrives in another&apos;s soil. Three stages of the mycorrhizal network.
          </p>
        </div>
        <div className="flex items-center gap-2 font-mono text-[10px] sm:text-[11px] bg-[#ffffff] border border-[#1f182a] px-3 py-1.5 self-start md:self-auto">
          <span className="w-2.5 h-2.5 rounded-full bg-[#5affa3] animate-pulse"></span>
          <span className="font-bold">DEX AUTO-COMPOUND ENGINE // MAINNET ON</span>
        </div>
      </div>

      {/* 3 Step Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Step 1 */}
        <div className="bg-[#ffffff] border-2 border-[#1f182a] p-4 sm:p-5 shadow-[4px_4px_0px_#1f182a] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b-2 border-[#1f182a] pb-2 mb-3">
              <span className="font-mono text-xs text-[#b60059] font-bold">PHASE 01</span>
              <span className="font-mono text-[9px] bg-[#f0e3fd] border border-[#1f182a] px-1.5 py-0.5 font-bold">
                ROOTING
              </span>
            </div>
            <h3 className="font-['Space_Grotesk'] text-base sm:text-lg font-bold uppercase text-[#1f182a] mb-2 leading-tight">
              Priced in the Host Pool
            </h3>
            <p className="font-mono text-[11px] sm:text-xs text-[#5a3f46] mb-3 leading-relaxed">
              Every Symbiont token has no direct SOL valuation; its custom bonding curve trades
              exclusively inside its target host’s token pool. For instance,{' '}
              <strong className="text-[#b60059]">{userToken}</strong> trades directly against{' '}
              <strong className="text-[#006d3d]">{selectedHost}</strong> reserves.
            </p>

            {/* User Custom Token & Host Switcher */}
            <div className="bg-[#faf0ff] border border-[#1f182a] p-3 mb-3 flex flex-col gap-3 font-mono text-[10px]">
              
              {/* 1. Specimen Token Section */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-[#b60059] uppercase">1. Specimen Token</span>
                    <span className="text-[9px] bg-[#f0e3fd] px-1 text-[#1f182a] border border-[#1f182a]/30">
                      {activeSpecimen.name}
                    </span>
                  </div>
                  {!isAddingCustomSpecimen ? (
                    <button
                      onClick={() => {
                        sound.playBip(700);
                        setIsAddingCustomSpecimen(true);
                      }}
                      className="text-[#df1871] hover:underline font-bold cursor-pointer flex items-center gap-0.5"
                    >
                      <span>+ Custom Token</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsAddingCustomSpecimen(false)}
                      className="text-[#5a3f46] hover:underline cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                </div>

                {/* Custom Specimen Input Form */}
                {isAddingCustomSpecimen ? (
                  <form
                    onSubmit={handleAddCustomSpecimen}
                    className="bg-white p-2.5 border-2 border-[#1f182a] flex flex-col gap-2 shadow-[2px_2px_0px_#1f182a]"
                  >
                    <div className="flex items-center justify-between border-b border-[#1f182a]/20 pb-1">
                      <span className="font-bold uppercase text-[#1f182a]">
                        Add Custom Specimen Token
                      </span>
                      <span className="text-[8px] text-[#b60059] font-bold">SOLANA MINT</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="text-[9px] text-[#5a3f46] block uppercase font-bold mb-0.5">
                          Token Ticker / Symbol:
                        </label>
                        <input
                          type="text"
                          required
                          value={customSpecimenSymbol}
                          onChange={e => setCustomSpecimenSymbol(e.target.value)}
                          placeholder="$MY-SPORE"
                          maxLength={12}
                          className="w-full bg-[#faf0ff] border border-[#1f182a] px-2 py-1 text-xs font-bold uppercase text-[#1f182a] focus:outline-none focus:border-[#df1871]"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-[#5a3f46] block uppercase font-bold mb-0.5">
                          Token Name:
                        </label>
                        <input
                          type="text"
                          value={customSpecimenName}
                          onChange={e => setCustomSpecimenName(e.target.value)}
                          placeholder="e.g. Mycelium Fungal"
                          maxLength={24}
                          className="w-full bg-[#faf0ff] border border-[#1f182a] px-2 py-1 text-xs text-[#1f182a] focus:outline-none focus:border-[#df1871]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[9px] text-[#5a3f46] block uppercase font-bold mb-0.5">
                        Contract Address (Mint CA):
                      </label>
                      <input
                        type="text"
                        value={customSpecimenCA}
                        onChange={e => setCustomSpecimenCA(e.target.value)}
                        placeholder="e.g. SYMB10NTxK298vPuMp9vP12kQzCa6xjnB7YaB1pPB97q4"
                        className="w-full bg-[#faf0ff] border border-[#1f182a] px-2 py-1 text-[10px] font-mono text-[#1f182a] focus:outline-none focus:border-[#df1871]"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1 border-t border-[#1f182a]/20">
                      <button
                        type="button"
                        onClick={() => setIsAddingCustomSpecimen(false)}
                        className="px-2 py-1 text-[9px] font-bold uppercase hover:bg-gray-100 border border-transparent cursor-pointer text-[#5a3f46]"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-[#df1871] hover:bg-[#b60059] text-white px-3 py-1 font-bold text-[10px] uppercase border border-[#1f182a] cursor-pointer shadow-[1px_1px_0px_#1f182a]"
                      >
                        Add &amp; Inoculate Token
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex flex-wrap items-center gap-1.5">
                    {specimenTokens.map(tok => {
                      const isSelected = activeSpecimen.symbol === tok.symbol;
                      return (
                        <button
                          key={tok.symbol}
                          type="button"
                          onClick={() => {
                            sound.playBip(700);
                            setActiveSpecimen(tok);
                          }}
                          className={`px-2 py-1 border border-[#1f182a] font-bold text-[9px] uppercase cursor-pointer transition-none flex items-center gap-1 ${
                            isSelected
                              ? 'bg-[#df1871] text-white shadow-[2px_2px_0px_#1f182a]'
                              : 'bg-white text-[#1f182a] hover:bg-[#f0e3fd]'
                          }`}
                          title={`${tok.name} (${tok.contractAddress})`}
                        >
                          <span>{tok.symbol}</span>
                          {tok.contractAddress && (
                            <span className={`text-[8px] font-mono ${isSelected ? 'text-white/80' : 'text-[#5a3f46]'}`}>
                              ({tok.contractAddress.slice(0, 3)}...{tok.contractAddress.slice(-3)})
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Active Specimen CA preview */}
                <div className="text-[9px] text-[#5a3f46] flex items-center gap-1 truncate font-mono">
                  <span className="font-bold text-[#1f182a]">Active Mint:</span>
                  <span className="truncate bg-white px-1.5 py-0.5 border border-[#1f182a]/30">
                    {activeSpecimen.contractAddress}
                  </span>
                </div>
              </div>

              {/* 2. Bonded Host Soil Section */}
              <div className="pt-2 border-t-2 border-[#1f182a]/20 flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-[#006d3d] uppercase">2. Bonded Host Soil</span>
                    <span className="text-[9px] bg-[#50fd9f]/30 px-1 text-[#007240] border border-[#1f182a]/30 font-bold">
                      {activeHost.name}
                    </span>
                  </div>
                  {!isAddingCustomHost ? (
                    <button
                      onClick={() => {
                        sound.playBip(750);
                        setIsAddingCustomHost(true);
                      }}
                      className="text-[#006d3d] hover:underline font-bold cursor-pointer flex items-center gap-0.5"
                    >
                      <span>+ Custom Host Token</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsAddingCustomHost(false)}
                      className="text-[#5a3f46] hover:underline cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                </div>

                {/* Custom Host Input Form */}
                {isAddingCustomHost ? (
                  <form
                    onSubmit={handleAddCustomHost}
                    className="bg-white p-2.5 border-2 border-[#1f182a] flex flex-col gap-2 shadow-[2px_2px_0px_#1f182a]"
                  >
                    <div className="flex items-center justify-between border-b border-[#1f182a]/20 pb-1">
                      <span className="font-bold uppercase text-[#1f182a]">
                        Add Custom Host Soil Token
                      </span>
                      <span className="text-[8px] text-[#006d3d] font-bold">HOST RESERVOIR</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="text-[9px] text-[#5a3f46] block uppercase font-bold mb-0.5">
                          Host Ticker / Symbol:
                        </label>
                        <input
                          type="text"
                          required
                          value={customHostSymbol}
                          onChange={e => setCustomHostSymbol(e.target.value)}
                          placeholder="$MY-HOST"
                          maxLength={12}
                          className="w-full bg-[#f4fff9] border border-[#1f182a] px-2 py-1 text-xs font-bold uppercase text-[#1f182a] focus:outline-none focus:border-[#006d3d]"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-[#5a3f46] block uppercase font-bold mb-0.5">
                          Host Token Name:
                        </label>
                        <input
                          type="text"
                          value={customHostName}
                          onChange={e => setCustomHostName(e.target.value)}
                          placeholder="e.g. Host Reserve AI"
                          maxLength={24}
                          className="w-full bg-[#f4fff9] border border-[#1f182a] px-2 py-1 text-xs text-[#1f182a] focus:outline-none focus:border-[#006d3d]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[9px] text-[#5a3f46] block uppercase font-bold mb-0.5">
                        Host Contract Address (Mint CA):
                      </label>
                      <input
                        type="text"
                        value={customHostCA}
                        onChange={e => setCustomHostCA(e.target.value)}
                        placeholder="e.g. CA5HCaT1KzL98vPuMp9vP12kQzCa6xjnB7YaB1pPB97q"
                        className="w-full bg-[#f4fff9] border border-[#1f182a] px-2 py-1 text-[10px] font-mono text-[#1f182a] focus:outline-none focus:border-[#006d3d]"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1 border-t border-[#1f182a]/20">
                      <button
                        type="button"
                        onClick={() => setIsAddingCustomHost(false)}
                        className="px-2 py-1 text-[9px] font-bold uppercase hover:bg-gray-100 border border-transparent cursor-pointer text-[#5a3f46]"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-[#006d3d] hover:bg-[#00542e] text-white px-3 py-1 font-bold text-[10px] uppercase border border-[#1f182a] cursor-pointer shadow-[1px_1px_0px_#1f182a]"
                      >
                        Add &amp; Bind Host Soil
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex flex-wrap items-center gap-1.5">
                    {hostTokens.map(host => {
                      const isSelected = activeHost.symbol === host.symbol;
                      return (
                        <button
                          key={host.symbol}
                          type="button"
                          onClick={() => {
                            sound.playBip(750);
                            setActiveHost(host);
                          }}
                          className={`px-2 py-1 border border-[#1f182a] font-bold text-[9px] uppercase cursor-pointer transition-none flex items-center gap-1 ${
                            isSelected
                              ? 'bg-[#006d3d] text-white shadow-[2px_2px_0px_#1f182a]'
                              : 'bg-white text-[#1f182a] hover:bg-[#f0e3fd]'
                          }`}
                          title={`${host.name} (${host.contractAddress})`}
                        >
                          <span>{host.symbol}</span>
                          {host.contractAddress && (
                            <span className={`text-[8px] font-mono ${isSelected ? 'text-white/80' : 'text-[#5a3f46]'}`}>
                              ({host.contractAddress.slice(0, 3)}...{host.contractAddress.slice(-3)})
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Active Host CA preview */}
                <div className="text-[9px] text-[#5a3f46] flex items-center gap-1 truncate font-mono">
                  <span className="font-bold text-[#1f182a]">Host Soil Mint:</span>
                  <span className="truncate bg-white px-1.5 py-0.5 border border-[#1f182a]/30">
                    {activeHost.contractAddress}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#f0e3fd] p-2.5 border-2 border-[#1f182a] font-mono text-xs text-center font-bold shadow-[2px_2px_0px_#1f182a] flex flex-col gap-1">
            <span className="text-[#5a3f46] text-[10px] block uppercase">
              Active Host Token Pool Formulation:
            </span>
            <div className="text-[#1f182a] text-sm flex items-center justify-center gap-1.5 flex-wrap">
              <span>POOL:</span>
              <span className="bg-white px-2 py-0.5 border border-[#1f182a] text-[#df1871]">
                {activeSpecimen.symbol}
              </span>
              <span>/</span>
              <span className="bg-white px-2 py-0.5 border border-[#1f182a] text-[#006d3d]">
                {activeHost.symbol}
              </span>
            </div>
            <div className="text-[9px] text-[#5a3f46] flex items-center justify-center gap-2 flex-wrap font-normal">
              <span>CA: {activeSpecimen.contractAddress.slice(0, 6)}...{activeSpecimen.contractAddress.slice(-4)}</span>
              <span>↔</span>
              <span>CA: {activeHost.contractAddress.slice(0, 6)}...{activeHost.contractAddress.slice(-4)}</span>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-[#ffffff] border-2 border-[#1f182a] p-4 sm:p-5 shadow-[4px_4px_0px_#1f182a] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b-2 border-[#1f182a] pb-2 mb-3">
              <span className="font-mono text-xs text-[#006d3d] font-bold">PHASE 02</span>
              <span className="font-mono text-[9px] bg-[#50fd9f] text-[#007240] border border-[#1f182a] px-1.5 py-0.5 font-bold uppercase">
                FEEDING &amp; HARVEST
              </span>
            </div>
            <h3 className="font-['Space_Grotesk'] text-base sm:text-lg font-bold uppercase text-[#1f182a] mb-2 leading-tight">
              Every Trade Fertilizes
            </h3>
            <p className="font-mono text-[11px] sm:text-xs text-[#5a3f46] mb-3 leading-relaxed">
              Whenever trades take place on the <strong className="text-[#df1871]">{userToken}</strong> /{' '}
              <strong className="text-[#006d3d]">{selectedHost}</strong> liquidity pool, a hard-coded{' '}
              <strong>1.00% metabolic harvest fee</strong> is deducted at the program level without slippage manipulation.
            </p>
            <p className="font-mono text-[11px] sm:text-xs text-[#5a3f46] mb-3 leading-relaxed">
              Unlike traditional pump coins with extractable dev taxes, 100% of collected fees are immediately swapped
              into the parent host currency (<strong className="text-[#006d3d]">{selectedHost}</strong>), permanently
              nourishing host market cap, price resilience, and liquidity depth.
            </p>

            {/* Dynamic Step 2 Live Example Box */}
            <div className="bg-[#faf0ff] border border-[#1f182a] p-3 mb-3 flex flex-col gap-2 font-mono text-[10px]">
              <div className="flex items-center justify-between border-b border-[#1f182a]/20 pb-1">
                <span className="font-bold text-[#006d3d] uppercase">
                  Live Harvest Fee Mechanics (Example)
                </span>
                <span className="text-[9px] text-[#5a3f46]">On-Chain Swap</span>
              </div>
              <div className="flex flex-col gap-1.5 text-[#1f182a]">
                <div className="flex justify-between items-center bg-white p-1.5 border border-[#1f182a]/30">
                  <span className="text-[#5a3f46]">1. Trade Volume:</span>
                  <span className="font-bold">$10,000 swap in {userToken}</span>
                </div>
                <div className="flex justify-between items-center bg-white p-1.5 border border-[#1f182a]/30">
                  <span className="text-[#5a3f46]">2. Harvest Tax (1.00%):</span>
                  <span className="font-bold text-[#006d3d]">$100 fee intercepted</span>
                </div>
                <div className="flex justify-between items-center bg-white p-1.5 border border-[#1f182a]/30">
                  <span className="text-[#5a3f46]">3. Auto-Converted:</span>
                  <span className="font-bold text-[#1f182a]">Bought into {selectedHost}</span>
                </div>
              </div>
              <div className="text-[9px] text-[#5a3f46] pt-1 border-t border-[#1f182a]/20 leading-tight">
                💡 <span className="font-bold">Organic Bio-Feedback:</span> As trading intensity accelerates, the host
                token pool absorbs constant buy volume, rewarding long-term host holders while deepening symbiont roots.
              </div>
            </div>
          </div>

          <div className="bg-[#5affa3]/30 p-2.5 border-2 border-[#1f182a] font-mono text-xs text-center font-bold shadow-[2px_2px_0px_#1f182a] flex flex-col gap-1">
            <span className="text-[#006d3d] text-sm uppercase">1% HARVEST TAX APPLIED</span>
            <span className="text-[9px] text-[#5a3f46] font-normal">
              100% Routed to Host Reserves • 0% Hidden Team Retainers
            </span>
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-[#ffffff] border-2 border-[#1f182a] p-4 sm:p-5 shadow-[4px_4px_0px_#1f182a] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b-2 border-[#1f182a] pb-2 mb-3">
              <span className="font-mono text-xs text-[#df1871] font-bold">PHASE 03</span>
              <span className="font-mono text-[9px] bg-[#ffd9e1] text-[#b60059] border border-[#1f182a] px-1.5 py-0.5 font-bold uppercase">
                INCINERATION &amp; TRI-SPLIT
              </span>
            </div>
            <h3 className="font-['Space_Grotesk'] text-base sm:text-lg font-bold uppercase text-[#1f182a] mb-2 leading-tight">
              Supply Incineration &amp; Yield
            </h3>
            <p className="font-mono text-[11px] sm:text-xs text-[#5a3f46] mb-3 leading-relaxed">
              Once fees are converted into <strong className="text-[#006d3d]">{selectedHost}</strong>, the protocol
              executes an immutable <strong>50 / 30 / 20 tri-split distribution</strong> across three distinct biological destinations.
            </p>
            <p className="font-mono text-[11px] sm:text-xs text-[#5a3f46] mb-3 leading-relaxed">
              50% is dispatched to the provably dead incinerator address, permanently contracting circulating supply.
              30% routes directly to the graft botanist as passive royalty, and 20% feeds the collective DAO quorum.
            </p>

            {/* Dynamic Step 3 Live Tri-Split Breakdown */}
            <div className="bg-[#faf0ff] border border-[#1f182a] p-3 mb-3 flex flex-col gap-2 font-mono text-[10px]">
              <div className="flex items-center justify-between border-b border-[#1f182a]/20 pb-1">
                <span className="font-bold text-[#b60059] uppercase">
                  Tri-Split Routing Architecture
                </span>
                <span className="text-[9px] text-[#5a3f46]">On $100 Harvest</span>
              </div>
              <div className="flex flex-col gap-1.5 text-[#1f182a]">
                <div className="flex justify-between items-center bg-[#ffd9e1] p-1.5 border border-[#1f182a]/30">
                  <span className="text-[#8f0045] font-bold">🔥 50% Host Incineration:</span>
                  <span className="font-bold text-[#b60059]">$50 burned {selectedHost}</span>
                </div>
                <div className="flex justify-between items-center bg-[#e6deff] p-1.5 border border-[#1f182a]/30">
                  <span className="text-[#4719c9] font-bold">🌱 30% Graft Creator:</span>
                  <span className="font-bold text-[#5d3ade]">$30 {userToken} royalty</span>
                </div>
                <div className="flex justify-between items-center bg-[#e0fcf0] p-1.5 border border-[#1f182a]/30">
                  <span className="text-[#006d3d] font-bold">⚡ 20% Colony DAO:</span>
                  <span className="font-bold text-[#006d3d]">$20 LP migration</span>
                </div>
              </div>
              <div className="text-[9px] text-[#5a3f46] pt-1 border-t border-[#1f182a]/20 leading-tight">
                🔒 <span className="font-bold">Permanent Dead Address:</span> Burn transactions submit directly to{' '}
                <span className="font-mono text-[#b60059] font-bold">1nc1ner8t0rNuLL11111111111111111111111</span> with
                zero mint or clawback rights.
              </div>
            </div>
          </div>

          <div className="bg-[#ffd9e1] p-2.5 border-2 border-[#1f182a] font-mono text-xs text-center font-bold shadow-[2px_2px_0px_#1f182a] flex flex-col gap-1">
            <span className="text-[#b60059] text-sm uppercase">50% AUTO-BURN TRIGGER</span>
            <span className="text-[9px] text-[#5a3f46] font-normal">
              Deflationary Black Hole • Automatic Raydium LP Graduation
            </span>
          </div>
        </div>
      </div>

      {/* Dynamic Allocation Engine: 100-Cell Pixel Metabolic Breakdown */}
      <div className="bg-[#ffffff] border-2 border-[#1f182a] p-4 sm:p-6 shadow-[4px_4px_0px_#1f182a]">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b-2 border-[#1f182a] pb-3 mb-4 gap-3">
          <div>
            <span className="font-mono text-[10px] text-[#b60059] font-bold uppercase">
              Dynamic Allocation Engine
            </span>
            <h3 className="font-['Space_Grotesk'] text-lg sm:text-xl font-bold uppercase text-[#1f182a]">
              100-Cell Pixel Metabolic Breakdown
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[10px] font-bold text-[#5a3f46] uppercase">Active Soil:</span>
            {hostTokens.map(host => (
              <button
                key={host.symbol}
                onClick={() => {
                  sound.playBip(750);
                  setActiveHost(host);
                }}
                className={`px-2 py-0.5 font-mono text-[10px] font-bold uppercase border border-[#1f182a] cursor-pointer transition-none ${
                  selectedHost === host.symbol
                    ? 'bg-[#df1871] text-white shadow-[1px_1px_0px_#1f182a]'
                    : 'bg-[#faf0ff] text-[#1f182a] hover:bg-[#f0e3fd]'
                }`}
              >
                {host.symbol}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 font-mono text-[10px] sm:text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 bg-[#df1871] border border-[#1f182a] inline-block"></span>
              <span>Host Burned (50%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 bg-[#7658f8] border border-[#1f182a] inline-block"></span>
              <span>Graft Creator (30%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 bg-[#29e288] border border-[#1f182a] inline-block"></span>
              <span>Colony DAO (20%)</span>
            </div>
          </div>
        </div>

        {/* 100-Cell Interactive Pixel Grid */}
        <div className="p-2 sm:p-3 bg-[#f0e3fd] border-2 border-[#1f182a] mb-5">
          <div className="grid grid-cols-10 sm:grid-cols-20 gap-1 select-none">
            {/* 50 Host Burn Cells (Pink/Magenta) */}
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={`burn-${i}`}
                onMouseEnter={() => {
                  sound.playBip(800 + i * 5);
                  setActiveCellHover(`Host Burn Slot #${i + 1}: 50% harvested & routed directly to permanent ${selectedHost} token incineration address`);
                }}
                onMouseLeave={() => setActiveCellHover(null)}
                className="aspect-square bg-[#df1871] border border-[#1f182a]/40 hover:scale-125 hover:z-10 transition-transform cursor-pointer"
                title={`${selectedHost} Burn Cell #${i + 1}`}
              />
            ))}

            {/* 30 Creator Royalty Cells (Purple) */}
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={`creator-${i}`}
                onMouseEnter={() => {
                  sound.playBip(600 + i * 8);
                  setActiveCellHover(`Botanist Royalty Slot #${i + 1}: 30% perpetual yield to creator`);
                }}
                onMouseLeave={() => setActiveCellHover(null)}
                className="aspect-square bg-[#7658f8] border border-[#1f182a]/40 hover:scale-125 hover:z-10 transition-transform cursor-pointer"
                title={`Graft Creator Cell #${i + 1}`}
              />
            ))}

            {/* 20 Colony DAO Cells (Acid Green) */}
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={`dao-${i}`}
                onMouseEnter={() => {
                  sound.playBip(450 + i * 12);
                  setActiveCellHover(`Colony DAO Reserve #${i + 1}: 20% bolstering protocol graduation`);
                }}
                onMouseLeave={() => setActiveCellHover(null)}
                className="aspect-square bg-[#29e288] border border-[#1f182a]/40 hover:scale-125 hover:z-10 transition-transform cursor-pointer"
                title={`Colony DAO Cell #${i + 1}`}
              />
            ))}
          </div>

          <div className="mt-2 text-center font-mono text-[10px] text-[#5a3f46] h-4">
            {activeCellHover || 'Hover over any micro-cell to inspect metabolic routing destination.'}
          </div>
        </div>

        {/* Trade Simulator Slider Box */}
        <div className="bg-[#f5eaff] border border-[#1f182a] p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 font-mono">
            <label
              className="text-xs uppercase font-bold text-[#1f182a]"
              htmlFor="trade-slider"
            >
              Simulated Trade Volume:
            </label>
            <span
              className="text-xs bg-[#352d40] text-[#5affa3] px-2 py-0.5 border border-[#1f182a] self-start sm:self-auto font-bold"
              id="slider-val"
            >
              {tradeVolume.toLocaleString()} {userToken}
            </span>
          </div>

          <input
            id="trade-slider"
            type="range"
            min="100000"
            max="10000000"
            step="100000"
            value={tradeVolume}
            onChange={handleSliderChange}
            className="w-full h-2.5 bg-[#eadef7] border border-[#1f182a] rounded-none accent-[#df1871] cursor-pointer mb-3"
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-xs">
            <div className="bg-[#ffffff] p-2.5 border border-[#1f182a]">
              <span className="text-[#5a3f46] block text-[10px]">1.0% TOTAL FEE</span>
              <span className="font-bold text-[#1f182a] text-sm">
                {totalFee.toLocaleString()} {userToken}
              </span>
            </div>
            <div className="bg-[#ffd9e1] p-2.5 border border-[#1f182a]">
              <span className="text-[#8f0045] block text-[10px]">🔥 50% HOST INCINERATED</span>
              <span className="font-bold text-[#b60059] text-sm">
                {hostBurned.toLocaleString()} {selectedHost}
              </span>
            </div>
            <div className="bg-[#e6deff] p-2.5 border border-[#1f182a]">
              <span className="text-[#4719c9] block text-[10px]">🌱 30% GRAFT ROYALTY</span>
              <span className="font-bold text-[#5d3ade] text-sm">
                {graftRoyalty.toLocaleString()} {userToken}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
