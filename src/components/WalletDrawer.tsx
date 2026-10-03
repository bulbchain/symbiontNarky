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
                Connect Phantom to read your Solana public key and live SOL balance. Swaps, transfers, burns, pledges, and deployments are unavailable until their on-chain programs are configured.
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
            /* Connected View */
            <div className="space-y-4">
              {/* Account Information Card */}
              <div className="bg-[#faf0ff] border-2 border-[#1f182a] p-3 sm:p-4 space-y-2">
                <div className="flex items-center justify-between border-b border-[#1f182a]/30 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#006d3d] inline-block animate-ping"></span>
                    <span className="font-bold uppercase text-[10px] text-[#006d3d]">
                      PHANTOM CONNECTED
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
                    {wallet.balanceSol === null ? 'Unavailable' : `${wallet.balanceSol.toFixed(4)} SOL`}
                  </span>
                </div>
              </div>

              <div className="bg-[#faf0ff] border-2 border-[#1f182a] p-3 text-[10px] text-[#5a3f46]">
                Only the native SOL balance is read from Solana. Token holdings and protocol activity are not connected to an indexer.
              </div>

              {/* Cryptographic SIWS Authentication */}
              <div className="bg-[#ffffff] border-2 border-[#1f182a] p-3 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-[#5a3f46] uppercase font-bold">
                    Phantom Message Signature
                  </span>
                  {wallet.authSignature && (
                    <span className="text-[9px] bg-[#50fd9f] text-[#00210f] px-1.5 py-0.2 font-bold uppercase border border-[#1f182a]">
                      SIGNED
                    </span>
                  )}
                </div>

                <p className="text-[10px] text-[#5a3f46]">
                  Sign a message with Phantom without spending gas. This app does not currently verify signatures on a server.
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
