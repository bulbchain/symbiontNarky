import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface SporeRarityBarProps {
  percentage: number;
  sporeSymbol: string;
  compact?: boolean;
}

export const SporeRarityBar: React.FC<SporeRarityBarProps> = ({
  percentage,
  sporeSymbol,
  compact = false,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [displayValue, setDisplayValue] = useState(0);

  // Derive Rarity Tier & Color based on burn contribution percentage
  const getRarityTier = (pct: number) => {
    if (pct >= 75) return { name: 'MYTHIC APEX', color: '#df1871', bg: '#ffd9e1' };
    if (pct >= 50) return { name: 'EXOTIC HYPHA', color: '#7658f8', bg: '#f0e3fd' };
    if (pct >= 20) return { name: 'BIO-FERTILE', color: '#006d3d', bg: '#50fd9f' };
    return { name: 'MYCELIAL SEED', color: '#007240', bg: '#5affa3' };
  };

  const tier = getRarityTier(percentage);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = compact ? 80 : 120;
    const height = compact ? 8 : 10;

    // D3 Linear Scale for width
    const xScale = d3.scaleLinear().domain([0, 100]).range([0, width]);

    // D3 Color Interpolator
    const colorInterpolator = d3.interpolateRgb('#29e288', '#df1871');
    const barColor = colorInterpolator(Math.min(1, Math.max(0, percentage / 100)));

    // Clear previous dynamic elements
    svg.selectAll('.d3-bar').remove();
    svg.selectAll('.d3-notch').remove();

    // Background track (already in JSX, or managed here)
    const bar = svg
      .append('rect')
      .attr('class', 'd3-bar')
      .attr('x', 0)
      .attr('y', 0)
      .attr('height', height)
      .attr('width', 0)
      .attr('fill', barColor);

    // D3 Animation transition
    bar
      .transition()
      .duration(900)
      .ease(d3.easeCubicOut)
      .attr('width', xScale(percentage));

    // D3 Number counter animation
    const interpolator = d3.interpolateNumber(0, percentage);
    d3.transition()
      .duration(900)
      .ease(d3.easeCubicOut)
      .tween('text', () => {
        return (t: number) => {
          setDisplayValue(+interpolator(t).toFixed(1));
        };
      });

    // Milestone notches at 25%, 50%, 75%
    [25, 50, 75].forEach(mark => {
      svg
        .append('line')
        .attr('class', 'd3-notch')
        .attr('x1', xScale(mark))
        .attr('x2', xScale(mark))
        .attr('y1', 0)
        .attr('y2', height)
        .attr('stroke', '#1f182a')
        .attr('stroke-width', 1)
        .attr('opacity', 0.5);
    });
  }, [percentage, compact]);

  if (compact) {
    return (
      <div
        className="flex items-center gap-1.5 font-mono text-[9px]"
        title={`Rarity Index: ${percentage}% burn contribution (${tier.name})`}
      >
        <div className="flex flex-col">
          <div className="flex justify-between items-center gap-1 mb-0.5 text-[8px] text-[#5a3f46] font-bold">
            <span className="uppercase text-[#1f182a]">RARITY:</span>
            <span style={{ color: tier.color }}>{displayValue}%</span>
          </div>
          <div className="w-[80px] h-[8px] bg-[#faf0ff] border border-[#1f182a] relative overflow-hidden">
            <svg ref={svgRef} className="w-full h-full block" viewBox="0 0 80 8" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="p-1.5 bg-[#ffffff] border border-[#1f182a] flex flex-col gap-1 font-mono text-[10px] shadow-[1px_1px_0px_#1f182a]"
      title={`Specimen ${sporeSymbol}: ${percentage}% burn contribution to host pool.`}
    >
      <div className="flex items-center justify-between gap-1">
        <span className="font-bold text-[#1f182a] uppercase text-[9px] flex items-center gap-1">
          <span
            className="w-1.5 h-1.5 rounded-full inline-block"
            style={{ backgroundColor: tier.color }}
          />
          Rarity Index:
        </span>
        <span
          className="px-1 py-0.2 text-[8px] font-bold uppercase border border-[#1f182a]"
          style={{ backgroundColor: tier.bg, color: tier.color }}
        >
          {tier.name} ({displayValue}%)
        </span>
      </div>

      <div className="w-[120px] h-[10px] bg-[#faf0ff] border border-[#1f182a] relative overflow-hidden">
        <svg ref={svgRef} className="w-full h-full block" viewBox="0 0 120 10" />
      </div>
    </div>
  );
};
