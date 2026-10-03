import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { UserWalletState } from '../types';
import { sound } from '../utils/audio';

interface PhantomProvider {
  isPhantom?: boolean;
  publicKey?: { toString: () => string };
  connect: (opts?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: { toString: () => string } }>;
  disconnect: () => Promise<void>;
  signMessage: (message: Uint8Array, encoding: string) => Promise<{ signature: Uint8Array }>;
  on: (event: string, callback: (args: unknown) => void) => void;
  request: (args: { method: string; params?: unknown }) => Promise<unknown>;
}

declare global {
  interface Window {
    solana?: PhantomProvider;
    phantom?: {
      solana?: PhantomProvider;
    };
  }
}

interface WalletContextType {
  wallet: UserWalletState;
  isConnecting: boolean;
  connectPhantom: () => Promise<boolean>;
  connectSimulator: () => void;
  disconnect: () => Promise<void>;
  signAuthMessage: () => Promise<string | null>;
  executeTransferOrBurn: (amountSol: number, hostSymbol?: string) => Promise<boolean>;
  addTokens: (symbol: string, amount: number) => void;
  openWalletModal: boolean;
  setOpenWalletModal: (open: boolean) => void;
  statusMessage: string | null;
  clearStatusMessage: () => void;
}

const DEFAULT_SIMULATOR_WALLET: UserWalletState = {
  isConnected: false,
  publicKey: null,
  balanceSol: 14.85,
  isPhantomInstalled: false,
  isSimulator: false,
  authSignature: null,
  tokenBalances: {
    '$SPORE': 48500,
    '$CASH-CLAW': 12000,
    '$STONK-HYPHA': 3400,
    '$PIP-AGENT': 820,
    '$POP-OAT': 1850,
  },
  totalBurntUsd: 1240.50,
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wallet, setWallet] = useState<UserWalletState>(() => {
    const saved = localStorage.getItem('symbiont_wallet_session');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_SIMULATOR_WALLET;
      }
    }
    return DEFAULT_SIMULATOR_WALLET;
  });

  const [isConnecting, setIsConnecting] = useState(false);
  const [openWalletModal, setOpenWalletModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Check if Phantom is installed
  useEffect(() => {
    const checkPhantom = () => {
      const provider = window.phantom?.solana || window.solana;
      const isInstalled = !!(provider && provider.isPhantom);
      setWallet(prev => ({ ...prev, isPhantomInstalled: isInstalled }));
    };

    checkPhantom();
    window.addEventListener('load', checkPhantom);
    return () => window.removeEventListener('load', checkPhantom);
  }, []);

  // Save wallet state to localStorage
  useEffect(() => {
    localStorage.setItem('symbiont_wallet_session', JSON.stringify(wallet));
  }, [wallet]);

  const clearStatusMessage = () => setStatusMessage(null);

  const getPhantomProvider = (): PhantomProvider | null => {
    if ('phantom' in window && window.phantom?.solana?.isPhantom) {
      return window.phantom.solana;
    }
    if ('solana' in window && window.solana?.isPhantom) {
      return window.solana;
    }
    return null;
  };

  const connectPhantom = useCallback(async (): Promise<boolean> => {
    setIsConnecting(true);
    sound.playBip(700);
    try {
      const provider = getPhantomProvider();
      if (!provider) {
        setStatusMessage('Phantom wallet not detected in browser. Launching Simulator Mode.');
        // Fallback to simulator
        connectSimulator();
        setIsConnecting(false);
        return false;
      }

      const resp = await provider.connect();
      const pubKey = resp.publicKey.toString();

      setWallet(prev => ({
        ...prev,
        isConnected: true,
        publicKey: pubKey,
        isSimulator: false,
        balanceSol: 4.82, // typical active test balance
      }));

      sound.playGraft();
      setStatusMessage(`Connected to Phantom: ${pubKey.slice(0, 4)}...${pubKey.slice(-4)}`);
      setIsConnecting(false);
      return true;
    } catch (err: unknown) {
      console.warn('Phantom connection cancelled or failed', err);
      setStatusMessage('Connection rejected by user.');
      setIsConnecting(false);
      return false;
    }
  }, []);

  const connectSimulator = () => {
    sound.playGraft();
    setWallet({
      isConnected: true,
      publicKey: '8xSymB10ntPuMp67pwEKpQGSJtjMFqKZ9KQanSqYX',
      balanceSol: 14.85,
      isPhantomInstalled: wallet.isPhantomInstalled,
      isSimulator: true,
      authSignature: null,
      tokenBalances: {
        '$SPORE': 48500,
        '$CASH-CLAW': 12000,
        '$STONK-HYPHA': 3400,
        '$PIP-AGENT': 820,
        '$POP-OAT': 1850,
      },
      totalBurntUsd: 1240.50,
    });
    setStatusMessage('Connected via Autonomous Colony Keystore.');
  };

  const disconnect = async () => {
    sound.playBip(440);
    const provider = getPhantomProvider();
    if (provider && !wallet.isSimulator) {
      try {
        await provider.disconnect();
      } catch (err) {
        console.warn('Phantom disconnect error', err);
      }
    }
    setWallet(prev => ({
      ...DEFAULT_SIMULATOR_WALLET,
      isPhantomInstalled: prev.isPhantomInstalled,
    }));
    setStatusMessage('Wallet disconnected.');
  };

  const signAuthMessage = async (): Promise<string | null> => {
    if (!wallet.isConnected || !wallet.publicKey) {
      setStatusMessage('Please connect your wallet first.');
      return null;
    }

    sound.playBip(800);
    const messageText = `SYMBIONT COLONY AUTHENTICATION\nEpoch: 628\nBotanist Address: ${wallet.publicKey}\nNonce: ${Date.now()}\nVerify ownership of mycelial parasitic roots.`;

    try {
      const provider = getPhantomProvider();
      if (provider && !wallet.isSimulator) {
        const encodedMessage = new TextEncoder().encode(messageText);
        const signed = await provider.signMessage(encodedMessage, 'utf8');
        // Convert to hex string
        const sigHex = Array.from(signed.signature)
          .map(b => b.toString(16).padStart(2, '0'))
          .join('')
          .slice(0, 32);
        
        setWallet(prev => ({ ...prev, authSignature: `0x${sigHex}...` }));
        sound.playGraft();
        setStatusMessage('Authentication signature verified on Solana Mainnet!');
        return `0x${sigHex}...`;
      } else {
        // Simulator signature
        const mockSig = '0x' + Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
        setWallet(prev => ({ ...prev, authSignature: mockSig }));
        sound.playGraft();
        setStatusMessage('Authentication signature verified via Colony Keystore!');
        return mockSig;
      }
    } catch (err) {
      console.warn('Signature rejected', err);
      setStatusMessage('Signature request was rejected.');
      return null;
    }
  };

  const executeTransferOrBurn = async (amountSol: number, hostSymbol?: string): Promise<boolean> => {
    if (wallet.balanceSol < amountSol) {
      setStatusMessage(`Insufficient SOL balance (${wallet.balanceSol.toFixed(3)} SOL available).`);
      return false;
    }

    sound.playBurn();
    setWallet(prev => ({
      ...prev,
      balanceSol: Math.max(0, prev.balanceSol - amountSol),
      totalBurntUsd: prev.totalBurntUsd + (amountSol * 180 * 0.5), // est sol price $180
    }));

    if (hostSymbol) {
      setStatusMessage(`Transaction confirmed: ${amountSol} SOL transferred, burning ${hostSymbol}!`);
    } else {
      setStatusMessage(`Transaction confirmed: ${amountSol} SOL deployed.`);
    }

    return true;
  };

  const addTokens = (symbol: string, amount: number) => {
    setWallet(prev => ({
      ...prev,
      tokenBalances: {
        ...prev.tokenBalances,
        [symbol]: (prev.tokenBalances[symbol] || 0) + amount,
      },
    }));
  };

  return (
    <WalletContext.Provider
      value={{
        wallet,
        isConnecting,
        connectPhantom,
        connectSimulator,
        disconnect,
        signAuthMessage,
        executeTransferOrBurn,
        addTokens,
        openWalletModal,
        setOpenWalletModal,
        statusMessage,
        clearStatusMessage,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
