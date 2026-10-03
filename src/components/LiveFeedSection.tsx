import React, { useState, useEffect } from 'react';
import { Bell, BellRing } from 'lucide-react';
import { LiveActivityItem } from '../types';
import { sound } from '../utils/audio';
import { ColonyTelemetryChart } from './ColonyTelemetryChart';

interface LiveFeedProps {
  initialItems: LiveActivityItem[];
}

export const LiveFeedSection: React.FC<LiveFeedProps> = ({ initialItems }) => {
  const [items, setItems] = useState<LiveActivityItem[]>(initialItems);
  const [sfxOn, setSfxOn] = useState(sound.enabled);
  const [selectedTx, setSelectedTx] = useState<LiveActivityItem | null>(null);
  const [realtimeBurnBonus, setRealtimeBurnBonus] = useState(0);
  const [realtimeSporeBonus, setRealtimeSporeBonus] = useState(0);
  const [alertPairs, setAlertPairs] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('symbiont_price_alerts');
      return saved ? JSON.parse(saved) : ['$SPORE-$CASHCAT'];
    } catch {
      return ['$SPORE-$CASHCAT'];
    }
  });
  const [alertToast, setAlertToast] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('symbiont_price_alerts', JSON.stringify(alertPairs));
    } catch {
      // Ignore localStorage quotas in sandboxes
    }
  }, [alertPairs]);

  const toggleSfx = () => {
    sound.enabled = !sfxOn;
    setSfxOn(!sfxOn);
    sound.playBip(800);
  };

  const getPairKey = (tokenSymbol: string, hostSymbol: string) => {
    const cleanSpore = tokenSymbol.replace(/[\[\]]/g, '');
    return `${cleanSpore}-${hostSymbol}`;
  };

  const togglePriceAlert = (item: LiveActivityItem) => {
    const cleanSpore = item.tokenSymbol.replace(/[\[\]]/g, '');
    const pairKey = getPairKey(item.tokenSymbol, item.hostSymbol);
    const isCurrentlyActive = alertPairs.includes(pairKey);

    if (isCurrentlyActive) {
      sound.playBip(550);
      setAlertPairs(prev => prev.filter(k => k !== pairKey));
      setAlertToast(`🔕 Alert muted for ${cleanSpore} / ${item.hostSymbol}`);
    } else {
      sound.playBip(1150);
      setAlertPairs(prev => [...prev, pairKey]);
      setAlertToast(`🔔 Price alert armed for ${cleanSpore} / ${item.hostSymbol} (>5% spike or whale burn)`);
    }

    setTimeout(() => {
      setAlertToast(prev => (prev?.includes(cleanSpore) ? null : prev));
    }, 3500);
  };

  // Simulate real-time live ticks
  useEffect(() => {
    const timer = setInterval(() => {
      const types: ('BUY' | 'SELL')[] = ['BUY', 'BUY', 'SELL'];
      const chosenType = types[Math.floor(Math.random() * types.length)];
      const hosts = [
        { host: '$CASHCAT', spore: '$SPORE', factor: 60 },
        { host: '$STONK', spore: '$STONK-HYPHA', factor: 45 },
        { host: '$PIPPIN', spore: '$PIP-AGENT', factor: 50 },
        { host: '$POPCAT', spore: '$POP-OAT', factor: 20 },
        { host: '$WIF', spore: '$HAT-MYCEL', factor: 15 },
        { host: '$BONK', spore: '$PUP-HYPHA', factor: 10 },
      ];
      const selected = hosts[Math.floor(Math.random() * hosts.length)];
      const amount = Math.floor(Math.random() * 40000 + 5000);
      const burn = Math.round(amount * 0.005);
      const hashChars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
      const fakeHash =
        Array.from({ length: 4 }, () => hashChars[Math.floor(Math.random() * hashChars.length)]).join('') +
        '...' +
        Array.from({ length: 4 }, () => hashChars[Math.floor(Math.random() * hashChars.length)]).join('');

      const newItem: LiveActivityItem = {
        id: `tx-${Date.now()}`,
        type: chosenType,
        tokenAmount: amount.toLocaleString(),
        tokenSymbol: selected.spore,
        hostSymbol: selected.host,
        burntAmount: burn.toLocaleString(),
        burntSymbol: selected.host,
        txHash: fakeHash,
        timestamp: Date.now(),
      };

      setItems(prev => [newItem, ...prev.slice(0, 19)]);
      setRealtimeBurnBonus(prev => prev + burn);
      if (Math.random() > 0.6) {
        setRealtimeSporeBonus(prev => prev + 1);
      }
      if (sfxOn) {
        sound.playBip(920);
      }
    }, 6500);

    return () => clearInterval(timer);
  }, [sfxOn]);

  return (
    <section className="w-full mb-8" id="colony-live-feed">
      {/* 24-Hour Telemetry Recharts Visualization */}
      <ColonyTelemetryChart
        bonusBurn={realtimeBurnBonus}
        bonusSpores={realtimeSporeBonus}
      />

      {/* Real-time Alert Toast Notification */}
      {alertToast && (
        <div className="mb-2 p-2.5 bg-[#50fd9f] text-[#00210f] border-2 border-[#1f182a] shadow-[2px_2px_0px_#1f182a] font-mono text-xs font-bold flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#006d3d] inline-block animate-ping"></span>
            <span>{alertToast}</span>
          </span>
          <button
            onClick={() => setAlertToast(null)}
            className="text-[10px] uppercase font-bold hover:underline cursor-pointer ml-2"
          >
            DISMISS
          </button>
        </div>
      )}

      <div className="bg-[#ffffff] border-2 border-[#1f182a] shadow-[4px_4px_0px_#1f182a]">
        {/* Header Bar */}
        <div className="bg-[#352d40] text-[#f7edff] px-4 py-2 border-b-2 border-[#1f182a] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#5affa3] inline-block animate-ping"></span>
            <span className="font-mono text-xs sm:text-sm uppercase font-bold text-[#5affa3]">
              LIVE REPLICATOR FEED: ONE TRADE, INFINITE SPORES
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 font-mono text-[10px] sm:text-xs flex-wrap">
            <span
              className="bg-[#faf0ff] text-[#b60059] px-2 py-0.5 border border-[#1f182a] font-bold flex items-center gap-1"
              title={`${alertPairs.length} host-spore pairs monitored`}
            >
              <Bell className="w-3 h-3 text-[#b60059]" />
              <span>{alertPairs.length} ALERTS ARMED</span>
            </span>

            <button
              onClick={toggleSfx}
              className="bg-[#ffffff] text-[#1f182a] px-2 py-0.5 border border-[#1f182a] uppercase font-bold flex items-center gap-1 cursor-pointer hover:bg-[#faf0ff]"
            >
              <span className="material-symbols-outlined text-[14px]">
                {sfxOn ? 'volume_up' : 'volume_off'}
              </span>
              <span>SFX: {sfxOn ? 'ON' : 'OFF'}</span>
            </button>
            <span className="text-[#fef7ff] font-bold hidden sm:inline">STREAM: ACTIVE</span>
          </div>
        </div>

        {/* Feed Rows */}
        <div className="divide-y divide-[#1f182a]/20 font-mono text-xs">
          {items.map(item => {
            const pairKey = getPairKey(item.tokenSymbol, item.hostSymbol);
            const isAlertActive = alertPairs.includes(pairKey);

            return (
              <div
                key={item.id}
                className="p-2.5 px-3 sm:px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-[#faf0ff] transition-none"
              >
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`px-1.5 py-0.2 font-bold text-[10px] border border-[#1f182a] ${
                      item.type === 'BUY'
                        ? 'bg-[#5affa3] text-[#00210f]'
                        : item.type === 'SELL'
                        ? 'bg-[#ba1a1a] text-white'
                        : 'bg-[#7658f8] text-white'
                    }`}
                  >
                    {item.type}
                  </span>
                  <span className="font-bold text-[#1f182a]">
                    {item.tokenAmount} {item.tokenSymbol}
                  </span>
                  <span className="text-[#5a3f46]">
                    {item.type === 'GRAFT'
                      ? `Grafted onto ${item.hostSymbol}`
                      : `via [HOST: ${item.hostSymbol}]`}
                  </span>

                  {/* Bell Alert Toggle Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePriceAlert(item);
                    }}
                    title={
                      isAlertActive
                        ? `Price alert active for ${item.tokenSymbol} / ${item.hostSymbol}. Click to disable.`
                        : `Set price alert for ${item.tokenSymbol} / ${item.hostSymbol}`
                    }
                    className={`p-1 border transition-none flex items-center justify-center cursor-pointer ${
                      isAlertActive
                        ? 'bg-[#50fd9f] text-[#00210f] border-[#1f182a] shadow-[1px_1px_0px_#1f182a]'
                        : 'bg-[#faf0ff] text-[#5a3f46] border-[#1f182a]/50 hover:bg-[#ffd9e1] hover:text-[#b60059] hover:border-[#1f182a]'
                    }`}
                    aria-label={`Toggle price alert for ${item.tokenSymbol} and ${item.hostSymbol}`}
                  >
                    {isAlertActive ? (
                      <BellRing className="w-3.5 h-3.5 text-[#006d3d]" />
                    ) : (
                      <Bell className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-3 text-[#5a3f46] text-[11px] self-end sm:self-auto">
                  <span className="text-[#b60059] font-bold">
                    🔥 {item.burntAmount} {item.burntSymbol} {item.type === 'GRAFT' ? '' : 'BURNT'}
                  </span>
                  <button
                    onClick={() => {
                      sound.playBip(800);
                      setSelectedTx(item);
                    }}
                    className="text-[#5a3f46] hover:text-[#1f182a] underline cursor-pointer"
                  >
                    TX: {item.txHash}
                  </button>
                  <button
                    onClick={() => {
                      sound.playSwap();
                      setSelectedTx(item);
                    }}
                    className="text-[#5d3ade] underline font-bold uppercase cursor-pointer"
                  >
                    {item.type === 'GRAFT' ? 'EXPLORER' : 'DEX'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Transaction Details Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 bg-[#1f182a]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#ffffff] border-2 border-[#1f182a] shadow-[6px_6px_0px_#1f182a] max-w-md w-full p-4 sm:p-5 font-mono">
            <div className="flex justify-between items-center border-b-2 border-[#1f182a] pb-2 mb-3">
              <span className="font-bold text-xs uppercase text-[#b60059]">
                Solana CPI Transaction Receipt
              </span>
              <button
                onClick={() => setSelectedTx(null)}
                className="font-bold text-sm hover:text-[#df1871] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs text-[#1f182a] mb-4">
              <div className="flex justify-between border-b border-[#1f182a]/20 py-1">
                <span className="text-[#5a3f46]">Signature Hash:</span>
                <span className="font-bold text-[#5d3ade]">{selectedTx.txHash}</span>
              </div>
              <div className="flex justify-between border-b border-[#1f182a]/20 py-1">
                <span className="text-[#5a3f46]">Action:</span>
                <span className="font-bold">{selectedTx.type}</span>
              </div>
              <div className="flex justify-between border-b border-[#1f182a]/20 py-1">
                <span className="text-[#5a3f46]">Token Volume:</span>
                <span className="font-bold">
                  {selectedTx.tokenAmount} {selectedTx.tokenSymbol}
                </span>
              </div>
              <div className="flex justify-between border-b border-[#1f182a]/20 py-1">
                <span className="text-[#5a3f46]">1% Metabolic Fee Harvest:</span>
                <span className="font-bold text-[#b60059]">
                  {selectedTx.burntAmount} {selectedTx.burntSymbol}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#5a3f46]">Status:</span>
                <span className="font-bold text-[#006d3d]">CONFIRMED (FINALIZED)</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedTx(null)}
              className="w-full py-2 bg-[#df1871] text-white border-2 border-[#1f182a] uppercase font-bold text-xs shadow-[2px_2px_0px_#1f182a] cursor-pointer"
            >
              Close Receipt
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
