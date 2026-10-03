import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { sound } from '../utils/audio';
import { SOCIAL_LINKS } from '../constants/links';

export const WalletDrawer: React.FC = () => {
  const {
    wallet,
    openWalletModal,
    setOpenWalletModal,
    connectPhantom,
    connectSimulator,
    disconnect,
    signAuthMessage,
    isConnecting,
    statusMessage,
    clearStatusMessage,
  } = useWallet();

  const [copiedKey, setCopiedKey] = useState(false);
  const [isSigning, setIsSigning] = useState(false);

  if (!openWalletModal) return null;

  const copyKey = () => {
    if (!wallet.publicKey) return;
    sound.playBip(900);
    navigator.clipboard?.writeText(wallet.publicKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleSign = async () => {
    setIsSigning(true);
    await signAuthMessage();
    setIsSigning(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1f182a]/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#ffffff] border-2 border-[#1f182a] shadow-[6px_6px_0px_#1f182a] max-w-lg w-full font-mono max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-[#352d40] text-[#f7edff] p-3 sm:p-4 border-b-2 border-[#1f182a] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`w-3 h-3 border border-[#1f182a] ${
                wallet.isConnected ? 'bg-[#5affa3]' : 'bg-[#df1871]'
              }`}
            />
            <span className="font-['Space_Grotesk'] text-base sm:text-lg font-bold uppercase tracking-tight text-[#fef7ff]">
              Phantom Wallet &amp; Asset Vault
            </span>
          </div>
          <button
            onClick={() => {
              sound.playBip(500);
              setOpenWalletModal(false);
              clearStatusMessage();
            }}
            className="text-lg font-bold hover:text-[#df1871] cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Status Toast inside Drawer */}
        {statusMessage && (
          <div className="bg-[#faf0ff] border-b-2 border-[#1f182a] p-2.5 text-xs text-[#b60059] font-bold flex justify-between items-center">
            <span>{statusMessage}</span>
            <button
              onClick={clearStatusMessage}
              className="text-[10px] uppercase text-[#1f182a] hover:underline cursor-pointer ml-2"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Body Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">
          {!wallet.isConnected ? (
            <div className="space-y-4">
              <p className="text-[#5a3f46] leading-relaxed">
                Connect your Solana Phantom wallet to manage mutualistic spore assets, sign biological authentication receipts, and inoculate new host bonding curves.
              </p>

              {/* Connect via Phantom button */}
              <button
                disabled={isConnecting}
                onClick={async () => {
                  await connectPhantom();
                }}
                className="w-full py-3 bg-[#7658f8] hover:bg-[#5d3ade] active:translate-x-0.5 active:translate-y-0.5 text-white font-['Space_Grotesk'] text-sm sm:text-base uppercase font-bold tracking-wider border-2 border-[#1f182a] shadow-[4px_4px_0px_#1f182a] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-[#5affa3] animate-pulse"></span>
                <span>
                  {isConnecting
                    ? 'Detecting Phantom...'
                    : wallet.isPhantomInstalled
                    ? 'Connect Phantom Extension'
                    : 'Connect Phantom Wallet'}
                </span>
              </button>

              {/* Autonomous Simulator option */}
              <div className="bg-[#faf0ff] border-2 border-[#1f182a] p-3 text-center">
                <span className="text-[10px] text-[#5a3f46] uppercase font-bold block mb-1">
                  Testing Without Phantom Extension?
                </span>
                <p className="text-[11px] text-[#1f182a] mb-2">
                  Launch in Autonomous Bio-Simulator Mode with 14.85 test SOL &amp; preloaded spore specimens.
                </p>
                <button
                  onClick={connectSimulator}
                  className="px-4 py-2 bg-[#ffffff] hover:bg-[#50fd9f] hover:text-[#00210f] border-2 border-[#1f182a] font-mono text-xs font-bold uppercase shadow-[2px_2px_0px_#1f182a] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
                >
                  🚀 Launch Bio-Autonomous Keystore
                </button>
              </div>

              {!wallet.isPhantomInstalled && (
                <div className="text-center font-mono text-[10px] text-[#5a3f46]">
                  Don&apos;t have Phantom?{' '}
                  <a
                    href={SOCIAL_LINKS.phantom}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#7658f8] font-bold underline"
                  >
                    Install Phantom for Chrome/Brave/Mobile
                  </a>
                </div>
              )}
            </div>
          ) : (
            /* Connected View: Full Crypto Asset Management */
            <div className="space-y-4">
              {/* Account Information Card */}
              <div className="bg-[#faf0ff] border-2 border-[#1f182a] p-3 sm:p-4 space-y-2">
                <div className="flex items-center justify-between border-b border-[#1f182a]/30 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#006d3d] inline-block animate-ping"></span>
                    <span className="font-bold uppercase text-[10px] text-[#006d3d]">
                      {wallet.isSimulator ? 'BIO-AUTONOMOUS KEYSTORE' : 'PHANTOM CONNECTED'}
                    </span>
                  </div>
                  <span className="text-[9px] bg-[#352d40] text-[#5affa3] px-2 py-0.5 font-bold uppercase border border-[#1f182a]">
                    MAINNET-BETA
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#5a3f46] font-bold">Public Key:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-[#1f182a]">
                      {wallet.publicKey?.slice(0, 6)}...{wallet.publicKey?.slice(-6)}
                    </span>
                    <button
                      onClick={copyKey}
                      className="bg-[#ffffff] px-1.5 py-0.2 border border-[#1f182a] hover:bg-[#df1871] hover:text-white uppercase font-bold text-[9px] cursor-pointer"
                    >
                      {copiedKey ? 'COPIED' : 'COPY'}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[#5a3f46] font-bold">SOL Balance:</span>
                  <span className="font-['Space_Grotesk'] text-base font-bold text-[#1f182a]">
                    {wallet.balanceSol.toFixed(4)} SOL
                  </span>
                </div>
              </div>

              {/* Symbiont Token Portfolio */}
              <div className="space-y-2">
                <span className="text-xs uppercase font-bold text-[#1f182a] block">
                  Symbiont Spore Asset Portfolio
                </span>
                <div className="bg-[#ffffff] border-2 border-[#1f182a] divide-y divide-[#1f182a]/20">
                  {Object.entries(wallet.tokenBalances).map(([sym, qty]) => (
                    <div
                      key={sym}
                      className="p-2.5 flex items-center justify-between hover:bg-[#faf0ff]"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#df1871]" />
                        <span className="font-bold text-[#1f182a]">{sym}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold block text-[#1f182a]">
                          {qty.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-[#5a3f46]">Custodied</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Protocol Impact & Burn Stats */}
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="bg-[#ffd9e1] border-2 border-[#1f182a] p-2.5">
                  <span className="text-[9px] text-[#8f0045] uppercase font-bold block">
                    Host Scorched by You
                  </span>
                  <span className="font-['Space_Grotesk'] text-sm sm:text-base font-bold text-[#b60059]">
                    ${wallet.totalBurntUsd.toFixed(2)} USD
                  </span>
                </div>
                <div className="bg-[#f0e3fd] border-2 border-[#1f182a] p-2.5">
                  <span className="text-[9px] text-[#4719c9] uppercase font-bold block">
                    Colony Rank
                  </span>
                  <span className="font-['Space_Grotesk'] text-sm sm:text-base font-bold text-[#5d3ade]">
                    Botanist #042
                  </span>
                </div>
              </div>

              {/* Cryptographic SIWS Authentication */}
              <div className="bg-[#ffffff] border-2 border-[#1f182a] p-3 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-[#5a3f46] uppercase font-bold">
                    Cryptographic Colony Authentication
                  </span>
                  {wallet.authSignature && (
                    <span className="text-[9px] bg-[#50fd9f] text-[#00210f] px-1.5 py-0.2 font-bold uppercase border border-[#1f182a]">
                      VERIFIED
                    </span>
                  )}
                </div>

                <p className="text-[10px] text-[#5a3f46]">
                  Sign a challenge message to verify on-chain Botanist credentials without spending gas.
                </p>

                {wallet.authSignature ? (
                  <div className="bg-[#faf0ff] p-2 border border-[#1f182a] text-[9px] break-all">
                    <span className="text-[#006d3d] font-bold block">SIGNATURE:</span>
                    {wallet.authSignature}
                  </div>
                ) : (
                  <button
                    disabled={isSigning}
                    onClick={handleSign}
                    className="w-full py-2 bg-[#ffffff] hover:bg-[#f0e3fd] border-2 border-[#1f182a] font-mono text-xs uppercase font-bold shadow-[2px_2px_0px_#1f182a] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer disabled:opacity-50"
                  >
                    {isSigning ? 'Requesting Signature...' : 'Sign Authentication Ticket'}
                  </button>
                )}
              </div>

              {/* Disconnect Button */}
              <button
                onClick={async () => {
                  await disconnect();
                }}
                className="w-full py-2.5 bg-[#ffffff] hover:bg-[#ffdad6] text-[#ba1a1a] border-2 border-[#1f182a] font-mono text-xs uppercase font-bold shadow-[2px_2px_0px_#1f182a] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
              >
                Disconnect Wallet
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
