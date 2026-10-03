import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { sound } from '../utils/audio';

export interface TelemetryDataPoint {
  hour: string;
  incineratedTokens: number; // e.g. in thousands (k)
  bondedSpores: number;
  solBurnt: number;
}

// Generate realistic 24-hour telemetry curve
export const generate24hTelemetryData = (): TelemetryDataPoint[] => {
  const data: TelemetryDataPoint[] = [];
  const hours = [
    '00:00', '01:00', '02:00', '03:00', '04:00', '05:00',
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00', '22:00', 'NOW',
  ];

  // Base harmonic curve with natural fluctuations
  hours.forEach((h, idx) => {
    const cycle = Math.sin((idx / 24) * Math.PI * 2) * 0.35 + 1;
    const noise = (Math.sin(idx * 7) + 1) * 0.2;
    const incineratedTokens = Math.round((75 + cycle * 55 + noise * 40) * 1000);
    const bondedSpores = Math.round(3 + cycle * 5 + (idx % 3 === 0 ? 3 : 0));
    const solBurnt = +(incineratedTokens * 0.00028).toFixed(2);

    data.push({
      hour: h,
      incineratedTokens,
      bondedSpores,
      solBurnt,
    });
  });

  return data;
};

interface ColonyTelemetryChartProps {
  bonusBurn?: number;
  bonusSpores?: number;
}

export const ColonyTelemetryChart: React.FC<ColonyTelemetryChartProps> = ({
  bonusBurn = 0,
  bonusSpores = 0,
}) => {
  const [metricFilter, setMetricFilter] = useState<'both' | 'burns' | 'spores'>('both');
  const [chartType, setChartType] = useState<'area' | 'bar'>('area');

  const baseData = useMemo(() => generate24hTelemetryData(), []);

  // Incorporate real-time bonus ticks into the latest hour
  const chartData = useMemo(() => {
    return baseData.map((pt, i) => {
      if (i === baseData.length - 1) {
        return {
          ...pt,
          incineratedTokens: pt.incineratedTokens + bonusBurn,
          bondedSpores: pt.bondedSpores + bonusSpores,
          solBurnt: +(pt.solBurnt + bonusBurn * 0.00028).toFixed(2),
        };
      }
      return pt;
    });
  }, [baseData, bonusBurn, bonusSpores]);

  // Aggregate totals
  const totalBurnTokens = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.incineratedTokens, 0);
  }, [chartData]);

  const totalBonded = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.bondedSpores, 0);
  }, [chartData]);

  const totalSolScorched = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.solBurnt, 0).toFixed(1);
  }, [chartData]);

  return (
    <div className="bg-[#ffffff] border-2 border-[#1f182a] shadow-[4px_4px_0px_#1f182a] p-3 sm:p-5 mb-5 font-mono">
      {/* Chart Top Controls & Telemetry Readouts */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b-2 border-[#1f182a] pb-3 mb-4 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#df1871] border border-[#1f182a] inline-block animate-pulse"></span>
            <span className="text-[10px] sm:text-[11px] bg-[#352d40] text-[#5affa3] px-2 py-0.5 border border-[#1f182a] uppercase font-bold">
              24H DUAL-STREAM TELEMETRY
            </span>
            <span className="text-[10px] text-[#006d3d] font-bold hidden sm:inline">
              LIVE METEORA DBC / SOLANA CPI
            </span>
          </div>
          <h3 className="font-['Space_Grotesk'] text-lg sm:text-xl font-bold uppercase text-[#1f182a] mt-1 leading-none">
            Incinerated Tokens vs. Newly Bonded Spores
          </h3>
          <p className="text-[11px] text-[#5a3f46] mt-0.5">
            Continuous 24-hour metabolic velocity tracking auto-burned host tokens and freshly germinated mycelial specimens.
          </p>
        </div>

        {/* Filters & Mode Toggles */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto text-[10px]">
          {/* Metric Selector */}
          <div className="flex items-center border-2 border-[#1f182a] bg-[#faf0ff] p-0.5">
            <button
              onClick={() => {
                sound.playBip(700);
                setMetricFilter('both');
              }}
              className={`px-2 py-1 font-bold uppercase cursor-pointer ${
                metricFilter === 'both'
                  ? 'bg-[#df1871] text-white shadow-[1px_1px_0px_#1f182a]'
                  : 'text-[#1f182a] hover:bg-[#eadef7]'
              }`}
            >
              All Streams
            </button>
            <button
              onClick={() => {
                sound.playBip(700);
                setMetricFilter('burns');
              }}
              className={`px-2 py-1 font-bold uppercase cursor-pointer ${
                metricFilter === 'burns'
                  ? 'bg-[#b60059] text-white shadow-[1px_1px_0px_#1f182a]'
                  : 'text-[#1f182a] hover:bg-[#eadef7]'
              }`}
            >
              🔥 Burn Only
            </button>
            <button
              onClick={() => {
                sound.playBip(700);
                setMetricFilter('spores');
              }}
              className={`px-2 py-1 font-bold uppercase cursor-pointer ${
                metricFilter === 'spores'
                  ? 'bg-[#006d3d] text-[#5affa3] shadow-[1px_1px_0px_#1f182a]'
                  : 'text-[#1f182a] hover:bg-[#eadef7]'
              }`}
            >
              🌱 Spores Only
            </button>
          </div>

          {/* Chart visual style */}
          <div className="flex items-center border-2 border-[#1f182a] bg-[#ffffff]">
            <button
              onClick={() => setChartType('area')}
              className={`px-2 py-1 font-bold uppercase cursor-pointer ${
                chartType === 'area' ? 'bg-[#352d40] text-white' : 'text-[#1f182a]'
              }`}
              title="Area Wave View"
            >
              Wave
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`px-2 py-1 font-bold uppercase cursor-pointer ${
                chartType === 'bar' ? 'bg-[#352d40] text-white' : 'text-[#1f182a]'
              }`}
              title="Bar Cadence View"
            >
              Bar
            </button>
          </div>
        </div>
      </div>

      {/* Vital Metric Highlights Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 text-xs">
        <div className="bg-[#faf0ff] p-2 sm:p-2.5 border border-[#1f182a]">
          <span className="text-[9px] text-[#5a3f46] uppercase block font-bold">
            24h Incinerated Tokens
          </span>
          <span className="font-['Space_Grotesk'] text-base sm:text-lg font-bold text-[#b60059] block">
            {totalBurnTokens.toLocaleString()}
          </span>
          <span className="text-[9px] text-[#006d3d] font-bold">~{totalSolScorched} SOL Equiv</span>
        </div>

        <div className="bg-[#faf0ff] p-2 sm:p-2.5 border border-[#1f182a]">
          <span className="text-[9px] text-[#5a3f46] uppercase block font-bold">
            Newly Bonded Spores
          </span>
          <span className="font-['Space_Grotesk'] text-base sm:text-lg font-bold text-[#006d3d] block">
            +{totalBonded} Spores
          </span>
          <span className="text-[9px] text-[#5a3f46]">Across 18 Hosts</span>
        </div>

        <div className="bg-[#faf0ff] p-2 sm:p-2.5 border border-[#1f182a]">
          <span className="text-[9px] text-[#5a3f46] uppercase block font-bold">
            Metabolic Absorption
          </span>
          <span className="font-['Space_Grotesk'] text-base sm:text-lg font-bold text-[#7658f8] block">
            1.618 Ratio
          </span>
          <span className="text-[9px] text-[#006d3d] font-bold">Optimal Mycelial Feed</span>
        </div>

        <div className="bg-[#faf0ff] p-2 sm:p-2.5 border border-[#1f182a]">
          <span className="text-[9px] text-[#5a3f46] uppercase block font-bold">
            Active Quorum Status
          </span>
          <span className="font-['Space_Grotesk'] text-base sm:text-lg font-bold text-[#1f182a] block">
            100% Synced
          </span>
          <span className="text-[9px] text-[#df1871] font-bold">Meteora Dynamic Curve</span>
        </div>
      </div>

      {/* Main Recharts Container */}
      <div className="w-full h-64 sm:h-72 border-2 border-[#1f182a] bg-[#faf0ff] p-2 sm:p-3 relative">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 10, right: 12, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="burnGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#df1871" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#ffd9e1" stopOpacity={0.08} />
              </linearGradient>
              <linearGradient id="sporeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#29e288" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#5affa3" stopOpacity={0.2} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="2 2"
              stroke="#1f182a"
              opacity={0.15}
              vertical={false}
            />

            <XAxis
              dataKey="hour"
              stroke="#1f182a"
              tickLine={{ stroke: '#1f182a' }}
              tick={{ fill: '#5a3f46', fontSize: 10, fontFamily: 'monospace' }}
              interval="preserveStartEnd"
            />

            {/* Left Axis: Incinerated Tokens */}
            <YAxis
              yAxisId="left"
              stroke="#b60059"
              tickLine={{ stroke: '#b60059' }}
              tick={{ fill: '#b60059', fontSize: 10, fontFamily: 'monospace' }}
              tickFormatter={(val: number) => `${Math.round(val / 1000)}k`}
              domain={[0, 'auto']}
            />

            {/* Right Axis: Bonded Spores */}
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#006d3d"
              tickLine={{ stroke: '#006d3d' }}
              tick={{ fill: '#006d3d', fontSize: 10, fontFamily: 'monospace' }}
              domain={[0, 'auto']}
              allowDecimals={false}
            />

            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-[#352d40] text-[#f7edff] border-2 border-[#1f182a] p-2.5 shadow-[3px_3px_0px_#1f182a] font-mono text-[11px] min-w-[200px]">
                      <div className="border-b border-[#1f182a] pb-1 mb-1.5 flex justify-between items-center">
                        <span className="text-[#5affa3] font-bold">TIMEFRAME: {label}</span>
                        <span className="text-[9px] text-[#e2bdc5]">SOLANA CPI</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[#ffb1c5]">
                          <span>🔥 Incinerated:</span>
                          <span className="font-bold">
                            {(payload[0]?.value as number)?.toLocaleString()} tokens
                          </span>
                        </div>
                        {payload[1] && (
                          <div className="flex justify-between items-center text-[#5affa3]">
                            <span>🌱 Bonded Spores:</span>
                            <span className="font-bold">+{payload[1]?.value} specimens</span>
                          </div>
                        )}
                        <div className="flex justify-between items-center text-[#ffd9e1] border-t border-[#1f182a]/60 pt-1 text-[10px]">
                          <span>Equivalent Burn:</span>
                          <span>
                            ~{(Number(payload[0]?.value || 0) * 0.00028).toFixed(2)} SOL
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            <Legend
              wrapperStyle={{
                paddingTop: '8px',
                fontSize: '11px',
                fontFamily: 'monospace',
              }}
              formatter={(value) => {
                return (
                  <span className="font-bold text-[#1f182a] uppercase text-[10px] mr-3">
                    {value === 'incineratedTokens'
                      ? '🔥 Incinerated Host Tokens'
                      : '🌱 Newly Bonded Spores'}
                  </span>
                );
              }}
            />

            {/* Incinerated Stream */}
            {(metricFilter === 'both' || metricFilter === 'burns') && (
              chartType === 'area' ? (
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="incineratedTokens"
                  name="incineratedTokens"
                  stroke="#df1871"
                  strokeWidth={2.5}
                  fill="url(#burnGradient)"
                  isAnimationActive={true}
                  animationDuration={800}
                />
              ) : (
                <Bar
                  yAxisId="left"
                  dataKey="incineratedTokens"
                  name="incineratedTokens"
                  fill="#df1871"
                  stroke="#1f182a"
                  strokeWidth={1}
                />
              )
            )}

            {/* Bonded Spores Stream */}
            {(metricFilter === 'both' || metricFilter === 'spores') && (
              chartType === 'area' ? (
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="bondedSpores"
                  name="bondedSpores"
                  stroke="#006d3d"
                  strokeWidth={2.5}
                  dot={{ stroke: '#1f182a', strokeWidth: 1.5, r: 3, fill: '#5affa3' }}
                  activeDot={{ r: 5, fill: '#5affa3', stroke: '#1f182a', strokeWidth: 2 }}
                  isAnimationActive={true}
                  animationDuration={900}
                />
              ) : (
                <Bar
                  yAxisId="right"
                  dataKey="bondedSpores"
                  name="bondedSpores"
                  fill="#29e288"
                  stroke="#1f182a"
                  strokeWidth={1}
                />
              )
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Legend & Real-time Sync Readout */}
      <div className="mt-2.5 flex flex-col sm:flex-row items-start sm:items-center justify-between text-[10px] text-[#5a3f46] gap-1">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#5affa3] inline-block animate-ping"></span>
          <span>Dual telemetry pipeline indexed from Solana validators via Jupiter DBC aggregator.</span>
        </span>
        <span className="text-[#1f182a] font-bold">
          TOTAL 24H ABSORPTION VELOCITY: 98.6%
        </span>
      </div>
    </div>
  );
};
