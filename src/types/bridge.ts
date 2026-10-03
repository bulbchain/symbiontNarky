export interface CustomBridgeHost {
  symbol: string;
  name: string;
  mintAddress: string;
  burnRatePercent: number;
  isCustom?: boolean;
  category?: 'AI & CAT' | 'AI & DOG' | 'VIRAL SENSATIONS' | 'OG RESERVOIRS' | 'CUSTOM';
  tag?: string;
}

export const FAMOUS_INTERMEDIATE_HOSTS: CustomBridgeHost[] = [
  // 1. Famous AI Cat & Cat Meme Coins (Top Featured)
  {
    symbol: '$CASHCAT',
    name: 'CashCat AI Feline Reservoir',
    mintAddress: 'CA5HCaT1KzL98vPuMp9vP12kQzCa6xjnB7YaB1pPB97q',
    burnRatePercent: 50,
    isCustom: false,
    category: 'AI & CAT',
    tag: 'PREMIER AI CAT',
  },
  {
    symbol: '$STONK',
    name: 'Stonk Cat Market Reservoir',
    mintAddress: 'SToNKCaTEKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYx',
    burnRatePercent: 50,
    isCustom: false,
    category: 'AI & CAT',
    tag: 'STONKS VIRAL',
  },
  {
    symbol: '$PIPPIN',
    name: 'Pippin Unicorn AI Cult',
    mintAddress: 'Dfh5DzRgSvvCFDoYc2ciTkMrbDfRKybA4So2gDEwpump',
    burnRatePercent: 50,
    isCustom: false,
    category: 'AI & DOG',
    tag: 'AUTONOMOUS AI',
  },
  {
    symbol: '$POPCAT',
    name: 'Popcat Feline Reservoir',
    mintAddress: '7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYpump',
    burnRatePercent: 50,
    isCustom: false,
    category: 'AI & CAT',
    tag: 'TOP CAT',
  },
  {
    symbol: '$MEW',
    name: 'cat in a dogs world',
    mintAddress: 'MEW1gQWJ3nEXg2qgERiKu7FAFj79PHvQVREQUzScPP5',
    burnRatePercent: 50,
    isCustom: false,
    category: 'AI & CAT',
    tag: 'SOLANA CAT',
  },

  // 2. Famous AI Dog & Agent Meme Coins
  {
    symbol: '$GOAT',
    name: 'Goatseus Maximus AI Pool',
    mintAddress: 'CzLSujWBLFsSjncfkh59rQDqJgCSwUiW3Q26Czehpump',
    burnRatePercent: 50,
    isCustom: false,
    category: 'AI & DOG',
    tag: 'AI AGENT PIONEER',
  },
  {
    symbol: '$ACT',
    name: 'Act I : The AI Prophecy',
    mintAddress: 'GJAFwWjJ3vnTsrQVabjBVK2TYB1YtRCQXRDfNbYpump',
    burnRatePercent: 50,
    isCustom: false,
    category: 'AI & DOG',
    tag: 'AUTONOMOUS LLM',
  },
  {
    symbol: '$WIF',
    name: 'Dogwifhat Hat Reserves',
    mintAddress: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm',
    burnRatePercent: 50,
    isCustom: false,
    category: 'AI & DOG',
    tag: 'HAT COMMUNITY',
  },

  // 3. Viral Sensations
  {
    symbol: '$PNUT',
    name: 'Peanut the Squirrel Soil',
    mintAddress: '2qEHjNzTpUhaemKhCrJimMYRmtK2hPrvSQcFoqVepump',
    burnRatePercent: 50,
    isCustom: false,
    category: 'VIRAL SENSATIONS',
    tag: 'VIRAL ICON',
  },
  {
    symbol: '$CHILLGUY',
    name: 'Just a Chill Guy Reservoir',
    mintAddress: 'Df6yfrKC8kZE3KNkrHERKzAetSxbrWeniQfyJY4Jpump',
    burnRatePercent: 50,
    isCustom: false,
    category: 'VIRAL SENSATIONS',
    tag: 'CHILL PHENOMENON',
  },
  {
    symbol: '$MOODENG',
    name: 'Moo Deng Hippo Soil',
    mintAddress: 'ED5nyyWEZyPPokBSj8GjRGjee3RsMQuaG6Cood2pump',
    burnRatePercent: 50,
    isCustom: false,
    category: 'VIRAL SENSATIONS',
    tag: 'HIPPO VIRAL',
  },
  {
    symbol: '$FWOG',
    name: 'Fwog Amphibian Pool',
    mintAddress: 'A8C3xuqscfmyLrte3VmTqrAq8kgMASius9AFNANwpump',
    burnRatePercent: 50,
    isCustom: false,
    category: 'VIRAL SENSATIONS',
    tag: 'FROG CULT',
  },

  // 4. OG Reservoirs (Kept last as requested)
  {
    symbol: '$GIGA',
    name: 'Giga Chad Bio-Mass',
    mintAddress: '63LfDmNb3MQ8mw9MtZ2To9bEA2M71kZUUGq5KEJpump',
    burnRatePercent: 50,
    isCustom: false,
    category: 'OG RESERVOIRS',
    tag: 'ALPHA CHAD',
  },
  {
    symbol: '$BONK',
    name: 'Bonk Doge Sol Reservoir',
    mintAddress: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
    burnRatePercent: 50,
    isCustom: false,
    category: 'OG RESERVOIRS',
    tag: 'LEGACY OG',
  },
];

export const DEFAULT_BRIDGE_HOSTS: CustomBridgeHost[] = FAMOUS_INTERMEDIATE_HOSTS;
