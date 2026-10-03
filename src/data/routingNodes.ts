import React, { useState, useEffect } from 'react';
import { sound } from '../utils/audio';

export interface InterCellularRouteMode {
  id: string;
  name: string;
  shortLabel: string;
  category: string;
  subCategory: string;
  metric: string;
  protocolBadge: string;
  status: string;
  description: string;
  latencyMs: number;
  circuitNodes: string[];
  telemetryMetric: string;
  efficiencyRating: string;
  autoIncinerationTarget: string;
}

export const INTER_CELLULAR_CORE_MODES: InterCellularRouteMode[] = [
  {
    id: 'mycelial-dbc',
    name: 'Mycelial DBC Osmosis Core',
    shortLabel: 'DBC OSMOSIS CORE',
    category: 'Autonomous Cyber-Biological AMM',
    subCategory: 'Algorithmic Dynamic Bonding Curve',
    metric: '99.8% Sub-atomic routing efficiency',
    protocolBadge: 'V3 CPI PARASITIC AMM',
    status: 'OPTIMAL FLUID DYNAMICS',
    description: 'Autonomous cyber-biological liquidity engine that executes single-hop bonding curves via Solana cross-program invocation without relying on single meme pair pools.',
    latencyMs: 14,
    circuitNodes: ['Solana Sealevel VM', 'Mycelial Curve Matrix', 'Syntropic Tax Splitter'],
    telemetryMetric: '1.618 Golden Ratio Slippage Dispersion',
    efficiencyRating: '99.82%',
    autoIncinerationTarget: 'Irreversible Null Specimen Chamber',
  },
  {
    id: 'jupiter-cpm-mesh',
    name: 'Jupiter Ultra-Routing Matrix',
    shortLabel: 'ULTRA-ROUTING MATRIX',
    category: 'Multi-Pool Atomic Liquidity Mesh',
    subCategory: 'Dynamic Pathfinding Virtual Node',
    metric: '18 Path Algorithmic Splitter',
    protocolBadge: 'ATOMIC CPI ROUTING',
    status: 'CROSS-LIQUIDITY SYNCHRONIZED',
    description: 'Synthesizes deep order flow across Meteora DBC, Raydium CPMM, and Orca Whirlpools into a seamless low-friction corridor directly converting SOL into live spores.',
    latencyMs: 19,
    circuitNodes: ['JUP Aggregator V6', 'Dynamic Split Engine', 'Meteora DLMM Vaults'],
    telemetryMetric: '0.0004 SOL Gas Overhead',
    efficiencyRating: '99.65%',
    autoIncinerationTarget: 'Automated Buyback & Burn Registry',
  },
  {
    id: 'bio-metabolic-reactor',
    name: 'Bio-Metabolic Catalyst Chamber',
    shortLabel: 'BIO-METABOLIC CHAMBER',
    category: 'Synthetic Nutrient Fusion Reactor',
    subCategory: 'Continuous Token Combustion Pipeline',
    metric: '50% Auto-Incineration Catalyst',
    protocolBadge: 'ON-CHAIN THERMAL CPI',
    status: 'CONTINUOUS COMBUSTION',
    description: 'Hardware-verified on-chain execution unit that intercepts the 1.00% metabolic harvest fee and triggers programmatic incineration through Solana Burn CPI.',
    latencyMs: 22,
    circuitNodes: ['Nutrient Siphon Engine', 'Thermal Burn Core', 'Botanist Royalty Streamer'],
    telemetryMetric: '50.0% Realtime Yield Auto-Burn',
    efficiencyRating: '100% Irreversible',
    autoIncinerationTarget: 'Burn Address: 1nc1nerat0r111111111111111111111111111111111',
  },
  {
    id: 'meteora-dlmm-quantum',
    name: 'Meteora DLMM Liquidity Conduit',
    shortLabel: 'METEORA DLMM CONDUIT',
    category: 'Zero-Slippage Bin Concentration',
    subCategory: 'Algorithmic Active Liquidity Rails',
    metric: '69 Discrete Micro-Bins',
    protocolBadge: 'CONCENTRATED MYCELIUM',
    status: 'ACTIVE BIN BALANCED',
    description: 'Algorithmic micro-binning engine that packs specimen bonding curves into dynamic volatility ranges to ensure instantaneous fills with pinpoint capital density.',
    latencyMs: 16,
    circuitNodes: ['Discrete Bin Grid', 'Dynamic Fee Accrual', 'Volatility Stabilizer'],
    telemetryMetric: 'Zero Multi-Tx Friction',
    efficiencyRating: '99.91%',
    autoIncinerationTarget: 'CPMM Graduation Liquidity Vault',
  },
];

export const AVAILABLE_SPORES = [
  { symbol: '$SPORE', name: 'Symbiont Prime', tier: 'Embryo Prime', bonus: '+42.8%' },
  { symbol: '$HYPHA', name: 'Hypha Bloom', tier: 'Germinated Hypha', bonus: '+34.2%' },
  { symbol: '$MYCO', name: 'Golden Mycelium', tier: 'Metamorphic Spore', bonus: '+52.9%' },
  { symbol: '$CYST', name: 'Nano Cyst', tier: 'Titan Colony', bonus: '+88.1%' },
  { symbol: '$KEK-HYPHA', name: 'Kek Hypha', tier: 'High Virality', bonus: '+64.0%' },
  { symbol: '$SHIBE-BLOOM', name: 'Shibe Bloom', tier: 'Deep Mycelium', bonus: '+58.0%' },
];
