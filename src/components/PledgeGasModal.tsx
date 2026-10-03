import React, { useState } from 'react';
import { IncubatingHost } from '../types';
import { useWallet } from '../context/WalletContext';
import { sound } from '../utils/audio';

interface PledgeGasModalProps {
  host: IncubatingHost | null;
  onClose: () => void;
  onPledgeSuccess: (hostId: string) => void;
}

export const PledgeGasModal: React.FC<PledgeGasModalProps> = ({
  host,
  onClose,
  onPledgeSuccess,
}) => {
  const { wallet, executeTransferOrBurn, setOpenWalletModal } = useWallet();
  const [isPledging, setIsPledging] = useState(false);

  if (!host) return null;

  const handlePledge = async () => {
    if (!wallet.isConnected) {
      sound.playBip(500);
      setOpenWalletModal(true);
      return;
    }

    setIsPledging(true);
    sound.playBurn();

    const success = await executeTransferOrBurn(0.05, host.symbol);
    if (success) {
      sound.playGraft();
      onPledgeSuccess(host.id);
      setIsPledging(false);
      onClose();
    } else {
      setIsPledging(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1f182a]/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 font-mono">
      <div className="bg-[#ffffff] border-2 border-[#1f182a] shadow-[6px_6px_0px_#1f182a] max-w-sm w-full p-4 sm:p-5">
        <div className="flex justify-between items-center border-b-2 border-[#1f182a] pb-2 mb-3">
          <span className="font-['Space_Grotesk'] text-base font-bold uppercase text-[#1f182a]">
            Pledge Inoculation Gas
          </span>
          <button
            onClick={() => {
              sound.playBip(500);
              onClose();
            }}
            className="text-base font-bold hover:text-[#df1871] cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3 text-xs mb-4 text-[#1f182a]">
          <p className="text-[#5a3f46]">
            Pledge validator gas to accelerate keeper consensus for{' '}
            <strong className="text-[#1f182a]">{host.symbol}</strong> ({host.name}).
          </p>

          <div className="bg-[#faf0ff] border-2 border-[#1f182a] p-3 space-y-2">
            <div className="flex justify-between">
              <span className="text-[#5a3f46]">Required Stake:</span>
              <span className="font-bold text-[#b60059]">0.050 SOL</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#5a3f46]">Current Quorum:</span>
              <span className="font-bold text-[#006d3d]">
                {host.signaturesCount} / {host.totalSignatures} Keepers
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#5a3f46]">Your SOL Balance:</span>
              <span className="font-bold">
                {wallet.isConnected ? `${wallet.balanceSol.toFixed(3)} SOL` : '0.00 SOL'}
              </span>
            </div>
          </div>
        </div>

        <button
          disabled={isPledging}
          onClick={handlePledge}
          className="w-full py-2.5 bg-[#df1871] hover:bg-[#b60059] active:translate-x-0.5 active:translate-y-0.5 text-white font-['Space_Grotesk'] text-sm uppercase font-bold tracking-wider border-2 border-[#1f182a] shadow-[3px_3px_0px_#1f182a] cursor-pointer disabled:opacity-50"
        >
          {isPledging
            ? 'Broadcasting to Keepers...'
            : !wallet.isConnected
            ? 'Connect Wallet to Pledge'
            : 'Confirm 0.05 SOL Inoculation'}
        </button>
      </div>
    </div>
  );
};
