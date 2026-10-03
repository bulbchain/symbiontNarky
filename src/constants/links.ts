export const SITE_NAME = 'Symbiont';
export const SITE_TAGLINE = 'Parasitic Cyber-Biological Token Protocol';

export const PROTOCOL_CA = 'coming soon...';
export const PROTOCOL_CA_SHORT = 'coming soon...';

/**
 * Pump.fun URL for official Symbiont protocol bonding curve
 */
export const PUMPFUN_URL = `https://pump.fun/coin/${PROTOCOL_CA}`;

/**
 * Single source of truth for all social links and official platforms
 * Strictly only pump.fun and Twitter (X) across the entire application as requested.
 */
export const SOCIAL_LINKS = {
  twitter: 'https://x.com/symbiont_sol',
  x: 'https://x.com/symbiont_sol',
  pumpfun: PUMPFUN_URL,
  docs: '#docs',
  phantom: 'https://phantom.app',
} as const;

/**
 * Host Token Official Contract Addresses (Solana Mints)
 * Prioritizing modern AI Cat, AI Dog & Viral meme coins, moving Bonk to the end.
 */
export const HOST_CONTRACT_ADDRESSES = {
  CASHCAT: '0x020bfC650A365f8BB26819deAAbF3E21291018b4',
  STONK: '6GmAFSYs4gk3FDao5FzzySQpPZaWsa4rUJHacpMpUNgx',
  PIPPIN: 'Dfh5DzRgSvvCFDoYc2ciTkMrbDfRKybA4SoFbPmApump',
  POPCAT: '7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr',
  GOAT: 'CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump',
  ACT: 'GJAFwWjJ3vnTsrQVabjBVK2TYB1YtRCQXRDfDgUnpump',
  WIF: '5tCju6YNxHq5zrA6tGndr6F7TK42mpUFmeE31cSFpump',
  GIGA: '63LfDmNb3MQ8mw9MtZ2To9bEA2M71kZUUGq5tiJxcqj9',
  BONK: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
} as const;

/**
 * Helper to build pump.fun URL for any mint address
 */
export const getPumpfunUrl = (mintAddress: string): string => {
  return `https://pump.fun/coin/${mintAddress}`;
};

/**
 * Helper to build Solscan Token URL for any mint address
 */
export const getSolscanUrl = (mintAddress: string): string => {
  return `https://solscan.io/token/${mintAddress}`;
};
