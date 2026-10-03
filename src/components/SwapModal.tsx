import React, { useState, useEffect } from 'react';
import { useWallet } from '../context/WalletContext';
import { sound } from '../utils/audio';
import { FAMOUS_INTERMEDIATE_HOSTS } from '../types/bridge';

interface SwapModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultHost?: string;
  defaultSpore?: string;
}

export const SwapModal: React.FC<SwapModalProps> = ({
  isOpen,
  onClose,
  defaultHost = '$CASHCAT',
  defaultSpore = '$SPORE',
}) => {
  const { wallet } = useWallet();

  const [inputAmount, setInputAmount] = useState<string>('0.5');
  const [selectedSpore, setSelectedSpore] = useState<string>(defaultSpore);
  const [selectedHost, setSelectedHost] = useState<string>(defaultHost);
  const [isEditingHost, setIsEditingHost] = useState<boolean>(false);
  const [customHostInput, setCustomHostInput] = useState<string>('');
  const [slippage, setSlippage] = useState<string>('1.5%');

  useEffect(() => {
    if (defaultHost) setSelectedHost(defaultHost);
    if (defaultSpore) setSelectedSpore(defaultSpore);
  }, [defaultHost, defaultSpore, isOpen]);

  if (!isOpen) return null;

  const solAmount = parseFloat(inputAmount) || 0;
  // Exchange rate simulation
  const sporeOutputAmount = Math.round(solAmount * 48000);
  const feeAmount = Math.round(sporeOutputAmount * 0.01);
  const burnHostAmount = Math.round(feeAmount * 0.50);

  const handleApplyCustomHost = () => {
    let clean = customHostInput.trim().toUpperCase();
    if (!clean) return;
    if (!clean.startsWith('$')) clean = '$' + clean;
    sound.playGraft();
    setSelectedHost(clean);
    setIsEditingHost(false);
    setCustomHostInput('');
  };

  const handleSelectHostDirect = (symbol: string) => {
    sound.playBip(700);
    setSelectedHost(symbol);
    setIsEditingHost(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1f182a]/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#ffffff] border-2 border-[#1f182a] shadow-[6px_6px_0px_#1f182a] max-w-md w-full font-mono">
        {/* Header */}
        <div className="bg-[#352d40] text-[#f7edff] p-3 sm:p-4 border-b-2 border-[#1f182a] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#5affa3] text-[20px]">swap_horiz</span>
            <span className="font-['Space_Grotesk'] text-base font-bold uppercase tracking-tight text-[#fef7ff]">
              Inter-Cellular DBC Swap
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
        <div className="p-4 sm:p-5 space-y-4 text-xs">
          {/* Input: SOL */}
          <div>
            <div className="flex justify-between text-[#5a3f46] mb-1">
              <span className="uppercase font-bold text-[10px]">You Pay (Source Asset)</span>
              <span>
                Balance:{' '}
                {wallet.isConnected
                  ? wallet.balanceSol === null
                    ? 'Unavailable'
                    : `${wallet.balanceSol.toFixed(3)} SOL`
                  : '0.00 SOL'}
              </span>
            </div>
            <div className="flex border-2 border-[#1f182a] bg-[#faf0ff]">
              <input
                type="number"
                step="0.1"
                min="0.01"
                value={inputAmount}
                onChange={e => setInputAmount(e.target.value)}
                className="w-full p-2.5 bg-transparent font-bold text-[#1f182a] text-sm focus:outline-none"
                placeholder="0.0"
              />
              <div className="flex items-center px-3 bg-[#eadef7] border-l-2 border-[#1f182a] font-bold select-none text-[#1f182a]">
                SOL
              </div>
            </div>
          </div>

          {/* Route Arrow Indicator with in-between token badge */}
          <div className="flex items-center justify-center -my-2 relative z-10 gap-2">
            <div className="w-8 h-8 rounded-full bg-[#df1871] text-white border-2 border-[#1f182a] flex items-center justify-center shadow-[2px_2px_0px_#1f182a]">
              <span className="material-symbols-outlined text-[18px]">arrow_downward</span>
            </div>
            <div className="bg-[#ffd9e1] border border-[#1f182a] px-2 py-0.5 text-[10px] font-bold flex items-center gap-1.5 shadow-[1px_1px_0px_#1f182a]">
              <span>Intermediate Soil:</span>
              <span className="text-[#b60059] font-bold">{selectedHost}</span>
              <button
                type="button"
                onClick={() => {
                  sound.playBip(600);
                  setIsEditingHost(prev => !prev);
                }}
                className="text-[9px] underline text-[#1f182a] hover:text-[#df1871] cursor-pointer"
                title="Change In-Between Token"
              >
                [switch]
              </button>
            </div>
          </div>

          {/* Select or Custom In-Between Token Panel */}
          {isEditingHost && (
            <div className="bg-[#f0e3fd] border border-[#1f182a] p-2.5 space-y-2 animate-fadeIn">
              <div className="flex items-center justify-between">
                <label className="block text-[10px] uppercase font-bold text-[#5a3f46]">
                  Select Famous Intermediate Soil Token:
                </label>
                <button
                  type="button"
                  onClick={() => setIsEditingHost(false)}
                  className="text-[9px] font-bold text-[#5a3f46] hover:text-black cursor-pointer"
                >
                  ✕ close
                </button>
              </div>

              {/* Quick Pick Chips */}
              <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                {FAMOUS_INTERMEDIATE_HOSTS.map(f => (
                  <button
                    key={f.symbol}
                    type="button"
                    onClick={() => handleSelectHostDirect(f.symbol)}
                    className={`px-1.5 py-0.5 border text-[10px] font-bold cursor-pointer ${
                      selectedHost === f.symbol
                        ? 'bg-[#df1871] text-white border-[#1f182a]'
                        : 'bg-white text-[#1f182a] border-[#1f182a]/40 hover:bg-[#ffd9e1]'
                    }`}
                  >
                    {f.symbol}
                  </button>
                ))}
              </div>

              {/* Or Custom input */}
              <div className="flex gap-1.5 pt-1 border-t border-[#1f182a]/20">
                <input
                  type="text"
                  placeholder="Or enter custom token (e.g. $FARTCOIN)"
                  value={customHostInput}
                  onChange={e => setCustomHostInput(e.target.value)}
                  className="w-full bg-white border border-[#1f182a] p-1 text-[11px] font-bold uppercase focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleApplyCustomHost}
                  className="bg-[#df1871] text-white px-2.5 py-1 text-[10px] font-bold uppercase border border-[#1f182a] cursor-pointer shrink-0"
                >
                  Apply
                </button>
              </div>
            </div>
          )}

          {/* Output: Symbiont Spore */}
          <div>
            <div className="flex justify-between text-[#5a3f46] mb-1">
              <span className="uppercase font-bold text-[10px]">Illustrative Output (Not Executable)</span>
              <span>Preview Only</span>
            </div>
            <div className="flex border-2 border-[#1f182a] bg-[#faf0ff]">
              <input
                type="text"
                readOnly
                value={sporeOutputAmount.toLocaleString()}
                className="w-full p-2.5 bg-transparent font-bold text-[#006d3d] text-sm focus:outline-none"
              />
              <select
                value={selectedSpore}
                onChange={e => {
                  sound.playBip(800);
                  setSelectedSpore(e.target.value);
                }}
                className="px-2 bg-[#eadef7] border-l-2 border-[#1f182a] font-bold text-[#1f182a] focus:outline-none cursor-pointer"
              >
                <option value="$SPORE">$SPORE (CashCat Prime)</option>
                <option value="$CASH-CLAW">$CASH-CLAW</option>
                <option value="$STONK-HYPHA">$STONK-HYPHA</option>
                <option value="$PIP-AGENT">$PIP-AGENT</option>
                <option value="$POP-OAT">$POP-OAT</option>
                <option value="$HAT-MYCEL">$HAT-MYCEL</option>
                <option value="$CHAD">$CHAD</option>
                <option value="$PUP-HYPHA">$PUP-HYPHA</option>
              </select>
            </div>
          </div>

          {/* Preview-only route math; no live quote or route is configured. */}
          <div className="bg-[#faf0ff] border-2 border-[#1f182a] p-3 space-y-1.5 text-[10px]">
            <div className="text-[#b60059] font-bold border-b border-[#1f182a]/20 pb-1">
              Preview only. No live pool quote or on-chain swap program is configured.
            </div>
            <div className="flex justify-between border-b border-[#1f182a]/20 pb-1">
              <span className="text-[#5a3f46]">In-Between Host Soil Pool:</span>
              <span className="font-bold text-[#1f182a]">{selectedHost} Reserves</span>
            </div>
            <div className="flex justify-between border-b border-[#1f182a]/20 pb-1">
              <span className="text-[#5a3f46]">1.00% Metabolic Fee:</span>
              <span className="font-bold text-[#b60059]">{feeAmount.toLocaleString()} {selectedSpore}</span>
            </div>
            <div className="flex justify-between border-b border-[#1f182a]/20 pb-1">
              <span className="text-[#8f0045] font-bold">🔥 50% Programmatic Burn:</span>
              <span className="font-bold text-[#b60059]">{burnHostAmount.toLocaleString()} {selectedHost}</span>
            </div>
            <div className="flex justify-between items-center pt-1">
              <span className="text-[#5a3f46]">Slippage Tolerance:</span>
              <div className="flex gap-1">
                {['0.5%', '1.0%', '1.5%'].map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSlippage(s)}
                    className={`px-1.5 py-0.5 border border-[#1f182a] cursor-pointer font-bold ${
                      slippage === s ? 'bg-[#df1871] text-white' : 'bg-white text-[#1f182a]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="button"
            disabled
            className="w-full py-3 bg-[#df1871] hover:bg-[#b60059] active:translate-x-0.5 active:translate-y-0.5 text-white font-['Space_Grotesk'] text-sm sm:text-base uppercase font-bold tracking-wider border-2 border-[#1f182a] shadow-[4px_4px_0px_#1f182a] transition-none flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">bolt</span>
            <span>
              Swap Unavailable — On-Chain Router Not Configured
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
