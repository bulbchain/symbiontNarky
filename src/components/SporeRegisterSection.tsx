import React, { useState, useMemo } from 'react';
import { HostSpecimen, IncubatingHost, SymbiontToken } from '../types';
import { sound } from '../utils/audio';
import { getPumpfunUrl } from '../constants/links';
import { SporeRarityBar } from './SporeRarityBar';
import { SporeVitalityBadge } from './SporeVitalityBadge';
import { SporeEvolvingSprite } from './SporeEvolvingSprite';
import { SporeEvolutionModal } from './SporeEvolutionModal';

interface SporeRegisterProps {
  hosts: HostSpecimen[];
  incubatingHosts: IncubatingHost[];
  isStandaloneView?: boolean;
  onGraftHost: (hostSymbol: string) => void;
  onQuickSwap: (sporeSymbol: string, hostSymbol: string) => void;
  onPledgeGas: (incubating: IncubatingHost) => void;
  onSimulateBurn?: (sporeId: string, additionalBurn: number) => void;
}

export const SporeRegisterSection: React.FC<SporeRegisterProps> = ({
  hosts,
  incubatingHosts,
  isStandaloneView = false,
  onGraftHost,
  onQuickSwap,
  onPledgeGas,
  onSimulateBurn,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'burners' | 'new' | 'incubating' | 'yield'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [activeSubtabs, setActiveSubtabs] = useState<{ [hostId: string]: 'burns' | 'tree' | 'routing' | 'rarity' }>({
    bonk: 'burns',
    wif: 'burns',
    popcat: 'burns',
    giga: 'burns',
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedSporeForEvolution, setSelectedSporeForEvolution] = useState<{
    spore: SymbiontToken;
    hostBurnUsd: number;
  } | null>(null);

  // Quick graft form state (for right column in standalone mode)
  const [quickMintAddress, setQuickMintAddress] = useState('');
  const [quickTicker, setQuickTicker] = useState('');

  const copyAddress = (id: string, text: string) => {
    sound.playBip(900);
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const filteredHosts = useMemo(() => {
    return hosts.filter(host => {
      const matchesSearch =
        host.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        host.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        host.mintAddress.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (activeFilter === 'all') return true;
      if (activeFilter === 'burners') return host.categories.includes('burners');
      if (activeFilter === 'new') return host.categories.includes('new');
      if (activeFilter === 'yield') return host.categories.includes('yield');
      return true;
    });
  }, [hosts, searchQuery, activeFilter]);

  const setSubtab = (hostId: string, tab: 'burns' | 'tree' | 'routing' | 'rarity') => {
    sound.playBip(750);
    setActiveSubtabs(prev => ({ ...prev, [hostId]: tab }));
  };

  return (
    <section className="w-full mb-8" id="spore-register">
      {/* Standalone Header Banner */}
      {isStandaloneView ? (
        <div className="relative w-full rounded-none overflow-hidden bg-[#f0e3fd] border-2 border-[#1f182a] shadow-[4px_4px_0px_#1f182a] mb-6 p-4 sm:p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div className="flex flex-col gap-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-0.5 bg-[#006d3d] text-[#5affa3] font-mono text-[9px] sm:text-[10px] uppercase font-bold border border-[#1f182a]">
                  Registry Zone 01 // Sol-Spore Flora
                </span>
                <span className="px-2 py-0.5 bg-[#b60059] text-[#ffffff] font-mono text-[9px] sm:text-[10px] uppercase font-bold border border-[#1f182a]">
                  Live Feeds Sync: 100%
                </span>
              </div>
              <h1 className="font-['Space_Grotesk'] text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1f182a] uppercase tracking-tight m-0">
                The Spore Register
              </h1>
              <p className="font-['Space_Mono'] text-xs sm:text-sm text-[#5a3f46] max-w-xl">
                Ecosystem census of inoculated Solana memetic hosts, parasitic yield spores, metabolic burn velocity, and active liquidity graduation roots.
              </p>
            </div>

            {/* Quick Registry Summary Stats */}
            <div className="grid grid-cols-3 gap-2 bg-[#ffffff] p-2.5 sm:p-3 border-2 border-[#1f182a] shadow-[2px_2px_0px_#1f182a] font-mono text-center">
              <div className="flex flex-col px-1 sm:px-2 border-r border-[#1f182a]">
                <span className="text-[9px] text-[#5a3f46] uppercase font-bold">Bonded Hosts</span>
                <span className="text-xs sm:text-sm text-[#1f182a] font-bold">28 ACTIVE</span>
              </div>
              <div className="flex flex-col px-1 sm:px-2 border-r border-[#1f182a]">
                <span className="text-[9px] text-[#5a3f46] uppercase font-bold">24h Sol Fed</span>
                <span className="text-xs sm:text-sm text-[#006d3d] font-bold">814.22 SOL</span>
              </div>
              <div className="flex flex-col px-1 sm:px-2">
                <span className="text-[9px] text-[#5a3f46] uppercase font-bold">Scorched</span>
                <span className="text-xs sm:text-sm text-[#df1871] font-bold">$1.84M</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Overview Page Header */
        <div className="border-2 border-[#1f182a] bg-[#faf0ff] p-4 sm:p-5 shadow-[4px_4px_0px_#1f182a] mb-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
            <div>
              <span className="font-mono text-[9px] sm:text-[10px] bg-[#352d40] text-[#f7edff] px-2 py-0.5 uppercase font-bold border border-[#1f182a]">
                Living Registry
              </span>
              <h2 className="font-['Space_Grotesk'] text-2xl sm:text-[26px] font-bold uppercase text-[#1f182a] mt-1">
                The Spore Register
              </h2>
            </div>
            {/* Filter Tabs in Overview */}
            <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
              <button
                onClick={() => {
                  sound.playBip(700);
                  setActiveFilter('burners');
                }}
                className={`border border-[#1f182a] px-3 py-1 font-bold cursor-pointer ${
                  activeFilter === 'burners'
                    ? 'bg-[#b60059] text-white shadow-[2px_2px_0px_#1f182a]'
                    : 'bg-white text-[#1f182a] hover:bg-[#f0e3fd]'
                }`}
              >
                Ranked by Host Burned
              </button>
              <button
                onClick={() => {
                  sound.playBip(700);
                  setActiveFilter('yield');
                }}
                className={`border border-[#1f182a] px-3 py-1 cursor-pointer font-bold ${
                  activeFilter === 'yield'
                    ? 'bg-[#b60059] text-white shadow-[2px_2px_0px_#1f182a]'
                    : 'bg-white text-[#1f182a] hover:bg-[#f0e3fd]'
                }`}
              >
                Highest APY
              </button>
              <button
                onClick={() => {
                  sound.playBip(700);
                  setActiveFilter('new');
                }}
                className={`border border-[#1f182a] px-3 py-1 cursor-pointer font-bold ${
                  activeFilter === 'new'
                    ? 'bg-[#b60059] text-white shadow-[2px_2px_0px_#1f182a]'
                    : 'bg-white text-[#1f182a] hover:bg-[#f0e3fd]'
                }`}
              >
                Newest Grafts
              </button>
            </div>
          </div>

          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search host by symbol ($CASHCAT, $STONK, $PIPPIN) or contract address..."
              className="w-full bg-[#ffffff] border-2 border-[#1f182a] px-3 sm:px-4 py-2 font-mono text-xs sm:text-sm text-[#1f182a] focus:outline-none focus:border-[#df1871]"
            />
            <span className="material-symbols-outlined absolute right-3 top-2.5 text-[#5a3f46] text-[18px]">
              search
            </span>
          </div>
        </div>
      )}

      {/* Standalone Filter Controls Bar */}
      {isStandaloneView && (
        <div className="w-full mb-5 bg-[#ffffff] p-3 sm:p-4 border-2 border-[#1f182a] shadow-[4px_4px_0px_#1f182a] flex flex-col gap-3">
          <div className="flex flex-col lg:flex-row gap-3 justify-between items-stretch lg:items-center">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[260px]">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#5a3f46] text-[18px]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="SEARCH HOST SYMBOL, CA (e.g. CASHCAT, STONK, PIPPIN...)"
                className="w-full pl-9 pr-4 py-2 bg-[#faf0ff] text-[#1f182a] font-mono text-xs border-2 border-[#1f182a] focus:outline-none focus:border-[#df1871]"
              />
            </div>

            {/* Category Filter Chips */}
            <div className="flex flex-wrap items-center gap-1.5 font-mono text-[10px] sm:text-xs">
              <button
                onClick={() => {
                  sound.playBip(650);
                  setActiveFilter('all');
                }}
                className={`px-2.5 py-1.5 border-2 border-[#1f182a] font-bold uppercase cursor-pointer ${
                  activeFilter === 'all'
                    ? 'bg-[#df1871] text-white shadow-[2px_2px_0px_#1f182a]'
                    : 'bg-[#f0e3fd] text-[#1f182a] hover:bg-[#eadef7]'
                }`}
              >
                All Hosts ({hosts.length})
              </button>
              <button
                onClick={() => {
                  sound.playBip(650);
                  setActiveFilter('burners');
                }}
                className={`px-2.5 py-1.5 border-2 border-[#1f182a] font-bold uppercase cursor-pointer ${
                  activeFilter === 'burners'
                    ? 'bg-[#df1871] text-white shadow-[2px_2px_0px_#1f182a]'
                    : 'bg-[#f0e3fd] text-[#1f182a] hover:bg-[#eadef7]'
                }`}
              >
                🔥 Top Burners
              </button>
              <button
                onClick={() => {
                  sound.playBip(650);
                  setActiveFilter('new');
                }}
                className={`px-2.5 py-1.5 border-2 border-[#1f182a] font-bold uppercase cursor-pointer ${
                  activeFilter === 'new'
                    ? 'bg-[#df1871] text-white shadow-[2px_2px_0px_#1f182a]'
                    : 'bg-[#f0e3fd] text-[#1f182a] hover:bg-[#eadef7]'
                }`}
              >
                🌱 Inoculated (24h)
              </button>
              <button
                onClick={() => {
                  sound.playBip(650);
                  setActiveFilter('incubating');
                }}
                className={`px-2.5 py-1.5 border-2 border-[#1f182a] font-bold uppercase cursor-pointer ${
                  activeFilter === 'incubating'
                    ? 'bg-[#df1871] text-white shadow-[2px_2px_0px_#1f182a]'
                    : 'bg-[#f0e3fd] text-[#1f182a] hover:bg-[#eadef7]'
                }`}
              >
                🧪 Incubating
              </button>
              <button
                onClick={() => {
                  sound.playBip(650);
                  setActiveFilter('yield');
                }}
                className={`px-2.5 py-1.5 border-2 border-[#1f182a] font-bold uppercase cursor-pointer ${
                  activeFilter === 'yield'
                    ? 'bg-[#df1871] text-white shadow-[2px_2px_0px_#1f182a]'
                    : 'bg-[#f0e3fd] text-[#1f182a] hover:bg-[#eadef7]'
                }`}
              >
                ⚡ Yield Depth
              </button>
            </div>

            {/* View Switcher */}
            <div className="flex items-center gap-1 bg-[#faf0ff] p-1 border border-[#1f182a] self-end lg:self-auto shrink-0">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1 border border-[#1f182a] cursor-pointer ${
                  viewMode === 'grid' ? 'bg-[#df1871] text-white' : 'bg-white text-[#1f182a]'
                }`}
                title="Matrix View"
              >
                <span className="material-symbols-outlined text-[16px]">grid_view</span>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1 border border-[#1f182a] cursor-pointer ${
                  viewMode === 'table' ? 'bg-[#df1871] text-white' : 'bg-white text-[#1f182a]'
                }`}
                title="Tabular View"
              >
                <span className="material-symbols-outlined text-[16px]">table_rows</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid / Layout */}
      <div className={`w-full ${isStandaloneView ? 'grid grid-cols-1 xl:grid-cols-12 gap-6' : ''}`}>
        {/* Left Host Column */}
        <div className={`${isStandaloneView ? 'xl:col-span-8' : ''} flex flex-col gap-5`}>
          {activeFilter !== 'incubating' && (
            isStandaloneView && viewMode === 'table' ? (
              <div className="bg-[#ffffff] border-2 border-[#1f182a] shadow-[4px_4px_0px_#1f182a] p-4 sm:p-5 flex flex-col gap-3">
                <div className="flex justify-between items-center border-b-2 border-[#1f182a] pb-2 font-mono">
                  <div>
                    <span className="font-['Space_Grotesk'] text-base sm:text-lg font-bold uppercase text-[#1f182a]">
                      Census Roster // Tabular Matrix
                    </span>
                    <span className="text-[10px] text-[#5a3f46] block">
                      Metamorphic evolution level, bio-decay timer, and D3 rarity index across active hosts.
                    </span>
                  </div>
                  <span className="bg-[#006d3d] text-[#5affa3] px-2 py-0.5 text-[10px] font-bold uppercase border border-[#1f182a]">
                    {filteredHosts.reduce((acc, h) => acc + h.attachedSpores.length, 0)} Active Spores
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-xs border-collapse min-w-[620px]">
                    <thead>
                      <tr className="bg-[#faf0ff] border-b-2 border-[#1f182a] text-[#5a3f46] text-[10px] uppercase">
                        <th className="p-2">Stage</th>
                        <th className="p-2">Specimen &amp; Host</th>
                        <th className="p-2">Price &amp; 24h</th>
                        <th className="p-2">Bio-Decay</th>
                        <th className="p-2">Rarity Scale</th>
                        <th className="p-2">Burn Vol ($)</th>
                        <th className="p-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1f182a]/20">
                      {filteredHosts.flatMap(host =>
                        host.attachedSpores.map(spore => {
                          const burnVol =
                            spore.burnVolumeGeneratedUsd ??
                            Math.round(host.cumulativeBurnUsd * (spore.percentageBurnContribution / 100));

                          return (
                            <tr
                              key={spore.id}
                              className="hover:bg-[#faf0ff] transition-none"
                            >
                              <td className="p-2">
                                <SporeEvolvingSprite
                                  burnVolumeUsd={burnVol}
                                  size="sm"
                                  onClick={() => {
                                    sound.playBip(850);
                                    setSelectedSporeForEvolution({
                                      spore,
                                      hostBurnUsd: host.cumulativeBurnUsd,
                                    });
                                  }}
                                />
                              </td>
                              <td className="p-2">
                                <span className="font-bold text-[#1f182a] block">
                                  {spore.symbol}
                                </span>
                                <span className="text-[9px] text-[#5a3f46]">
                                  {spore.name} · Host: {host.symbol}
                                </span>
                              </td>
                              <td className="p-2 font-mono">
                                <span className="text-[#1f182a] block font-bold">${spore.priceUsd}</span>
                                <span
                                  className={`text-[9px] font-bold ${
                                    spore.change24h >= 0 ? 'text-[#006d3d]' : 'text-[#b60059]'
                                  }`}
                                >
                                  {spore.change24h >= 0 ? `+${spore.change24h}%` : `${spore.change24h}%`}
                                </span>
                              </td>
                              <td className="p-2">
                                <SporeVitalityBadge
                                  burnContributionPercent={spore.percentageBurnContribution}
                                  sporeSymbol={spore.symbol}
                                  hostSymbol={host.symbol}
                                  compact={true}
                                />
                              </td>
                              <td className="p-2">
                                <SporeRarityBar
                                  percentage={spore.percentageBurnContribution}
                                  sporeSymbol={spore.symbol}
                                  compact={true}
                                />
                              </td>
                              <td className="p-2 font-mono font-bold text-[#b60059]">
                                ${burnVol.toLocaleString()}
                              </td>
                              <td className="p-2 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => {
                                      sound.playBip(850);
                                      setSelectedSporeForEvolution({
                                        spore,
                                        hostBurnUsd: host.cumulativeBurnUsd,
                                      });
                                    }}
                                    className="px-2 py-1 bg-[#ffffff] hover:bg-[#faf0ff] text-[#1f182a] font-mono text-[9px] font-bold uppercase border border-[#1f182a] cursor-pointer"
                                    title="Open Metamorphic Evolution Dossier"
                                  >
                                    Dossier
                                  </button>
                                  <button
                                    onClick={() => {
                                      sound.playSwap();
                                      onQuickSwap(spore.symbol, host.symbol);
                                    }}
                                    className="px-2 py-1 bg-[#df1871] hover:bg-[#b60059] text-white font-mono text-[9px] font-bold uppercase border border-[#1f182a] cursor-pointer shadow-[1px_1px_0px_#1f182a]"
                                  >
                                    Swap
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div
                className={
                  isStandaloneView
                    ? 'flex flex-col gap-5'
                    : 'grid grid-cols-1 md:grid-cols-2 gap-4'
                }
              >
              {filteredHosts.map((host, idx) => (
                <div
                  key={host.id}
                  className="bg-[#ffffff] border-2 border-[#1f182a] p-4 sm:p-5 shadow-[4px_4px_0px_#1f182a] flex flex-col gap-3 relative overflow-hidden"
                >
                  {/* Decorative corner tag */}
                  <div className="flex flex-wrap items-center justify-between border-b-2 border-[#1f182a] pb-2.5 gap-2">
                    <div className="flex items-center gap-2.5">
                      {isStandaloneView ? (
                        <div className="w-10 h-10 border-2 border-[#1f182a] bg-[#faf0ff] flex items-center justify-center p-0.5 relative shrink-0">
                          <img
                            src={host.avatarUrl}
                            alt={host.symbol}
                            className="w-full h-full object-contain pixelated"
                          />
                          <span
                            className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#5affa3] border border-[#1f182a]"
                            title="Host Healthy"
                          />
                        </div>
                      ) : (
                        <span className="bg-[#b60059] text-white font-mono text-[10px] px-1.5 py-0.5 border border-[#1f182a] font-bold">
                          #{String(idx + 1).padStart(2, '0')}
                        </span>
                      )}

                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-['Space_Grotesk'] text-lg sm:text-xl font-bold uppercase text-[#1f182a]">
                            {host.symbol}
                          </span>
                          <span className="font-mono text-[9px] bg-[#f0e3fd] border border-[#1f182a] text-[#5a3f46] px-1.5 py-0.2 font-bold uppercase">
                            {host.stage}
                          </span>
                          {host.stageBadge && (
                            <span className="font-mono text-[9px] bg-[#5affa3]/25 border border-[#1f182a] text-[#006d3d] px-1.5 py-0.2 font-bold uppercase hidden sm:inline-block">
                              {host.stageBadge}
                            </span>
                          )}
                        </div>

                        {/* CA copy & DexScreener link */}
                        <div className="flex items-center gap-2 font-mono text-[9px] text-[#5a3f46] mt-0.5">
                          <span>CA: {host.mintAddress.slice(0, 4)}...{host.mintAddress.slice(-4)}</span>
                          <button
                            onClick={() => copyAddress(host.id, host.mintAddress)}
                            className="bg-[#f0e3fd] hover:bg-[#b60059] hover:text-white px-1 py-0.2 border border-[#1f182a] uppercase font-bold cursor-pointer"
                          >
                            {copiedId === host.id ? 'COPIED' : 'COPY'}
                          </button>
                          <a
                            href={getPumpfunUrl(host.mintAddress)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#006d3d] hover:underline uppercase font-bold flex items-center gap-0.5 bg-[#5affa3]/30 px-1 py-0.2 border border-[#1f182a]"
                          >
                            <span>💊 Pump.fun</span>
                            <span className="material-symbols-outlined text-[10px]">open_in_new</span>
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] sm:text-[11px] bg-[#50fd9f] text-[#007240] px-2 py-0.5 font-bold border border-[#1f182a]">
                        {host.attachedCount} SYMBIONTS
                      </span>
                      {isStandaloneView && (
                        <span className="font-mono text-[10px] bg-[#f0e3fd] text-[#b60059] px-2 py-0.5 font-bold border border-[#1f182a] hidden sm:inline-block">
                          {host.burntAmountText}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Metrics 4-Grid or 2-Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
                    <div className="bg-[#faf0ff] p-2 border border-[#1f182a]">
                      <span className="text-[#5a3f46] block text-[9px] uppercase font-bold">
                        Cumulative Host Burn
                      </span>
                      <span className="font-['Space_Grotesk'] text-base font-bold text-[#b60059] block">
                        ${host.cumulativeBurnUsd.toLocaleString()}
                      </span>
                      <span className="text-[9px] text-[#006d3d] font-bold">
                        +{host.cumulativeBurnUsdChange7d}% 7d
                      </span>
                    </div>

                    <div className="bg-[#faf0ff] p-2 border border-[#1f182a]">
                      <span className="text-[#5a3f46] block text-[9px] uppercase font-bold">
                        SOL Bio-Fed
                      </span>
                      <span className="font-['Space_Grotesk'] text-base font-bold text-[#1f182a] block">
                        {host.solBioFed.toLocaleString()} SOL
                      </span>
                      <span className="text-[9px] text-[#5a3f46]">Auto-buy &amp; incinerate</span>
                    </div>

                    <div className="bg-[#faf0ff] p-2 border border-[#1f182a]">
                      <span className="text-[#5a3f46] block text-[9px] uppercase font-bold">
                        Attached Spores
                      </span>
                      <span className="font-['Space_Grotesk'] text-base font-bold text-[#5d3ade] block">
                        {host.attachedCount} Symbionts
                      </span>
                      <span className="text-[9px] text-[#006d3d] font-bold">
                        {host.graduatedCount} Graduated Raydium
                      </span>
                    </div>

                    <div className="bg-[#faf0ff] p-2 border border-[#1f182a]">
                      <span className="text-[#5a3f46] block text-[9px] uppercase font-bold">
                        24h Feeding Vol
                      </span>
                      <span className="font-['Space_Grotesk'] text-base font-bold text-[#1f182a] block">
                        {host.feedingVolUsd}
                      </span>
                      <span className="text-[9px] text-[#b60059] font-bold">
                        {host.swapsCount24h.toLocaleString()} Swaps
                      </span>
                    </div>
                  </div>

                  {/* 12-block Segmented Metabolic Progress Meter */}
                  <div className="flex flex-col gap-1 font-mono text-[9px] sm:text-[10px]">
                    <div className="flex justify-between items-center text-[#5a3f46]">
                      <span className="font-bold">
                        Metabolic Graduation Progress (Raydium Dynamic LP Injection)
                      </span>
                      <span className="font-bold text-[#006d3d]">
                        {host.quorumProgressPercent}% QUORUM MET
                      </span>
                    </div>
                    <div className="grid grid-cols-12 gap-1 w-full h-2.5">
                      {Array.from({ length: 12 }).map((_, blockIdx) => {
                        const filledThreshold = (host.quorumProgressPercent / 100) * 12;
                        const isFilled = blockIdx < filledThreshold;
                        return (
                          <div
                            key={blockIdx}
                            className={`h-full border border-[#1f182a]/40 ${
                              isFilled ? 'bg-[#5affa3]' : 'bg-[#eadef7]'
                            }`}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* Attached Spores micro-chips with D3 Rarity Index Bar & Bio-Decay Timer */}
                  <div>
                    <span className="font-mono text-[9px] sm:text-[10px] text-[#5a3f46] uppercase block mb-1.5 font-bold">
                      Parasitizing Symbiont Micro-Tokens, Rarity &amp; Vitality:
                    </span>
                    <div className="flex flex-wrap gap-2 font-mono text-xs">
                      {host.attachedSpores.map(spore => {
                        const burnVol =
                          spore.burnVolumeGeneratedUsd ??
                          Math.round(host.cumulativeBurnUsd * (spore.percentageBurnContribution / 100));

                        return (
                          <div
                            key={spore.id}
                            className="flex flex-col gap-1.5 bg-[#f0e3fd] hover:bg-[#eadef7] p-2 border border-[#1f182a] transition-none min-w-[215px]"
                          >
                            <div className="flex items-center justify-between gap-1.5">
                              <div className="flex items-center gap-2">
                                <SporeEvolvingSprite
                                  burnVolumeUsd={burnVol}
                                  size="sm"
                                  onClick={() => {
                                    sound.playBip(850);
                                    setSelectedSporeForEvolution({
                                      spore,
                                      hostBurnUsd: host.cumulativeBurnUsd,
                                    });
                                  }}
                                />
                                <div>
                                  <div className="flex items-center gap-1">
                                    <span className="font-bold text-[#1f182a]">{spore.symbol}</span>
                                    <span
                                      className={`text-[9px] font-bold ${
                                        spore.change24h >= 0 ? 'text-[#006d3d]' : 'text-[#b60059]'
                                      }`}
                                    >
                                      {spore.change24h >= 0 ? `+${spore.change24h}%` : `${spore.change24h}%`}
                                    </span>
                                  </div>
                                  <span className="text-[9px] text-[#5a3f46]">
                                    ${spore.priceUsd} · ${(burnVol / 1000).toFixed(0)}k Burned
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Spore Vitality / Bio-Decay Mini-Badge */}
                            <div className="flex items-center justify-between gap-1">
                              <SporeVitalityBadge
                                burnContributionPercent={spore.percentageBurnContribution}
                                sporeSymbol={spore.symbol}
                                hostSymbol={host.symbol}
                                compact={true}
                              />
                            </div>

                            {/* D3-Animated Rarity Index Bar */}
                            <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#1f182a]/20">
                              <SporeRarityBar
                                percentage={spore.percentageBurnContribution}
                                sporeSymbol={spore.symbol}
                                compact={true}
                              />
                              <button
                                onClick={() => {
                                  sound.playSwap();
                                  onQuickSwap(spore.symbol, host.symbol);
                                }}
                                className="px-1.5 py-0.5 bg-[#df1871] text-white font-mono text-[9px] font-bold uppercase hover:bg-[#b60059] border border-[#1f182a] cursor-pointer"
                              >
                                Swap
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Subtabs for Standalone Mode */}
                  {isStandaloneView && (
                    <div className="bg-[#faf0ff] border border-[#1f182a] p-2.5 flex flex-col gap-2 mt-1">
                      <div className="flex items-center gap-3 font-mono text-[10px] uppercase border-b border-[#1f182a]/30 pb-1.5 flex-wrap">
                        <button
                          onClick={() => setSubtab(host.id, 'burns')}
                          className={`font-bold cursor-pointer ${
                            activeSubtabs[host.id] === 'burns'
                              ? 'text-[#df1871] underline'
                              : 'text-[#5a3f46] hover:text-[#1f182a]'
                          }`}
                        >
                          🔥 Recent Burns
                        </button>
                        <button
                          onClick={() => setSubtab(host.id, 'rarity')}
                          className={`font-bold cursor-pointer ${
                            activeSubtabs[host.id] === 'rarity'
                              ? 'text-[#df1871] underline'
                              : 'text-[#5a3f46] hover:text-[#1f182a]'
                          }`}
                        >
                          💎 Rarity Index
                        </button>
                        <button
                          onClick={() => setSubtab(host.id, 'tree')}
                          className={`font-bold cursor-pointer ${
                            activeSubtabs[host.id] === 'tree'
                              ? 'text-[#006d3d] underline'
                              : 'text-[#5a3f46] hover:text-[#1f182a]'
                          }`}
                        >
                          🌿 Symbiotic Tree
                        </button>
                        <button
                          onClick={() => setSubtab(host.id, 'routing')}
                          className={`font-bold cursor-pointer ${
                            activeSubtabs[host.id] === 'routing'
                              ? 'text-[#5d3ade] underline'
                              : 'text-[#5a3f46] hover:text-[#1f182a]'
                          }`}
                        >
                          ⚡ Auto-Route Split
                        </button>
                      </div>

                      {/* Subtab content */}
                      {activeSubtabs[host.id] === 'burns' && (
                        <div className="flex flex-col gap-1 font-mono text-[10px]">
                          {host.recentBurns.map((burn, bIdx) => (
                            <div
                              key={bIdx}
                              className="flex justify-between items-center bg-[#ffffff] p-1.5 border border-[#1f182a]/40"
                            >
                              <span className="font-bold text-[#006d3d]">
                                INCINERATED {burn.amount}
                              </span>
                              <span className="text-[#5a3f46]">Tx: {burn.txHash}</span>
                              <span className="text-[#5a3f46]">
                                {burn.timeAgo} via {burn.sporeName}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {activeSubtabs[host.id] === 'rarity' && (
                        <div className="flex flex-col gap-2 font-mono text-[10px] bg-[#ffffff] p-2.5 border border-[#1f182a]/40">
                          <div className="flex justify-between items-center text-[#5a3f46] border-b border-[#1f182a]/20 pb-1">
                            <span className="font-bold uppercase text-[#1f182a]">
                              D3-Calibrated Spore Rarity Matrix
                            </span>
                            <span className="text-[9px]">
                              SCALED BY % BURN CONTRIBUTION
                            </span>
                          </div>
                          <div className="space-y-2">
                            {host.attachedSpores.map(spore => {
                              const burnVol =
                                spore.burnVolumeGeneratedUsd ??
                                Math.round(host.cumulativeBurnUsd * (spore.percentageBurnContribution / 100));

                              return (
                                <div
                                  key={spore.id}
                                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 bg-[#faf0ff] border border-[#1f182a]"
                                >
                                  <div className="flex items-center gap-2">
                                    <SporeEvolvingSprite
                                      burnVolumeUsd={burnVol}
                                      size="sm"
                                      onClick={() => {
                                        sound.playBip(850);
                                        setSelectedSporeForEvolution({
                                          spore,
                                          hostBurnUsd: host.cumulativeBurnUsd,
                                        });
                                      }}
                                    />
                                    <div>
                                      <span className="font-bold text-xs text-[#1f182a] block">
                                        {spore.symbol}
                                      </span>
                                      <span className="text-[#5a3f46] text-[9px]">
                                        {spore.name} · ${(burnVol / 1000).toFixed(0)}k Burned
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                    <SporeVitalityBadge
                                      burnContributionPercent={spore.percentageBurnContribution}
                                      sporeSymbol={spore.symbol}
                                      hostSymbol={host.symbol}
                                      compact={false}
                                    />
                                    <SporeRarityBar
                                      percentage={spore.percentageBurnContribution}
                                      sporeSymbol={spore.symbol}
                                    />
                                    <button
                                      onClick={() => {
                                        sound.playSwap();
                                        onQuickSwap(spore.symbol, host.symbol);
                                      }}
                                      className="px-2 py-1 bg-[#df1871] text-white font-bold text-[9px] uppercase border border-[#1f182a] hover:bg-[#b60059] cursor-pointer"
                                    >
                                      Swap
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {activeSubtabs[host.id] === 'tree' && (
                        <div className="p-2 bg-[#ffffff] border border-[#1f182a]/40 font-mono text-[10px] text-[#5a3f46] leading-relaxed">
                          Host Root: <strong className="text-[#1f182a]">{host.symbol}</strong> (Solana Mainnet-Beta).
                          Attached fungal hyphae absorb 1.00% tax volume across Jupiter DBC routing, converting 50% directly into permanent burn address: <span className="font-bold text-[#b60059]">1nc1ner8t0rNuLL11111111111111111111111</span>.
                        </div>
                      )}

                      {activeSubtabs[host.id] === 'routing' && (
                        <div className="p-2 bg-[#ffffff] border border-[#1f182a]/40 font-mono text-[10px] flex items-center justify-between text-[#1f182a]">
                          <span>50% Host Burned</span>
                          <span>|</span>
                          <span>30% Botanist Graft Royalty</span>
                          <span>|</span>
                          <span>20% Raydium LP Quorum</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Card Bottom CTA */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#1f182a] font-mono text-[10px] sm:text-xs">
                    <span className="text-[#5a3f46] font-bold">
                      FEE BURN RATE: {host.feeBurnRatePercent}%
                    </span>
                    <button
                      onClick={() => {
                        sound.playGraft();
                        onGraftHost(host.symbol);
                      }}
                      className="bg-[#352d40] text-[#5affa3] uppercase px-3 py-1 border border-[#1f182a] shadow-[2px_2px_0px_#1f182a] hover:bg-[#1f182a] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer font-bold"
                    >
                      Graft Symbiont
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

          {/* INCUBATING HOSTS SECTION (Awaiting Quorum) */}
          {(activeFilter === 'all' || activeFilter === 'incubating') && (
            <div className="bg-[#ffffff] border-2 border-[#1f182a] p-4 sm:p-5 shadow-[4px_4px_0px_#1f182a]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                <span className="font-mono text-xs sm:text-sm uppercase font-bold text-[#5d3ade] flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-[#5d3ade] inline-block animate-spin"></span>
                  Hosts Incubating // Keeper Consensus Phase
                </span>
                <span className="font-mono text-[10px] text-[#5a3f46] font-bold uppercase bg-[#f0e3fd] px-2 py-0.5 border border-[#1f182a]">
                  {incubatingHosts.length} TOKENS GATHERING PRICE FEEDS
                </span>
              </div>

              <p className="font-mono text-xs text-[#5a3f46] mb-4">
                Hosts undergoing keeper oracle pinging, liquidity warm-up, and parasite root bonding. Once 5/5 keeper signatures are registered, the bonding curve opens for mutual inoculation.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {incubatingHosts.map(inc => (
                  <div
                    key={inc.id}
                    className="bg-[#faf0ff] border border-[#1f182a] p-3 flex flex-col justify-between gap-2 shadow-[2px_2px_0px_#1f182a]"
                  >
                    <div>
                      <div className="flex justify-between font-mono text-xs mb-1 font-bold">
                        <span className="text-[#1f182a]">{inc.symbol}</span>
                        <span className={inc.isReady ? 'text-[#006d3d]' : 'text-[#5d3ade]'}>
                          {inc.signaturesCount}/{inc.totalSignatures} FEEDS
                        </span>
                      </div>
                      <span className="font-mono text-[9px] text-[#5a3f46] block mb-2">
                        {inc.name}
                      </span>

                      {/* Quorum Progress Bar */}
                      <div className="w-full bg-[#ffffff] h-2.5 border border-[#1f182a] mb-2">
                        <div
                          className={`h-full ${
                            inc.isReady ? 'bg-[#50fd9f]' : 'bg-[#df1871]'
                          }`}
                          style={{
                            width: `${(inc.signaturesCount / inc.totalSignatures) * 100}%`,
                          }}
                        />
                      </div>

                      {/* Dots Visualizer */}
                      <div className="flex items-center gap-1.5 mb-2">
                        {Array.from({ length: inc.totalSignatures }).map((_, dIdx) => (
                          <span
                            key={dIdx}
                            className={`w-2.5 h-2.5 rounded-full border border-[#1f182a] ${
                              dIdx < inc.signaturesCount
                                ? 'bg-[#5affa3]'
                                : 'bg-[#eadef7] animate-pulse'
                            }`}
                          />
                        ))}
                      </div>

                      <span
                        className={`font-mono text-[9px] sm:text-[10px] block ${
                          inc.isReady ? 'text-[#006d3d] font-bold' : 'text-[#5a3f46]'
                        }`}
                      >
                        Est. Launch: {inc.estLaunchTime}
                      </span>
                    </div>

                    <button
                      onClick={() => onPledgeGas(inc)}
                      className="w-full py-1.5 bg-[#ffffff] hover:bg-[#df1871] hover:text-white border border-[#1f182a] font-mono text-[10px] uppercase font-bold text-[#1f182a] cursor-pointer shadow-[1px_1px_0px_#1f182a] active:translate-x-0.5 active:translate-y-0.5"
                    >
                      Pledge Gas (0.05 SOL)
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Quick Graft & Intel Drawer (Standalone Mode only) */}
        {isStandaloneView && (
          <div className="xl:col-span-4 flex flex-col gap-5">
            {/* Quick Graft Panel */}
            <div className="bg-[#ffffff] border-2 border-[#1f182a] p-4 sm:p-5 shadow-[4px_4px_0px_#1f182a] flex flex-col gap-3 sticky top-24">
              <div className="flex items-center justify-between border-b-2 border-[#1f182a] pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-[#df1871] border border-[#1f182a] inline-block"></span>
                  <span className="font-mono text-xs sm:text-sm uppercase font-bold text-[#1f182a]">
                    Graft a Host Specimen
                  </span>
                </div>
                <span className="px-2 py-0.5 bg-[#5affa3]/30 text-[#006d3d] font-mono text-[9px] font-bold uppercase border border-[#1f182a]">
                  Instant Deploy
                </span>
              </div>

              <p className="font-mono text-xs text-[#5a3f46] leading-relaxed">
                Bind any existing Solana SPL token as a mutualistic host. Attached Symbiont spawns route 1.618% fee streams directly into programmatic burns of your chosen token.
              </p>

              {/* Form inputs */}
              <div className="flex flex-col gap-3 font-mono text-xs">
                <div>
                  <label className="block text-[10px] text-[#5a3f46] uppercase font-bold mb-1">
                    Host Token Mint Address
                  </label>
                  <input
                    type="text"
                    value={quickMintAddress}
                    onChange={e => setQuickMintAddress(e.target.value)}
                    placeholder="e.g. DezXAZ8z7Pnrn..."
                    className="w-full p-2 bg-[#faf0ff] border-2 border-[#1f182a] text-[#1f182a] focus:outline-none focus:border-[#df1871]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-[#5a3f46] uppercase font-bold mb-1">
                    Inoculation Spore Ticker
                  </label>
                  <div className="flex gap-1.5">
                    <span className="p-2 bg-[#f0e3fd] border-2 border-[#1f182a] font-bold select-none">
                      $
                    </span>
                    <input
                      type="text"
                      value={quickTicker}
                      onChange={e => setQuickTicker(e.target.value.toUpperCase())}
                      placeholder="SPORE-NAME"
                      className="w-full p-2 bg-[#faf0ff] border-2 border-[#1f182a] text-[#1f182a] uppercase font-bold focus:outline-none focus:border-[#df1871]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="p-2 bg-[#faf0ff] border border-[#1f182a]">
                    <span className="text-[9px] text-[#5a3f46] block uppercase font-bold">
                      Host Burn Rate
                    </span>
                    <span className="font-bold text-[#b60059]">1.0% / TX</span>
                  </div>
                  <div className="p-2 bg-[#faf0ff] border border-[#1f182a]">
                    <span className="text-[9px] text-[#5a3f46] block uppercase font-bold">
                      Spore Seed
                    </span>
                    <span className="font-bold text-[#006d3d]">0.50 SOL Min</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    sound.playGraft();
                    onGraftHost(quickTicker || '$MYCO');
                  }}
                  className="w-full py-2.5 bg-[#df1871] hover:bg-[#b60059] active:translate-x-0.5 active:translate-y-0.5 text-white font-mono text-xs uppercase font-bold tracking-wider border-2 border-[#1f182a] shadow-[3px_3px_0px_#1f182a] transition-none flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">add_circle</span>
                  <span>Initiate Host Graft</span>
                </button>
              </div>

              {/* Protocol Guarantees Checklist */}
              <div className="border-t border-[#1f182a] pt-3 flex flex-col gap-1.5 font-mono text-[10px] text-[#5a3f46]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#006d3d] text-[14px]">
                    check_circle
                  </span>
                  <span>No ruggable developer allocation</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#006d3d] text-[14px]">
                    check_circle
                  </span>
                  <span>100% on-chain burn verification via CPI</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#006d3d] text-[14px]">
                    check_circle
                  </span>
                  <span>Automated graduation to Raydium CPMM</span>
                </div>
              </div>
            </div>

            {/* Living Biome Mini-Widget */}
            <div className="bg-[#ffffff] border-2 border-[#1f182a] p-4 shadow-[4px_4px_0px_#1f182a] flex flex-col gap-2">
              <div className="flex items-center justify-between font-mono">
                <span className="text-xs uppercase font-bold text-[#1f182a]">
                  Biome Feed Velocity
                </span>
                <span className="w-2 h-2 rounded-full bg-[#5affa3] inline-block animate-ping"></span>
              </div>
              {/* SVG Sparkline */}
              <div className="w-full h-16 bg-[#faf0ff] border border-[#1f182a] p-2 flex items-end">
                <svg className="w-full h-full text-[#df1871]" viewBox="0 0 100 30" preserveAspectRatio="none">
                  <path
                    d="M0 25 L10 22 L20 26 L30 18 L40 20 L50 12 L60 15 L70 8 L80 11 L90 4 L100 2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M0 25 L10 22 L20 26 L30 18 L40 20 L50 12 L60 15 L70 8 L80 11 L90 4 L100 2 L100 30 L0 30 Z"
                    fill="currentColor"
                    fillOpacity="0.15"
                  />
                </svg>
              </div>
              <div className="flex justify-between items-center font-mono text-[9px] text-[#5a3f46]">
                <span>TX/HOUR: 1,420</span>
                <span>GRADUATION: 3.4 DAYS AVG</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Spore Evolution & Progression Dossier Modal */}
      {selectedSporeForEvolution && (
        <SporeEvolutionModal
          spore={selectedSporeForEvolution.spore}
          hostBurnUsd={selectedSporeForEvolution.hostBurnUsd}
          onClose={() => setSelectedSporeForEvolution(null)}
          onQuickSwap={onQuickSwap}
          onSimulateBurn={onSimulateBurn}
        />
      )}
    </section>
  );
};
