import React, { useState } from 'react';
import { SymbiontToken } from '../types';
import {
  EVOLUTION_STAGES,
  getSporeStage,
  SporeEvolvingSprite,
} from './SporeEvolvingSprite';
import { sound } from '../utils/audio';

interface SporeEvolutionModalProps {
  spore: SymbiontToken | null;
  hostBurnUsd?: number;
  onClose: () => void;
  onQuickSwap?: (sporeSymbol: string, hostSymbol: string) => void;
  onSimulateBurn?: (sporeId: string, additionalBurn: number) => void;
}

export const SporeEvolutionModal: React.FC<SporeEvolutionModalProps> = ({
  spore,
  hostBurnUsd = 0,
  onClose,
  onQuickSwap,
  onSimulateBurn,
}) => {
  const [bonusBurn, setBonusBurn] = useState(0);

  if (!spore) return null;

  const currentBurnTotal =
    (spore.burnVolumeGeneratedUsd ??
      Math.round(hostBurnUsd * (spore.percentageBurnContribution / 100))) +
    bonusBurn;

  const currentStage = getSporeStage(currentBurnTotal);

  // Compute progress to next stage
  let progressPercent = 100;
  let nextStageReq = 'MAX LEVEL';
  if (currentStage.level < 4) {
    const range = currentStage.thresholdMax - currentStage.thresholdMin;
    const progressInCurrent = Math.max(0, currentBurnTotal - currentStage.thresholdMin);
    progressPercent = Math.min(100, Math.round((progressInCurrent / range) * 100));
    nextStageReq = `$${(currentStage.thresholdMax - currentBurnTotal).toLocaleString()} to LVL ${currentStage.level + 1}`;
  }

  const handleSimulate = (amount: number) => {
    sound.playGraft();
    setBonusBurn(prev => prev + amount);
    if (onSimulateBurn) {
      onSimulateBurn(spore.id, amount);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1f182a]/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 font-mono">
      <div className="bg-[#ffffff] border-2 border-[#1f182a] shadow-[6px_6px_0px_#1f182a] max-w-lg w-full max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-[#352d40] text-[#f7edff] p-3 sm:p-4 border-b-2 border-[#1f182a] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#df1871] text-[20px]">
              auto_awesome
            </span>
            <span className="font-['Space_Grotesk'] text-base sm:text-lg font-bold uppercase tracking-tight text-[#fef7ff]">
              Metamorphic Specimen Dossier
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
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs text-[#1f182a]">
          {/* Hero Specimen Spotlight */}
          <div className="bg-[#faf0ff] border-2 border-[#1f182a] p-4 flex flex-col sm:flex-row items-center gap-4">
            {/* Sprite Avatar */}
            <div className="shrink-0 flex flex-col items-center gap-1.5">
              <SporeEvolvingSprite
                burnVolumeUsd={currentBurnTotal}
                size="lg"
                showBadge={false}
              />
              <span
                className="px-2 py-0.5 text-[9px] font-bold uppercase border border-[#1f182a]"
                style={{ backgroundColor: currentStage.badgeBg, color: currentStage.color }}
              >
                STAGE {currentStage.level}: {currentStage.name}
              </span>
            </div>

            {/* Specimen Vitals */}
            <div className="flex-1 space-y-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h3 className="font-['Space_Grotesk'] text-xl font-bold uppercase text-[#1f182a]">
                  {spore.symbol}
                </h3>
                <span className="text-[10px] text-[#5a3f46]">({spore.name})</span>
              </div>
              <p className="text-[11px] text-[#5a3f46] leading-relaxed">
                {currentStage.description}
              </p>
              <div className="pt-1 flex flex-wrap justify-center sm:justify-start gap-2 text-[10px]">
                <span className="bg-[#ffffff] px-2 py-0.5 border border-[#1f182a] font-bold text-[#b60059]">
                  🔥 ${currentBurnTotal.toLocaleString()} USD Burned
                </span>
                <span className="bg-[#ffffff] px-2 py-0.5 border border-[#1f182a] font-bold text-[#006d3d]">
                  Host: {spore.hostSymbol}
                </span>
              </div>
            </div>
          </div>

          {/* Metamorphic Progression Meter */}
          <div className="bg-[#ffffff] border-2 border-[#1f182a] p-3 space-y-2">
            <div className="flex justify-between items-center text-[10px] font-bold">
              <span className="text-[#5a3f46] uppercase">Evolutionary Burn Cadence:</span>
              <span className="text-[#df1871]">
                {currentStage.level === 4
                  ? 'MAX TITAN FORM UNLOCKED'
                  : `${progressPercent}% (${nextStageReq})`}
              </span>
            </div>

            <div className="w-full h-3 bg-[#faf0ff] border border-[#1f182a] relative overflow-hidden">
              <div
                className="h-full bg-[#df1871] transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* 4-Stage Metamorphosis Codex Gallery */}
          <div>
            <span className="text-[10px] text-[#5a3f46] uppercase font-bold block mb-2">
              Mycelial Metamorphosis Codex (All 4 Tiers)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[10px]">
              {EVOLUTION_STAGES.map(s => {
                const isReached = currentBurnTotal >= s.thresholdMin;
                const isCurrent = s.level === currentStage.level;

                return (
                  <div
                    key={s.level}
                    className={`p-2 border-2 ${
                      isCurrent
                        ? 'border-[#df1871] bg-[#ffd9e1]/40 shadow-[2px_2px_0px_#1f182a]'
                        : isReached
                        ? 'border-[#1f182a] bg-[#faf0ff]'
                        : 'border-[#1f182a]/40 bg-[#ffffff] opacity-50'
                    } flex flex-col items-center gap-1`}
                  >
                    <SporeEvolvingSprite
                      burnVolumeUsd={s.thresholdMin + 500}
                      size="sm"
                      showBadge={false}
                    />
                    <span className="font-bold text-[10px] text-[#1f182a] block">
                      LVL {s.level}
                    </span>
                    <span className="text-[8px] text-[#5a3f46] block leading-tight">
                      {s.name}
                    </span>
                    <span className="text-[8px] text-[#b60059] font-bold">
                      {s.thresholdMax === Infinity
                        ? '>$300k'
                        : `$${Math.round(s.thresholdMin / 1000)}k-$${Math.round(s.thresholdMax / 1000)}k`}
                    </span>
                    {isCurrent && (
                      <span className="text-[7px] bg-[#df1871] text-white px-1 font-bold uppercase mt-0.5">
                        ACTIVE
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Test & Simulation Controls */}
          <div className="bg-[#faf0ff] border-2 border-[#1f182a] p-3 space-y-2">
            <span className="text-[10px] text-[#5a3f46] uppercase font-bold block">
              Test Metamorphic Progression (Simulate Trade Burns)
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleSimulate(25000)}
                className="px-2.5 py-1.5 bg-[#ffffff] hover:bg-[#df1871] hover:text-white border-2 border-[#1f182a] shadow-[2px_2px_0px_#1f182a] text-[10px] uppercase font-bold cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
              >
                + $25,000 Burn
              </button>
              <button
                onClick={() => handleSimulate(100000)}
                className="px-2.5 py-1.5 bg-[#ffffff] hover:bg-[#df1871] hover:text-white border-2 border-[#1f182a] shadow-[2px_2px_0px_#1f182a] text-[10px] uppercase font-bold cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
              >
                + $100,000 Burn
              </button>
              <button
                onClick={() => handleSimulate(250000)}
                className="px-2.5 py-1.5 bg-[#ffffff] hover:bg-[#df1871] hover:text-white border-2 border-[#1f182a] shadow-[2px_2px_0px_#1f182a] text-[10px] uppercase font-bold cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
              >
                🚀 Morph into Titan (+$250k)
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#f0e3fd] border-t-2 border-[#1f182a] flex justify-between items-center gap-2">
          <button
            onClick={() => {
              if (onQuickSwap) {
                onClose();
                onQuickSwap(spore.symbol, spore.hostSymbol);
              }
            }}
            className="px-4 py-2 bg-[#df1871] hover:bg-[#b60059] text-white border-2 border-[#1f182a] font-mono text-xs uppercase font-bold shadow-[2px_2px_0px_#1f182a] cursor-pointer"
          >
            Fertilize &amp; Swap {spore.symbol}
          </button>
          <button
            onClick={() => {
              sound.playBip(500);
              onClose();
            }}
            className="px-3 py-2 bg-white text-[#1f182a] border-2 border-[#1f182a] font-mono text-xs uppercase font-bold shadow-[1px_1px_0px_#1f182a] cursor-pointer"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
