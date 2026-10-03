import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { sound } from '../utils/audio';

interface DeployGraftProps {
  onDeploySuccess: (newSpore: {
    name: string;
    symbol: string;
    hostSymbol: string;
    initialBuySol: number;
    spriteUrl?: string;
  }) => void;
}

const PRESET_SPRITES = [
  {
    name: 'Neon Spore',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7Exo_zaK4cn7UhB4sgplUX7xrlmsAWTK4ENv6qgOShtTMv88RVeREcJivuZhptvuPzueeYTkd50mgFa47IlsbE-fs2Ncy3Ra486ujgXCQyBu6MIpEtGwSq3hfl8eKDK4-MjhtA28WRJWOKUEBzqOWHHw7xzfLwixibBLiJWM_c7Q5xVMK_noDW2oPCQOb9hgIp89Hi0j6tIDdtC7vN5R7GGXmYuXyBk8KpahKvXjMCuGrz8-K9zFkpw',
  },
  {
    name: 'Toxic Cap',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHSPPgoMIH_Ya7nLyrUFvaOV-qGrd30cWb8peUlCoTQImWweXEP-SUeFMvlydcvQ5yj5yR2MJZ_mGE4XTM8uB1ab5m2WWwH3tFovDkRJ5VhCrjH2NJhrKKUg1jpvOWFexxHKH5Pig_TbBN43Lxa6MhZSnFFFmURuzk8s2rFNOokrpAl1DwE-OXJqviCoaC5CuowSKO1yq_4TDXEZbp4otJrV2NtQoCHZf8ucvwUdED5DmZfphbDYx1nA',
  },
  {
    name: 'Hypha Bloom',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKZVsFrUJ531_tnhY_lX5v0UmMR8WIKNoJr74pv2xJ5VqV5CI2a1SnZVwMBP9B9MnSlh21grSDiLFfCN1irnBrCIWMeIKwjpX19_7EgvvOCftAS-RLN8G_djPKe2Eed0cyWicFdsIBTrJSNB8n1qBZ_6J-2F3I2ym5ncRHM19dj4TJ9QlA3DRz3BZW48mOZYQedUNJnSwyDd_ev76hMR84sVXf96_dmBvM1B-RuD-zfFdvQ2Z5RPLUww',
  },
];

export const DeployGraftSection: React.FC<DeployGraftProps> = ({ onDeploySuccess }) => {
  const { wallet, executeTransferOrBurn, setOpenWalletModal } = useWallet();

  const [selectedHost, setSelectedHost] = useState('$CASHCAT');
  const [customMintAddress, setCustomMintAddress] = useState('');
  const [specimenName, setSpecimenName] = useState('Golden Mycelium');
  const [specimenTicker, setSpecimenTicker] = useState('$MYCO');
  const [devBuyPercent, setDevBuyPercent] = useState<number>(10);
  const [customSolAmount, setCustomSolAmount] = useState<string>('0.5');
  const [selectedSpriteIndex, setSelectedSpriteIndex] = useState(0);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploySuccessMessage, setDeploySuccessMessage] = useState<string | null>(null);

  const baseDeployFee = 0.050; // Solana account rent 0.024 + Meteora 0.026
  const botanistSol = parseFloat(customSolAmount) || 0;
  const totalRequiredSol = baseDeployFee + botanistSol;

  const handleDeploy = async () => {
    if (!wallet.isConnected) {
      sound.playBip(500);
      setOpenWalletModal(true);
      return;
    }

    if (!specimenName || !specimenTicker) {
      alert('Please enter specimen name and ticker symbol.');
      return;
    }

    setIsDeploying(true);
    sound.playBurn();

    const success = await executeTransferOrBurn(totalRequiredSol, selectedHost);
    if (success) {
      sound.playGraft();
      const newSpore = {
        name: specimenName,
        symbol: specimenTicker.startsWith('$') ? specimenTicker : `$${specimenTicker}`,
        hostSymbol: selectedHost,
        initialBuySol: botanistSol,
        spriteUrl: PRESET_SPRITES[selectedSpriteIndex]?.url,
      };

      onDeploySuccess(newSpore);
      setDeploySuccessMessage(`Specimen ${newSpore.symbol} successfully inoculated into ${selectedHost} host tree!`);
      setTimeout(() => setDeploySuccessMessage(null), 5000);
    }
    setIsDeploying(false);
  };

  return (
    <section className="w-full mb-8" id="graft-form">
      <div className="bg-[#ffffff] border-2 border-[#1f182a] shadow-[6px_6px_0px_#1f182a] overflow-hidden">
        {/* Terminal Header */}
        <div className="bg-[#352d40] text-[#f7edff] px-4 py-2 border-b-2 border-[#1f182a] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-[#b60059] border border-[#1f182a] inline-block"></span>
            <span className="w-3 h-3 bg-[#5affa3] border border-[#1f182a] inline-block"></span>
            <span className="w-3 h-3 bg-[#ffffff] border border-[#1f182a] inline-block"></span>
            <span className="font-mono text-xs sm:text-sm uppercase tracking-wider ml-1 text-[#fef7ff] font-bold">
              BIO-INOCULATOR TERMINAL // DEPLOY NEW SPECIMEN
            </span>
          </div>
          <span className="font-mono text-[10px] text-[#5affa3] font-bold hidden sm:inline">
            PROGRAM: v2.4.0
          </span>
        </div>

        {/* Lab Form Contents */}
        <div className="p-4 sm:p-6">
          {deploySuccessMessage && (
            <div className="mb-4 p-3 bg-[#50fd9f] text-[#00210f] border-2 border-[#1f182a] font-mono text-xs font-bold flex items-center justify-between">
              <span>🌱 {deploySuccessMessage}</span>
              <button
                onClick={() => setDeploySuccessMessage(null)}
                className="text-xs uppercase underline cursor-pointer"
              >
                DISMISS
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            {/* Left Column: Parameters */}
            <div className="flex flex-col gap-4 font-mono">
              {/* Step 1 */}
              <div>
                <label className="block text-xs uppercase font-bold text-[#1f182a] mb-1.5">
                  Step 1: Target Host Organism (Base Token)
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {['$CASHCAT', '$STONK', '$PIPPIN', '$POPCAT', '$GOAT', '$ACT', '$WIF', '$GIGA', '$BONK'].map(token => (
                    <button
                      key={token}
                      type="button"
                      onClick={() => {
                        sound.playBip(800);
                        setSelectedHost(token);
                      }}
                      className={`border border-[#1f182a] px-2.5 py-1 text-xs font-bold uppercase cursor-pointer ${
                        selectedHost === token
                          ? 'bg-[#b60059] text-white shadow-[2px_2px_0px_#1f182a]'
                          : 'bg-[#eadef7] text-[#1f182a] hover:bg-[#faf0ff]'
                      }`}
                    >
                      {token}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={customMintAddress}
                  onChange={e => setCustomMintAddress(e.target.value)}
                  placeholder="Or enter Solana Mint Address (e.g. DezX...)"
                  className="w-full bg-[#faf0ff] border-2 border-[#1f182a] p-2 text-xs text-[#1f182a] focus:outline-none focus:border-[#df1871]"
                />
              </div>

              {/* Step 2 */}
              <div>
                <label className="block text-xs uppercase font-bold text-[#1f182a] mb-1.5">
                  Step 2: Specimen Name &amp; Ticker
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={specimenName}
                    onChange={e => setSpecimenName(e.target.value)}
                    placeholder="e.g. Golden Mycelium"
                    className="w-full bg-[#faf0ff] border-2 border-[#1f182a] p-2 text-xs text-[#1f182a] focus:outline-none focus:border-[#df1871]"
                  />
                  <input
                    type="text"
                    value={specimenTicker}
                    onChange={e => setSpecimenTicker(e.target.value.toUpperCase())}
                    placeholder="e.g. $MYCO"
                    className="w-full bg-[#faf0ff] border-2 border-[#1f182a] p-2 text-xs text-[#1f182a] uppercase font-bold focus:outline-none focus:border-[#df1871]"
                  />
                </div>
              </div>

              {/* Step 3: Dev Buy */}
              <div>
                <label className="block text-xs uppercase font-bold text-[#1f182a] mb-1.5">
                  Step 3: Initial Botanist Graft Buy (Dev Allocation)
                </label>
                <div className="grid grid-cols-4 gap-1.5 mb-2 text-xs">
                  {[0, 10, 20, 50].map(pct => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => {
                        sound.playBip(700);
                        setDevBuyPercent(pct);
                        setCustomSolAmount((pct * 0.05).toFixed(2));
                      }}
                      className={`border border-[#1f182a] py-1 text-center font-bold cursor-pointer ${
                        devBuyPercent === pct
                          ? 'bg-[#b60059] text-white shadow-[1px_1px_0px_#1f182a]'
                          : 'bg-[#eadef7] text-[#1f182a] hover:bg-[#faf0ff]'
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={customSolAmount}
                  onChange={e => setCustomSolAmount(e.target.value)}
                  placeholder="Custom SOL amount (e.g. 0.5 SOL)"
                  className="w-full bg-[#faf0ff] border-2 border-[#1f182a] p-2 text-xs text-[#1f182a] focus:outline-none focus:border-[#df1871]"
                />
              </div>
            </div>

            {/* Right Column: Dropzone Artwork & Live Specimen Preview */}
            <div className="flex flex-col gap-4 font-mono">
              <div>
                <label className="block text-xs uppercase font-bold text-[#1f182a] mb-1.5">
                  Step 4: Specimen Pixel Artwork Dropzone
                </label>
                <div className="border-2 border-dashed border-[#1f182a] bg-[#faf0ff] p-4 text-center cursor-pointer hover:bg-[#f0e3fd]">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    {PRESET_SPRITES.map((sprite, idx) => (
                      <div
                        key={sprite.name}
                        onClick={() => {
                          sound.playBip(850);
                          setSelectedSpriteIndex(idx);
                        }}
                        className={`w-12 h-12 p-1 border-2 border-[#1f182a] bg-white cursor-pointer ${
                          selectedSpriteIndex === idx ? 'ring-2 ring-[#df1871] scale-105' : 'opacity-80'
                        }`}
                        title={sprite.name}
                      >
                        <img
                          src={sprite.url}
                          alt={sprite.name}
                          className="w-full h-full object-contain pixelated"
                        />
                      </div>
                    ))}
                  </div>
                  <span className="block text-[11px] text-[#1f182a] uppercase font-bold">
                    Select Sprite or Drag PNG/GIF
                  </span>
                  <span className="block text-[10px] text-[#5a3f46]">
                    Active: {PRESET_SPRITES[selectedSpriteIndex]?.name} (64x64 pixel resolution)
                  </span>
                </div>
              </div>

              {/* Estimated Deploy Stats */}
              <div className="bg-[#eadef7] border-2 border-[#1f182a] p-3 text-xs">
                <span className="text-[#5a3f46] uppercase block mb-1.5 font-bold">
                  DEPLOYMENT LEDGER SUMMARY
                </span>
                <div className="flex justify-between py-1 border-b border-[#1f182a]/20">
                  <span>Solana Account Rent:</span>
                  <span className="font-bold">0.024 SOL</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#1f182a]/20">
                  <span>Meteora DBC Inoculation:</span>
                  <span className="font-bold">0.026 SOL</span>
                </div>
                {botanistSol > 0 && (
                  <div className="flex justify-between py-1 border-b border-[#1f182a]/20">
                    <span>Botanist First Buy ({selectedHost}):</span>
                    <span className="font-bold">{botanistSol} SOL</span>
                  </div>
                )}
                <div className="flex justify-between py-1 font-bold text-[#b60059]">
                  <span>ESTIMATED TOTAL DEPLOY COST:</span>
                  <span>{totalRequiredSol.toFixed(3)} SOL</span>
                </div>
              </div>
            </div>
          </div>

          {/* Terminal Submit CTA */}
          <button
            type="button"
            disabled={isDeploying}
            onClick={handleDeploy}
            className="w-full bg-[#df1871] hover:bg-[#b60059] text-white border-2 border-[#1f182a] py-3 font-['Space_Grotesk'] text-base sm:text-lg uppercase font-bold tracking-wider shadow-[4px_4px_0px_#1f182a] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none transition-none flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span className="material-symbols-outlined">flare</span>
            <span>
              {isDeploying
                ? 'Broadcasting Inoculation Tx to Solana...'
                : `Inoculate & Deploy Graft (Est. ${totalRequiredSol.toFixed(3)} SOL)`}
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};
