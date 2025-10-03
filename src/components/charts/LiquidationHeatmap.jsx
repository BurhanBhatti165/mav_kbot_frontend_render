import React, { useMemo, useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';

// A heatmap inspired by the reference screenshot (purple->teal->yellow),
// built from the existing per-price liquidation totals and a synthetic time axis.
// Props:
// - data: [{ price, binance, bybit, okx, total } ...] single snapshot across price bins
// - currentPrice: number
// - columns: number of time columns to synthesize when no candles (default 60)
// - showPriceLine: overlay price line (default true)
// - symbol: trading symbol to fetch real candles (optional but recommended)
// - apiBase: backend base URL (optional; if not provided will try import.meta)
const LiquidationHeatmap = ({ data = [], currentPrice, columns = 60, showPriceLine = true, symbol, apiBase, interval = '15m', limit = 120 }) => {
  const [candles, setCandles] = useState([]);

  // Fetch real candles for price overlay and time axis when symbol/apiBase are provided
  useEffect(() => {
    const base = apiBase || (import.meta?.env?.VITE_API_BASE_URL ?? '');
    if (!symbol || !base) {
      setCandles([]);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await axios.get(`${base}/api/data`, {
          params: { symbol, interval, limit }
        });
        if (!cancelled && Array.isArray(res.data)) {
          setCandles(res.data);
        }
      } catch (e) {
        // silently fall back to synthetic time
        if (!cancelled) setCandles([]);
      }
    })();
    return () => { cancelled = true; };
  }, [symbol, apiBase, interval, limit]);

  const { xLabels, yPrices, zMatrix, priceLineY, candleOHLC } = useMemo(() => {
    const prices = (data || []).map(d => d.price).sort((a, b) => a - b);
    const totals = (data || []).map(d => Math.max(0, (d.binance || 0) + (d.bybit || 0) + (d.okx || 0)));
    if (!prices.length) {
      return { xLabels: [], yPrices: [], zMatrix: [], priceLineY: [], candleOHLC: null };
    }

    const rows = prices.length; // y
    const hasCandles = Array.isArray(candles) && candles.length > 0;
    const cols = hasCandles ? candles.length : Math.max(10, columns | 0); // x

    // Build time labels: use real candle times if available (Date objects), else synth past minutes (Date objects)
    let x = [];
    if (hasCandles) {
      x = candles.map(c => {
        const ts = c.open_time ?? c.close_time ?? c.time ?? c.t;
        return new Date(typeof ts === 'number' ? ts : Number(ts));
      });
    } else {
      const now = Date.now();
      const stepMs = 60_000; // 1 minute per column
      x = Array.from({ length: cols }, (_, i) => new Date(now - (cols - 1 - i) * stepMs));
    }

    // Normalize base totals to a comfortable range and add band-like temporal structure
    const baseMax = totals.reduce((m, v) => Math.max(m, v), 0) || 1;
    const norm = totals.map(v => v / baseMax); // 0..1 baseline by price

    // Create a z matrix: rows = prices, cols = time columns
    const z = Array.from({ length: rows }, () => new Array(cols).fill(0));

    const prng = (t, i) => {
      const n = Math.sin((t * 17.13 + i * 29.7) * 0.0157) * 43758.5453;
      return n - Math.floor(n);
    };

    // Emulate horizontal bands by slowly varying a threshold and band widths over time
    for (let i = 0; i < rows; i++) {
      for (let t = 0; t < cols; t++) {
        const base = norm[i];
        // Temporal wave causes some price rows to light up as bands
        const bandWave = 0.55 + 0.45 * Math.sin((t * 0.12) + i * 0.04);
        const bandWidth = 0.35 + 0.25 * Math.cos(t * 0.08 + i * 0.02);
        const bandMask = Math.max(0, 1 - Math.abs((bandWave - base)) / Math.max(0.0001, bandWidth));
        // Add speckle/noise to break uniformity
        const noise = 0.75 + 0.5 * (prng(t, i) - 0.5);
        // Final intensity scaled by baseline so rows with higher liquidation are more likely to glow
        const intensity = Math.pow(base, 0.8) * (0.4 + 0.6 * bandMask) * noise;
        z[i][t] = Math.max(0, intensity);
      }
    }

    // Price/Candles overlay data
    const priceLine = [];
    let candleOHLC = null;
    if (showPriceLine) {
      if (hasCandles) {
        candleOHLC = {
          x,
          open: candles.map(c => Number(c?.open ?? c?.o ?? NaN)),
          high: candles.map(c => Number(c?.high ?? c?.h ?? NaN)),
          low: candles.map(c => Number(c?.low ?? c?.l ?? NaN)),
          close: candles.map(c => Number(c?.close ?? c?.c ?? NaN)),
        };
      } else if (Number.isFinite(currentPrice)) {
        let p = currentPrice;
        for (let t = 0; t < cols; t++) {
          const drift = Math.sin(t * 0.07) * 0.0008; // tiny trend
          const jitter = (prng(t, 999) - 0.5) * 0.0025; // tiny volatility
          p = p * (1 + drift + jitter);
          priceLine.push(p);
        }
      }
    }

    return { xLabels: x, yPrices: prices, zMatrix: z, priceLineY: priceLine, candleOHLC };
  }, [data, currentPrice, columns, showPriceLine, candles]);

  // Colorscale approximating purple -> teal -> yellow
  const colorScale = [
    [0.0, '#2B0A3D'],
    [0.1, '#3A0F52'],
    [0.25, '#401D6C'],
    [0.4, '#1F4C6E'],
    [0.55, '#1E857C'],
    [0.7, '#25B8A3'],
    [0.85, '#6FD13D'],
    [1.0, '#F2E645']
  ];

  const traces = [
    {
      type: 'heatmap',
      z: zMatrix,
      x: xLabels,
      y: yPrices,
      colorscale: colorScale,
      reversescale: false,
      showscale: true,
      colorbar: {
        title: '',
        thickness: 16,
        len: 0.9,
        y: 0.5,
        x: -0.08, // place on left
        yanchor: 'middle'
      },
      hovertemplate: 'Time: %{x|%H:%M}<br>Price: %{y}<br>Intensity: %{z:.2f}<extra></extra>'
    }
  ];

  if (showPriceLine && candleOHLC) {
    traces.push({
      type: 'candlestick',
      x: candleOHLC.x,
      open: candleOHLC.open,
      high: candleOHLC.high,
      low: candleOHLC.low,
      close: candleOHLC.close,
      increasing: { line: { color: '#2DD4BF', width: 1 }, fillcolor: 'rgba(45,212,191,0.9)' }, // teal
      decreasing: { line: { color: '#F43F5E', width: 1 }, fillcolor: 'rgba(244,63,94,0.9)' }, // rose
      whiskerwidth: 0.5,
      name: symbol ? `${symbol} Price` : 'Price',
      hoverinfo: 'x+y',
      yaxis: 'y',
      xaxis: 'x'
    });
  } else if (showPriceLine && priceLineY.length) {
    traces.push({
      type: 'scatter',
      mode: 'lines',
      x: xLabels,
      y: priceLineY,
      line: { color: '#C0C6FF', width: 1.5 },
      name: 'Price',
      hoverinfo: 'skip'
    });
  }

  const layout = {
    paper_bgcolor: '#0B0F14',
    plot_bgcolor: '#0B0F14',
    margin: { l: 60, r: 20, t: 20, b: 40 },
    xaxis: {
      title: '',
      type: 'date',
      tickformat: '%H:%M',
      showgrid: false,
      tickfont: { color: '#9CA3AF' },
      showline: false
    },
    yaxis: {
      title: '',
      autorange: 'reversed', // higher price near top like the screenshot
      tickfont: { color: '#9CA3AF' },
      showgrid: false,
      showline: false
    },
    legend: { font: { color: '#E5E7EB' } }
  };

  return (
    <div className="w-full h-[260px] sm:h-[340px] md:h-[420px] xl:h-[520px]">
      <Plot
        data={traces}
        layout={layout}
        useResizeHandler
        style={{ width: '100%', height: '100%' }}
        config={{ displayModeBar: false, responsive: true }}
      />
    </div>
  );
};

export default LiquidationHeatmap;
