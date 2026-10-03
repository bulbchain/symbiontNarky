import React, { useState, useEffect, useMemo } from 'react';

interface SporeVitalityBadgeProps {
  burnContributionPercent: number;
  sporeSymbol: string;
  hostSymbol: string;
  compact?: boolean;
}

export const SporeVitalityBadge: React.FC<SporeVitalityBadgeProps> = ({
  burnContributionPercent,
  sporeSymbol,
  hostSymbol,
  compact = true,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  // Compute total decay base seconds based on burn contribution relative to host volume
  // Higher burn contribution = longer sustained vitality buffer
  const initialSeconds = useMemo(() => {
    // 1% burn contribution ~ 4.5 hours of vitality reserve
    // 88% ~ 16.5 days, 5% ~ 22.5 hours
    const hours = Math.max(8, Math.round(burnContributionPercent * 4.5 + 12));
    return hours * 3600;
  }, [burnContributionPercent]);

  const [remainingSeconds, setRemainingSeconds] = useState(initialSeconds);

  // Live timer tick
  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingSeconds(prev => (prev > 1 ? prev - 1 : initialSeconds));
    }, 1000);
    return () => clearInterval(interval);
  }, [initialSeconds]);

  // Format countdown string
  const formatTimer = (totalSec: number) => {
    const days = Math.floor(totalSec / 86400);
    const hours = Math.floor((totalSec % 86400) / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;

    if (days > 0) {
      return `${days}d ${String(hours).padStart(2, '0')}h`;
    }
    return `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
  };

  const vitalityScore = Math.min(99, Math.max(15, Math.round(burnContributionPercent * 0.95 + 12)));

  const getStatusColor = (score: number) => {
    if (score >= 70) return { dot: 'bg-[#5affa3]', text: 'text-[#006d3d]', border: 'border-[#006d3d]' };
    if (score >= 35) return { dot: 'bg-[#ff9f1c]', text: 'text-[#e58606]', border: 'border-[#e58606]' };
    return { dot: 'bg-[#df1871]', text: 'text-[#b60059]', border: 'border-[#df1871]' };
  };

  const statusTheme = getStatusColor(vitalityScore);

  return (
    <div
      className="relative inline-block font-mono"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Mini-Stat Badge */}
      <div
        className={`px-1.5 py-0.5 border border-[#1f182a] bg-[#ffffff] shadow-[1px_1px_0px_#1f182a] flex items-center gap-1 text-[9px] cursor-pointer hover:bg-[#faf0ff] select-none ${
          compact ? '' : 'py-1'
        }`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full inline-block animate-pulse ${statusTheme.dot}`}
        />
        <span className="text-[#5a3f46] font-bold uppercase text-[8px]">
          BIO-DECAY:
        </span>
        <span className={`font-bold ${statusTheme.text}`}>
          {formatTimer(remainingSeconds)}
        </span>
      </div>

      {/* Floating Detailed Vitality Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-0 mb-1.5 z-50 w-56 p-2.5 bg-[#352d40] text-[#f7edff] border-2 border-[#1f182a] shadow-[4px_4px_0px_#1f182a] text-[10px] pointer-events-none">
          <div className="flex items-center justify-between border-b border-[#1f182a] pb-1 mb-1.5">
            <span className="text-[#5affa3] font-bold uppercase">
              Spore Vitality Ledger
            </span>
            <span className="text-[9px] text-[#e2bdc5] uppercase">
              {sporeSymbol} / {hostSymbol}
            </span>
          </div>

          <div className="space-y-1 text-[10px]">
            <div className="flex justify-between items-center">
              <span className="text-[#e2bdc5]">Vitality Health:</span>
              <span className="font-bold text-[#5affa3]">
                {vitalityScore}% (Sustained Inoculation)
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[#e2bdc5]">Est. Bio-Decay:</span>
              <span className="font-bold text-[#ffd9e1]">
                {formatTimer(remainingSeconds)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[#e2bdc5]">Host Ingestion Rate:</span>
              <span className="font-bold text-[#fef7ff]">
                {burnContributionPercent}% of 1% Fee Pool
              </span>
            </div>

            <div className="mt-1 pt-1 border-t border-[#1f182a]/60 text-[9px] text-[#e2bdc5] leading-tight">
              Trades on {hostSymbol} continuously fertilize mycelial roots, resetting bio-decay countdown.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
