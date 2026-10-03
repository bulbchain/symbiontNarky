import React, { useState } from 'react';
import { WalletProvider } from './context/WalletContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { TickerBar } from './components/TickerBar';
import { HeroSection } from './components/HeroSection';
import { HowItFeedsSection } from './components/HowItFeedsSection';
import { SwapRoutingSection } from './components/SwapRoutingSection';
import { SporeRegisterSection } from './components/SporeRegisterSection';
import { DeployGraftSection } from './components/DeployGraftSection';
import { LiveFeedSection } from './components/LiveFeedSection';
import { WalletDrawer } from './components/WalletDrawer';
import { SwapModal } from './components/SwapModal';
import { PledgeGasModal } from './components/PledgeGasModal';
import { EcosystemDocsModal } from './components/EcosystemDocsModal';
import { INITIAL_HOSTS, INITIAL_INCUBATING_HOSTS, INITIAL_LIVE_ACTIVITY } from './data/protocolData';
import { HostSpecimen, IncubatingHost, LiveActivityItem } from './types';
import { sound } from './utils/audio';

function AppContent() {
  const [currentTab, setCurrentTab] = useState<'how-it-feeds' | 'spore-register' | 'graft-a-host' | 'colony-live-feed'>('how-it-feeds');
  const [hosts, setHosts] = useState<HostSpecimen[]>(INITIAL_HOSTS);
  const [incubatingHosts] = useState<IncubatingHost[]>(INITIAL_INCUBATING_HOSTS);
  const [liveActivity] = useState<LiveActivityItem[]>(INITIAL_LIVE_ACTIVITY);

  // Modals
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const [swapTarget, setSwapTarget] = useState<{ host: string; spore: string }>({
    host: '$CASHCAT',
    spore: '$SPORE',
  });
  const [selectedIncubating, setSelectedIncubating] = useState<IncubatingHost | null>(null);
  const [isDocsOpen, setIsDocsOpen] = useState(false);

  // Quick swap handler from cards or badges
  const handleQuickSwap = (sporeSymbol: string, hostSymbol: string) => {
    setSwapTarget({ host: hostSymbol, spore: sporeSymbol });
    setIsSwapModalOpen(true);
  };

  // Graft handler: route to graft form
  const handleGraftHost = (hostSymbol: string) => {
    setCurrentTab('graft-a-host');
    setTimeout(() => {
      const el = document.getElementById('graft-form');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // When a user tests or simulates spore burn boosting in the progression dossier
  const handleSporeBurnBoost = (sporeId: string, additionalBurn: number) => {
    setHosts(prevHosts =>
      prevHosts.map(host => {
        const hasSpore = host.attachedSpores.some(s => s.id === sporeId);
        if (!hasSpore) return host;
        return {
          ...host,
          cumulativeBurnUsd: host.cumulativeBurnUsd + additionalBurn,
          attachedSpores: host.attachedSpores.map(s => {
            if (s.id === sporeId) {
              const currentBurn =
                s.burnVolumeGeneratedUsd ??
                Math.round(host.cumulativeBurnUsd * (s.percentageBurnContribution / 100));
              return {
                ...s,
                burnVolumeGeneratedUsd: currentBurn + additionalBurn,
              };
            }
            return s;
          }),
        };
      })
    );
  };

  return (
    <div className="bg-[#fef7ff] font-['Space_Mono'] text-[#1f182a] antialiased min-h-screen flex flex-col selection:bg-[#5affa3] selection:text-[#00210f]">
      {/* Top Header */}
      <Header
        currentTab={currentTab}
        onTabChange={(tab: string) => {
          setCurrentTab(tab as typeof currentTab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenDocs={() => setIsDocsOpen(true)}
      />

      {/* Main Container */}
      <main className="w-full pt-22 sm:pt-24 bg-[#fef7ff] max-w-[1140px] mx-auto px-3 sm:px-4 pb-12 flex-1">
        {/* Running Marquee Ticker */}
        <TickerBar />

        {/* View Routing */}
        {currentTab === 'how-it-feeds' && (
          <>
            {/* Section 1: Hero Stage */}
            <HeroSection
              onGraftClick={() => {
                const el = document.getElementById('graft-form');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onHowItFeedsClick={() => {
                const el = document.getElementById('how-it-feeds');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onSelectSpore={(symbol: string) => {
                handleQuickSwap(symbol, '$CASHCAT');
              }}
            />

            {/* Section 2: Explainer / How a Symbiont Feeds */}
            <HowItFeedsSection />

            {/* Section 3: Swap Routing */}
            <SwapRoutingSection
              onOpenSwap={(customHost?: string) => {
                if (customHost) {
                  setSwapTarget(prev => ({ ...prev, host: customHost }));
                }
                setIsSwapModalOpen(true);
              }}
            />

            {/* Section 4: The Spore Register (Embedded overview mode) */}
            <SporeRegisterSection
              hosts={hosts}
              incubatingHosts={incubatingHosts}
              isStandaloneView={false}
              onGraftHost={handleGraftHost}
              onQuickSwap={handleQuickSwap}
              onPledgeGas={inc => setSelectedIncubating(inc)}
              onSimulateBurn={handleSporeBurnBoost}
            />

            {/* Section 5: Deploy Graft Form */}
            <DeployGraftSection />

            {/* Section 6: Live Activity Feed */}
            <LiveFeedSection initialItems={liveActivity} />
          </>
        )}

        {/* View 2: Dedicated "The Spore Register" Screen (HTML 2 / Image 3) */}
        {currentTab === 'spore-register' && (
          <>
            <SporeRegisterSection
              hosts={hosts}
              incubatingHosts={incubatingHosts}
              isStandaloneView={true}
              onGraftHost={handleGraftHost}
              onQuickSwap={handleQuickSwap}
              onPledgeGas={inc => setSelectedIncubating(inc)}
              onSimulateBurn={handleSporeBurnBoost}
            />
          </>
        )}

        {/* View 3: Dedicated "Graft a Host" Screen */}
        {currentTab === 'graft-a-host' && (
          <div className="space-y-6">
            <div className="bg-[#f0e3fd] border-2 border-[#1f182a] p-4 sm:p-5 shadow-[4px_4px_0px_#1f182a]">
              <span className="px-2 py-0.5 bg-[#df1871] text-white font-mono text-[9px] uppercase font-bold border border-[#1f182a]">
                Terminal Deployer Zone
              </span>
              <h1 className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-bold uppercase text-[#1f182a] mt-1.5">
                Graft a Host Specimen
              </h1>
              <p className="font-mono text-xs sm:text-sm text-[#5a3f46] mt-1">
                Configure a graft deployment preview. Creating tokens and bonding curves is disabled until the audited Solana program and deployment service are configured.
              </p>
            </div>

            <DeployGraftSection />
          </div>
        )}

        {/* View 4: Dedicated "Colony Live Feed" Screen */}
        {currentTab === 'colony-live-feed' && (
          <div className="space-y-6">
            <div className="bg-[#f0e3fd] border-2 border-[#1f182a] p-4 sm:p-5 shadow-[4px_4px_0px_#1f182a]">
              <span className="px-2 py-0.5 bg-[#006d3d] text-[#5affa3] font-mono text-[9px] uppercase font-bold border border-[#1f182a]">
                Live Replicator Telemetry
              </span>
              <h1 className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-bold uppercase text-[#1f182a] mt-1.5">
                Colony Live Transaction Stream
              </h1>
              <p className="font-mono text-xs sm:text-sm text-[#5a3f46] mt-1">
                Sample activity feed. Live on-chain transaction indexing has not been configured.
              </p>
            </div>

            <LiveFeedSection initialItems={liveActivity} />
          </div>
        )}
      </main>

      {/* Global Modals & Drawers */}
      <WalletDrawer />

      <SwapModal
        isOpen={isSwapModalOpen}
        onClose={() => setIsSwapModalOpen(false)}
        defaultHost={swapTarget.host}
        defaultSpore={swapTarget.spore}
      />

      <PledgeGasModal
        host={selectedIncubating}
        onClose={() => setSelectedIncubating(null)}
      />

      <EcosystemDocsModal
        isOpen={isDocsOpen}
        onClose={() => setIsDocsOpen(false)}
      />

      {/* Footer */}
      <Footer onOpenDocs={() => setIsDocsOpen(true)} />
    </div>
  );
}

export default function App() {
  return (
    <WalletProvider>
      <AppContent />
    </WalletProvider>
  );
}
