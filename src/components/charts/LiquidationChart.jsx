import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ReferenceLine, ResponsiveContainer, Line, Legend, CartesianGrid, ReferenceArea, Customized, ReferenceDot } from 'recharts';

const LiquidationChart = ({ data, currentPrice }) => {
  const currentDataPoint = data.find(d => Math.abs(d.price - currentPrice) < 0.01);
  const currentLiquidation = currentDataPoint ? (currentDataPoint.binance + currentDataPoint.bybit + currentDataPoint.okx) : 1000;

  const [zoomRange, setZoomRange] = useState({
    minPrice: Math.min(...data.map(d => d.price)),
    maxPrice: Math.max(...data.map(d => d.price))
  });

  const chartRef = useRef(null);

  const roundedCurrentPrice = Math.round(currentPrice * 100) / 100;

  const fullRange = Math.max(...data.map(d => d.price)) - Math.min(...data.map(d => d.price));
  const currentRange = zoomRange.maxPrice - zoomRange.minPrice;
  const barSize = Math.max(5, Math.min(20, 10 * (fullRange / currentRange)));

  // helper to format 1000 -> 1K, 1_000_000 -> 1M, etc.
  const formatShort = (num) => {
    if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1)}B`;
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
    return `${num}`;
  };

  const formatPrice = (num) => {
    return Math.round(num).toLocaleString('en-US');
  };

  const formatCompact = (num) => {
    const abs = Math.abs(num || 0);
    if (abs >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(2)}B`;
    if (abs >= 1_000_000) return `${(num / 1_000_000).toFixed(2)}M`;
    if (abs >= 1_000) return `${(num / 1_000).toFixed(2)}K`;
    return `${num?.toFixed ? num.toFixed(2) : num}`;
  };

  // Custom label to draw text and a small downward arrow at the top pointing to the line
  const CurrentPriceMarker = ({ viewBox }) => {
    if (!viewBox) return null;
    const { x, y } = viewBox; // pixel x for the vertical reference line
    const textY = y + 14; // small padding from very top
    const arrowTop = y + 20;
    const arrowBottom = y + 34; // small arrow height
    const arrowWidth = 6;
    return (
      <g>
        <text x={x} y={textY} fill="#E5E7EB" textAnchor="middle" fontSize={12} fontWeight="600">
          {`Current Price: ${formatPrice(displayedCurrentX)}`}
        </text>
        {/* small dotted segment below text to emulate pointer */}
        <line x1={x} y1={arrowTop} x2={x} y2={arrowBottom - 6} stroke="#EF4444" strokeWidth={2} strokeDasharray="4 4" />
        {/* small triangle tip */}
        <polygon points={`${x - arrowWidth},${arrowBottom - 6} ${x + arrowWidth},${arrowBottom - 6} ${x},${arrowBottom}`} fill="#EF4444" />
      </g>
    );
  };

  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault();
      if (!chartRef.current) {
        console.log('Chart ref not found');
        return;
      }

      const rect = chartRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const width = rect.width;
      const fraction = mouseX / width;

      const { minPrice, maxPrice } = zoomRange;
      const currentRange = maxPrice - minPrice;
      const zoomFactor = e.deltaY < 0 ? 0.8 : 1.25;

      const newRange = currentRange * zoomFactor;
      const newMin = minPrice + fraction * (currentRange - newRange);
      const newMax = newMin + newRange;

      const overallMin = Math.min(...data.map(d => d.price));
      const overallMax = Math.max(...data.map(d => d.price));
      const clampedMin = Math.max(overallMin, newMin);
      const clampedMax = Math.min(overallMax, newMax);

      // Adjusted minimum zoom range to 10% of full range
      const minZoomRange = fullRange * 0.1;
      if (clampedMax - clampedMin >= minZoomRange && clampedMin <= currentPrice && clampedMax >= currentPrice) {
        setZoomRange({ minPrice: clampedMin, maxPrice: clampedMax });
        console.log('Zoom updated:', { minPrice: clampedMin, maxPrice: clampedMax, barSize });
      }
    };

    const container = chartRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
    };
  }, [zoomRange, data, currentPrice, fullRange]);

  // Filter data based on zoom range
  const filteredData = data
    .filter(d => d.price >= zoomRange.minPrice && d.price <= zoomRange.maxPrice)
    .sort((a, b) => a.price - b.price);

  // Compute cumulative long/short series around the current price to mimic the reference design
  const totals = filteredData.map(d => (d.binance + d.bybit + d.okx));
  const centerIndex = (() => {
    if (filteredData.length === 0) return 0;
    let minIdx = 0;
    let minDiff = Math.abs(filteredData[0].price - roundedCurrentPrice);
    for (let i = 1; i < filteredData.length; i++) {
      const diff = Math.abs(filteredData[i].price - roundedCurrentPrice);
      if (diff < minDiff) {
        minIdx = i;
        minDiff = diff;
      }
    }
    return minIdx;
  })();

  // Prefix sums for fast segment sums
  const prefix = new Array(totals.length + 1).fill(0);
  for (let i = 0; i < totals.length; i++) {
    prefix[i + 1] = prefix[i] + totals[i];
  }

  const processedData = filteredData.map((d, i) => {
    // cumLong: from i → center (only on the left side)
    const cumLong = i <= centerIndex ? (prefix[centerIndex + 1] - prefix[i]) : 0;
    // cumShort: from center → i (only on the right side)
    const cumShort = i >= centerIndex ? (prefix[i + 1] - prefix[centerIndex]) : 0;
    // For plotting, hide zero segments by using null to break the line
    const cumLongPlot = cumLong > 0 ? cumLong : null;
    const cumShortPlot = cumShort > 0 ? cumShort : null;
    return { ...d, cumLong, cumShort, cumLongPlot, cumShortPlot };
  });

  // Anchor the current price x to the center data point (which LiquidationGraph aligns to fetchedPrice)
  // Visually lock current price to the middle of the visible domain
  const domainCenter = (zoomRange.minPrice + zoomRange.maxPrice) / 2;
  const displayedCurrentX = Number.isFinite(domainCenter) ? domainCenter : roundedCurrentPrice;

  const leftAxisMax = (() => {
    let m = 0;
    for (const d of processedData) {
      const tot = (d.binance || 0) + (d.bybit || 0) + (d.okx || 0);
      if (tot > m) m = tot;
    }
    // round up to a nice step
    const step = 10_000_000; // 10M
    return Math.ceil(m / step) * step;
  })();

  const rightAxisMax = (() => {
    let m = 0;
    for (const d of processedData) {
      if (d.cumLong > m) m = d.cumLong;
      if (d.cumShort > m) m = d.cumShort;
    }
    const step = 100_000_000; // 0.1B
    return Math.ceil(m / step) * step;
  })();

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const bin = payload.find(p => p.dataKey === 'binance')?.value || 0;
      const byb = payload.find(p => p.dataKey === 'bybit')?.value || 0;
      const okx = payload.find(p => p.dataKey === 'okx')?.value || 0;
  const cumShort = (payload.find(p => p.dataKey === 'cumShortPlot')?.value ?? payload.find(p => p.dataKey === 'cumShort')?.value) || 0;
  const cumLong = (payload.find(p => p.dataKey === 'cumLongPlot')?.value ?? payload.find(p => p.dataKey === 'cumLong')?.value) || 0;

  const showLong = (label || 0) <= displayedCurrentX; // left of center show long
      const cumLabel = showLong ? 'Cumulative Long Liquidation Leverage' : 'Cumulative Short Liquidation Leverage';
      const cumColor = showLong ? '#EF4444' : '#22C55E';
      const cumValue = showLong ? cumLong : cumShort;

      return (
        <div className="rounded-xl px-4 py-3 shadow-2xl" style={{ background: '#0B0F14', border: '1px solid #1f2937', color: '#e5e7eb' }}>
          <div className="text-sm font-semibold mb-2">{formatPrice(label)}</div>
          <div className="flex items-center justify-between gap-8 text-sm mb-1">
            <div className="flex items-center gap-2"><span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: cumColor }} />{cumLabel}</div>
            <div className="tabular-nums">{formatCompact(cumValue)}</div>
          </div>
          <div className="flex items-center justify-between gap-8 text-sm mb-1">
            <div className="flex items-center gap-2"><span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: '#f59e0b' }} />Binance</div>
            <div className="tabular-nums">{formatCompact(bin)}</div>
          </div>
          <div className="flex items-center justify-between gap-8 text-sm mb-1">
            <div className="flex items-center gap-2"><span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: '#ffd54f' }} />OKX</div>
            <div className="tabular-nums">{formatCompact(okx)}</div>
          </div>
          <div className="flex items-center justify-between gap-8 text-sm">
            <div className="flex items-center gap-2"><span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: '#8dd3ff' }} />Bybit</div>
            <div className="tabular-nums">{formatCompact(byb)}</div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom top-layer that draws the current price vertical dashed line and label
  const CurrentPriceLayer = (props) => {
    const { xAxisMap, offset } = props || {};
    if (!xAxisMap || !offset || !Number.isFinite(displayedCurrentX)) return null;
    const xAxis = Object.values(xAxisMap)[0];
    const scale = xAxis && xAxis.scale ? xAxis.scale : null;
    if (!scale) return null;
    // scale returns x relative to chart area; add left offset for absolute SVG coords
    const cx = scale(displayedCurrentX) + (offset.left || 0);
    const yTop = offset.top;
    const yBottom = offset.top + offset.height;
    const textY = yTop + 14;
    const arrowTop = yTop + 20;
    const arrowBottom = yTop + 34;
    const arrowWidth = 6;
    return (
      <g pointerEvents="none">
        <line x1={cx} x2={cx} y1={yTop} y2={yBottom} stroke="#EF4444" strokeWidth={3} strokeDasharray="4 6" />
        <text x={cx} y={textY} fill="#E5E7EB" textAnchor="middle" fontSize={12} fontWeight={600}>{`Current Price: ${formatPrice(displayedCurrentX)}`}</text>
        <line x1={cx} y1={arrowTop} x2={cx} y2={arrowBottom - 6} stroke="#EF4444" strokeWidth={2} strokeDasharray="4 4" />
        <polygon points={`${cx - arrowWidth},${arrowBottom - 6} ${cx + arrowWidth},${arrowBottom - 6} ${cx},${arrowBottom}`} fill="#EF4444" />
      </g>
    );
  };

  const renderLegend = () => {
    const items = [
      { label: 'Cumulative Short Liquidation Leverage', color: '#22C55E', shape: 'line' },
      { label: 'Cumulative Long Liquidation Leverage', color: '#EF4444', shape: 'line' },
      { label: 'Binance', color: '#F59E0B', shape: 'square' },
      { label: 'OKX', color: '#FDE047', shape: 'square' },
      { label: 'Bybit', color: '#93C5FD', shape: 'square' }
    ];
    return (
      <ul className="flex flex-wrap justify-center gap-4 mt-3">
        {items.map((it, idx) => (
          <li key={idx} className="flex items-center gap-2 text-white text-sm">
            {it.shape === 'line' ? (
              <div className="w-6 h-[2px]" style={{ backgroundColor: it.color }} />
            ) : (
              <div className="w-3 h-3" style={{ backgroundColor: it.color }} />
            )}
            <span>{it.label}</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className='w-full mb-5 md:mb-10'>
      <motion.div
        className="bg-[#0B0F14] p-6 rounded-xl shadow-2xl w-full max-w-[95%] mx-auto border border-gray-800"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <h2 className="text-2xl font-extrabold mb-4 text-white tracking-wide">
          Bitcoin Exchange Liquidation Map
        </h2>
        <p className="text-gray-300 mb-4 text-sm">
          Current Price: ${currentPrice?.toFixed(2)} | Total Current Liquidation: {currentLiquidation}
        </p>
        <div ref={chartRef} className="w-full h-[240px] sm:h-[320px] md:h-[420px] xl:h-[520px] chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={processedData}
              margin={{ top: 10, right: 60, left: 10, bottom: 10 }}
              barSize={5}
              barCategoryGap={"75%"}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
              <XAxis
                dataKey="price"
                type="number"
                allowDataOverflow
                stroke="#9CA3AF"
                tick={{ fill: '#9CA3AF' }}
                tickFormatter={formatPrice}
                domain={[zoomRange.minPrice, zoomRange.maxPrice]}
                allowDecimals={false}
              />
              <YAxis
                yAxisId="left"
                stroke="#9CA3AF"
                tick={{ fill: '#9CA3AF' }}
                tickFormatter={formatShort}
                domain={[0, leftAxisMax]}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#9CA3AF"
                tick={{ fill: '#9CA3AF' }}
                tickFormatter={formatShort}
                domain={[0, rightAxisMax]}
              />

              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Legend content={renderLegend} />

              {/* Background shading */}
              <ReferenceArea x1={zoomRange.minPrice} x2={displayedCurrentX} y1={0} y2="auto" fill="#7F1D1D" fillOpacity={0.12} />
              <ReferenceArea x1={displayedCurrentX} x2={zoomRange.maxPrice} y1={0} y2="auto" fill="#052E24" fillOpacity={0.12} />

              {/* Stacked Exchange Bars */}
              <Bar yAxisId="left" dataKey="binance" stackId="exchanges" fill="#f59e0b" />
              <Bar yAxisId="left" dataKey="okx" stackId="exchanges" fill="#ffd54f" />
              <Bar yAxisId="left" dataKey="bybit" stackId="exchanges" fill="#8dd3ff" />

              {/* Cumulative Lines */}
              <Line yAxisId="right" type="monotone" dataKey="cumShortPlot" stroke="#22C55E" strokeWidth={2.5} dot={false} connectNulls={false} />
              <Line yAxisId="right" type="monotone" dataKey="cumLongPlot" stroke="#ef4444" strokeWidth={2.5} dot={false} connectNulls={false} />

              {/* Current Price Line (always on top via Customized layer) */}
              <Customized component={<CurrentPriceLayer />} />
              {/* Fallback ReferenceLine in case Customized fails */}
              <ReferenceLine x={displayedCurrentX} stroke="#EF4444" strokeWidth={2} strokeDasharray="4 6" isFront={true} />
              {/* Bottom marker dot at current price */}
              <ReferenceDot x={displayedCurrentX} y={0} yAxisId="left" r={3} fill="#EF4444" stroke="#EF4444" isFront={true} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};

export default LiquidationChart;