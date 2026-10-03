import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { UserWalletState } from '../types';
import { sound } from '../utils/audio';

interface PhantomProvider {
  isPhantom?: boolean;
  publicKey?: { toString: () => string };
  connect: (opts?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: { toString: () => string } }>;
  disconnect: () => Promise<void>;
  signMessage?: (message: Uint8Array, encoding: string) => Promise<{ signature: Uint8Array }>;
  on: (event: string, callback: (args: unknown) => void) => void;
  off?: (event: string, callback: (args: unknown) => void) => void;
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
  disconnect: () => Promise<void>;
  signAuthMessage: () => Promise<string | null>;
  openWalletModal: boolean;
  setOpenWalletModal: (open: boolean) => void;
  statusMessage: string | null;
  clearStatusMessage: () => void;
}

const EMPTY_WALLET: UserWalletState = {
  isConnected: false,
  publicKey: null,
  balanceSol: null,
  isPhantomInstalled: false,
  authSignature: null,
};

const SOLANA_RPC_URL =
  import.meta.env.VITE_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';

const WalletContext = createContext<WalletContextType | undefined>(undefined);

async function fetchSolBalance(publicKey: string): Promise<number> {
  const response = await fetch(SOLANA_RPC_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'getBalance',
      params: [publicKey, { commitment: 'confirmed' }],
    }),
  });

  if (!response.ok) {
    throw new Error(`Solana RPC returned HTTP ${response.status}.`);
  }

  const payload: unknown = await response.json();
  if (typeof payload !== 'object' || payload === null) {
    throw new Error('Solana RPC returned an invalid response.');
  }

  if ('error' in payload) {
    const rpcError = payload.error;
    const message =
      typeof rpcError === 'object' && rpcError !== null && 'message' in rpcError
        ? rpcError.message
        : null;
    throw new Error(typeof message === 'string' ? message : 'Solana RPC balance request failed.');
  }

  if (!('result' in payload) || typeof payload.result !== 'object' || payload.result === null) {
    throw new Error('Solana RPC response did not include a balance.');
  }

  const lamports = 'value' in payload.result ? payload.result.value : null;
  if (typeof lamports !== 'number' || !Number.isFinite(lamports) || lamports < 0) {
    throw new Error('Solana RPC returned an invalid balance.');
  }

  return lamports / 1_000_000_000;
}

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wallet, setWallet] = useState<UserWalletState>(EMPTY_WALLET);
  const [isConnecting, setIsConnecting] = useState(false);
  const [openWalletModal, setOpenWalletModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const getPhantomProvider = useCallback((): PhantomProvider | null => {
    if (window.phantom?.solana?.isPhantom) return window.phantom.solana;
    if (window.solana?.isPhantom) return window.solana;
    return null;
  }, []);

  const updateConnectedWallet = useCallback(async (publicKey: string) => {
    setWallet(previous => ({
      ...previous,
      isConnected: true,
      isPhantomInstalled: true,
      publicKey,
      balanceSol: null,
      authSignature: previous.publicKey === publicKey ? previous.authSignature : null,
    }));

    try {
      const balanceSol = await fetchSolBalance(publicKey);
      setWallet(previous =>
        previous.publicKey === publicKey ? { ...previous, balanceSol } : previous
      );
    } catch (error) {
      console.error('Unable to fetch Solana wallet balance.', error);
      setStatusMessage('Phantom connected, but the SOL balance could not be loaded. Check the RPC connection and try again.');
    }
  }, []);

  useEffect(() => {
    const provider = getPhantomProvider();
    setWallet(previous => ({
      ...previous,
      isPhantomInstalled: provider !== null,
    }));

    if (!provider) return;

    const handleAccountChanged = () => {
      const publicKey = provider.publicKey?.toString();
      if (publicKey) {
        void updateConnectedWallet(publicKey);
      } else {
        setWallet(previous => ({
          ...EMPTY_WALLET,
          isPhantomInstalled: previous.isPhantomInstalled,
        }));
        setStatusMessage('Phantom wallet disconnected.');
      }
    };
    const handleDisconnect = () => {
      setWallet(previous => ({
        ...EMPTY_WALLET,
        isPhantomInstalled: previous.isPhantomInstalled,
      }));
      setStatusMessage('Phantom wallet disconnected.');
    };

    provider.on('accountChanged', handleAccountChanged);
    provider.on('disconnect', handleDisconnect);

    if (provider.publicKey) {
      void updateConnectedWallet(provider.publicKey.toString());
    }

    return () => {
      provider.off?.('accountChanged', handleAccountChanged);
      provider.off?.('disconnect', handleDisconnect);
    };
  }, [getPhantomProvider, updateConnectedWallet]);

  useEffect(() => {
    if (!wallet.isConnected || !wallet.publicKey) return;
    const publicKey = wallet.publicKey;

    const refreshBalance = async () => {
      try {
        const balanceSol = await fetchSolBalance(publicKey);
        setWallet(previous =>
          previous.publicKey === publicKey ? { ...previous, balanceSol } : previous
        );
      } catch (error) {
        console.error('Unable to refresh Solana wallet balance.', error);
        setStatusMessage('Unable to refresh the SOL balance. The displayed balance may be out of date.');
      }
    };

    const intervalId = window.setInterval(() => {
      void refreshBalance();
    }, 30_000);
    return () => window.clearInterval(intervalId);
  }, [wallet.isConnected, wallet.publicKey]);

  const clearStatusMessage = () => setStatusMessage(null);

  const connectPhantom = useCallback(async (): Promise<boolean> => {
    setIsConnecting(true);
    sound.playBip(700);

    try {
      const provider = getPhantomProvider();
      if (!provider) {
        setStatusMessage('Phantom wallet was not detected. Install or enable the Phantom extension and try again.');
        return false;
      }

      const response = await provider.connect();
      const publicKey = response.publicKey.toString();
      setStatusMessage(`Connected to Phantom: ${publicKey.slice(0, 4)}...${publicKey.slice(-4)}`);
      await updateConnectedWallet(publicKey);
      sound.playGraft();
      return true;
    } catch (error) {
      console.warn('Phantom connection failed or was rejected.', error);
      setStatusMessage('Phantom connection failed or was rejected.');
      return false;
    } finally {
      setIsConnecting(false);
    }
  }, [getPhantomProvider, updateConnectedWallet]);

  const disconnect = async () => {
    sound.playBip(440);
    const provider = getPhantomProvider();

    if (provider && wallet.isConnected) {
      try {
        await provider.disconnect();
      } catch (error) {
        console.error('Phantom disconnect failed.', error);
        setStatusMessage('Could not disconnect from Phantom. Please try again in the wallet extension.');
        return;
      }
    }

    setWallet(previous => ({
      ...EMPTY_WALLET,
      isPhantomInstalled: previous.isPhantomInstalled,
    }));
    setStatusMessage('Wallet disconnected.');
  };

  const signAuthMessage = async (): Promise<string | null> => {
    if (!wallet.isConnected || !wallet.publicKey) {
      setStatusMessage('Please connect your Phantom wallet first.');
      return null;
    }

    const provider = getPhantomProvider();
    if (!provider?.signMessage) {
      setStatusMessage('This Phantom provider does not support message signing.');
      return null;
    }
    if (provider.publicKey?.toString() !== wallet.publicKey) {
      setStatusMessage('The connected Phantom account changed. Reconnect before signing.');
      return null;
    }

    sound.playBip(800);
    const messageText = `SYMBIONT COLONY AUTHENTICATION\nAddress: ${wallet.publicKey}\nNonce: ${crypto.randomUUID()}\nSign in to Symbiont. This does not authorize a transaction.`;

    try {
      const signed = await provider.signMessage(new TextEncoder().encode(messageText), 'utf8');
      const signature = Array.from(signed.signature)
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('');

      setWallet(previous =>
        previous.publicKey === wallet.publicKey
          ? { ...previous, authSignature: signature }
          : previous
      );
      sound.playGraft();
      setStatusMessage('Message signed by Phantom. The signature has not been verified by a server.');
      return signature;
    } catch (error) {
      console.warn('Phantom message signing failed or was rejected.', error);
      setStatusMessage('Message signing failed or was rejected.');
      return null;
    }
  };

  return (
    <WalletContext.Provider
      value={{
        wallet,
        isConnecting,
        connectPhantom,
        disconnect,
        signAuthMessage,
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
