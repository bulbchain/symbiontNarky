import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { sound } from '../utils/audio';
import { SOCIAL_LINKS } from '../constants/links';
import { PixelMushroomLogo } from './PixelMushroomLogo';

interface HeaderProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onOpenDocs: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onTabChange, onOpenDocs }) => {
  const { wallet, setOpenWalletModal } = useWallet();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (tab: string) => {
    sound.playBip(800);
    onTabChange(tab);
    setMobileMenuOpen(false);
  };

  const navItems = [
    { id: 'how-it-feeds', label: 'How it Feeds' },
    { id: 'spore-register', label: 'The Spore Register' },
    { id: 'graft-a-host', label: 'Graft a Host' },
    { id: 'colony-live-feed', label: 'Colony Live Feed' },
    { id: 'docs', label: 'Ecosystem Docs', action: onOpenDocs },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-40 bg-[#ffffff] border-b-2 border-[#1f182a] shadow-[0_3px_0px_#1f182a]">
      {/* Top Telemetry Strip */}
      <div className="bg-[#352d40] text-[#f7edff] px-3 sm:px-4 py-1 font-mono text-[9px] sm:text-[10px] border-b border-[#1f182a] flex items-center justify-between overflow-x-auto select-none">
        <div className="flex items-center gap-3 sm:gap-4 whitespace-nowrap">
          <span className="flex items-center gap-1.5 text-[#5affa3]">
            <span className="w-2 h-2 bg-[#5affa3] inline-block animate-pulse"></span>
            NODE: SOLANA MAINNET-BETA
          </span>
          <span className="text-[#e2bdc5]">|</span>
          <span>EPOCH: 628</span>
          <span className="text-[#e2bdc5]">|</span>
          <span className="text-[#ffd9e1]">PARASITIC RATIO: 1.618</span>
        </div>
        <div className="hidden md:flex items-center gap-4 uppercase whitespace-nowrap">
          <span>LIVE HOSTS: <strong className="text-[#5affa3]">14</strong></span>
          <span className="text-[#e2bdc5]">/</span>
          <span>TOTAL NURTURED: <strong className="text-[#ffb1c5]">4,820 SOL</strong></span>
          <span className="text-[#e2bdc5]">/</span>
          <span>BURNT: <strong className="text-[#ffd9e1]">42.8%</strong></span>
        </div>
      </div>

      {/* Main Bar */}
      <div className="h-16 max-w-[1140px] mx-auto px-3 sm:px-4 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand */}
        <div
          onClick={() => handleNav('how-it-feeds')}
          className="flex items-center gap-2.5 sm:gap-3 shrink-0 cursor-pointer select-none group"
        >
          <PixelMushroomLogo size={34} />
          <div className="flex flex-col">
            <span className="font-['Space_Grotesk'] text-lg sm:text-xl font-bold tracking-tight text-[#1f182a] leading-none uppercase group-hover:text-[#df1871] transition-none">
              Symbiont
            </span>
            <span className="font-mono text-[9px] bg-[#eadef7] border border-[#1f182a] text-[#5a3f46] px-1 mt-0.5 tracking-wider font-bold">
              SOLANA COLONY - V2.4
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1.5 font-mono text-[11px] uppercase">
          {navItems.map(item => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => (item.action ? item.action() : handleNav(item.id))}
                className={`px-2.5 py-1.5 border-2 transition-none cursor-pointer font-bold ${
                  isActive
                    ? 'bg-[#df1871] text-[#fffbff] border-[#1f182a] shadow-[2px_2px_0px_#1f182a]'
                    : 'border-transparent text-[#5a3f46] hover:text-[#1f182a] hover:border-[#1f182a]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Action: Wallet Connect & Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Social Links from Constants (Strictly Twitter and Pump.fun only) */}
          <div className="hidden sm:flex items-center gap-1 font-mono text-[10px]">
            <a
              href={SOCIAL_LINKS.x}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 bg-[#faf0ff] hover:bg-[#df1871] hover:text-white border border-[#1f182a] text-[#1f182a] transition-none flex items-center justify-center font-bold"
              title="Official Twitter / X"
              aria-label="Twitter / X"
            >
              𝕏
            </a>
            <a
              href={SOCIAL_LINKS.pumpfun}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 py-1 bg-[#5affa3] hover:bg-[#1f182a] hover:text-[#5affa3] border border-[#1f182a] text-[#004724] transition-none flex items-center gap-1 font-bold text-[10px] uppercase shadow-[1px_1px_0px_#1f182a]"
              title="Trade on Pump.fun"
              aria-label="Pump.fun"
            >
              <span>💊 PUMP.FUN</span>
            </a>
          </div>

          <button
            onClick={() => {
              sound.playBip(900);
              setOpenWalletModal(true);
            }}
            className="font-mono text-[11px] sm:text-[12px] font-bold uppercase px-2.5 sm:px-3.5 py-1.5 bg-[#df1871] text-[#fffbff] border-2 border-[#1f182a] shadow-[3px_3px_0px_#1f182a] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-none cursor-pointer flex items-center gap-1.5"
          >
            <span
              className={`w-2 h-2 inline-block ${
                wallet.isConnected ? 'bg-[#5affa3]' : 'bg-[#ffffff]'
              }`}
            ></span>
            <span>
              {wallet.isConnected && wallet.publicKey
                ? `${wallet.publicKey.slice(0, 4)}...${wallet.publicKey.slice(-4)}`
                : 'Connect Wallet'}
            </span>
          </button>

          <button
            onClick={() => {
              sound.playBip(900);
              setOpenWalletModal(true);
            }}
            aria-label="User Account"
            className="w-8 h-8 rounded-full bg-[#b60059] flex items-center justify-center border-2 border-[#1f182a] shadow-[2px_2px_0px_#1f182a] cursor-pointer hover:opacity-90"
          >
            <span className="material-symbols-outlined text-[#ffffff] text-[18px]">
              {wallet.isConnected ? 'account_balance_wallet' : 'person'}
            </span>
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 border-2 border-[#1f182a] bg-[#f5eaff] shadow-[2px_2px_0px_#1f182a] cursor-pointer"
            aria-label="Toggle Navigation"
          >
            <span className="material-symbols-outlined text-[20px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#fef7ff] border-t-2 border-[#1f182a] px-4 py-3 flex flex-col gap-2 font-mono text-xs">
          {navItems.map(item => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => (item.action ? item.action() : handleNav(item.id))}
                className={`w-full text-left px-3 py-2 border-2 uppercase font-bold ${
                  isActive
                    ? 'bg-[#df1871] text-white border-[#1f182a] shadow-[2px_2px_0px_#1f182a]'
                    : 'bg-white border-[#1f182a] text-[#1f182a]'
                }`}
              >
                {item.label}
              </button>
            );
          })}

          <div className="flex items-center gap-2 pt-2 border-t border-[#1f182a]/20 mt-1">
            <a
              href={SOCIAL_LINKS.x}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center py-1.5 bg-[#faf0ff] border border-[#1f182a] font-bold text-[10px]"
            >
              𝕏 Twitter
            </a>
            <a
              href={SOCIAL_LINKS.pumpfun}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center py-1.5 bg-[#5affa3] text-[#004724] border border-[#1f182a] font-bold text-[10px]"
            >
              💊 Pump.fun
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
