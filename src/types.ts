export interface SymbiontToken {
  id: string;
  name: string;
  symbol: string;
  hostSymbol: string;
  change24h: number;
  priceUsd: number;
  percentageBurnContribution: number;
  burnVolumeGeneratedUsd?: number;
  marketCap?: string;
  isCustom?: boolean;
}

export interface InoculationBurnEvent {
  amount: string;
  token: string;
  txHash: string;
  timeAgo: string;
  sporeName: string;
}

export interface HostSpecimen {
  id: string;
  symbol: string;
  name: string;
  subtitle: string;
  stage: string;
  stageBadge: string;
  mintAddress: string;
  avatarUrl: string;
  burntAmountText: string;
  cumulativeBurnUsd: number;
  cumulativeBurnUsdChange7d: number;
  solBioFed: number;
  attachedCount: number;
  graduatedCount: number;
  feedingVolUsd: string;
  swapsCount24h: number;
  quorumProgressPercent: number; // 0 to 100
  attachedSpores: SymbiontToken[];
  recentBurns: InoculationBurnEvent[];
  feeBurnRatePercent: number;
  categories: string[]; // e.g. ['burners', 'yield', 'new']
}

export interface IncubatingHost {
  id: string;
  symbol: string;
  name: string;
  signaturesCount: number;
  totalSignatures: number;
  estLaunchTime: string;
  isReady?: boolean;
  userPledgedSol?: number;
}

export interface LiveActivityItem {
  id: string;
  type: 'BUY' | 'SELL' | 'GRAFT';
  tokenAmount: string;
  tokenSymbol: string;
  hostSymbol: string;
  burntAmount: string;
  burntSymbol: string;
  txHash: string;
  timestamp: number;
  initSol?: string;
}

export interface UserWalletState {
  isConnected: boolean;
  publicKey: string | null;
  balanceSol: number | null;
  isPhantomInstalled: boolean;
  authSignature: string | null;
}
