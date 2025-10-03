import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import LiquidationChart from './charts/LiquidationChart';
import LiquidationHeatmap from './charts/LiquidationHeatmap';
import SymbolSearch from '../components/SymbolSearch';
import axios from 'axios';

// Register chart components (unused but kept for compatibility)
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LiquidationGraph = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const initialSymbol = searchParams.get('symbol') || 'BTCUSDT';
  const [symbol, setSymbol] = useState(initialSymbol);
  const [loading, setLoading] = useState(true);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [data, setData] = useState([]);

  // Procedural dummy total liquidation data that mimics twin-peak distribution
  // with more spread and spikes like the reference image (deterministic noise)
  const generateTwinPeakDummy = (points = 151) => {
    const mid = Math.floor(points / 2);
    const arr = new Array(points).fill(0);

    const prng = (i) => {
      const x = Math.sin(i * 12.9898) * 43758.5453;
      return x - Math.floor(x);
    };

    // Scale to large magnitudes like the screenshot (80K..200M per bar)
    const base = 80_000;                // baseline
    const peakLeft = 180_000_000;       // left peak
    const peakRight = 200_000_000;      // right peak
    const sigmaNarrow = points * 0.06;  // sharp spikes
    const sigmaWide = points * 0.12;    // shoulders
    const offset = points * 0.12;       // distance from center
    const valleyDepth = 0.02;           // deep valley at center

    for (let i = 0; i < points; i++) {
      const dist = i - mid;

      // composite humps (narrow spike + wide shoulder) both sides
      const leftSpike = peakLeft * Math.exp(-Math.pow((dist + offset) / sigmaNarrow, 2));
      const leftShoulder = (peakLeft * 0.45) * Math.exp(-Math.pow((dist + offset) / sigmaWide, 2));
      const rightSpike = peakRight * Math.exp(-Math.pow((dist - offset) / sigmaNarrow, 2));
      const rightShoulder = (peakRight * 0.45) * Math.exp(-Math.pow((dist - offset) / sigmaWide, 2));

      // deeper valley at center
      const valley = 1 - Math.exp(-Math.pow(dist / (points * 0.035), 2)) * (1 - valleyDepth);

      // spiky texture and occasional tall spikes
      const wave = 1 + 0.25 * Math.sin(i * 0.28) + 0.12 * Math.cos(i * 0.11);
      const noise = 0.85 + 0.3 * prng(i * 1.7) + 0.15 * prng(i * 3.1);
      const spikeBoost = prng(i * 5.3) > 0.92 ? 1.6 : 1.0;

      const total = (leftSpike + leftShoulder + rightSpike + rightShoulder + base) * valley * wave * noise * spikeBoost;
      arr[i] = Math.max(50, Math.round(total));
    }

    return arr;
  };

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
  const res = await axios.get(`${API_BASE}/get_price/${symbol}`);
        const fetchedPrice = parseFloat(res.data.price);
        setCurrentPrice(fetchedPrice);

  // Calculate ±10% range for wider spread
  const minPrice = fetchedPrice * 0.90; // 10% below
  const maxPrice = fetchedPrice * 1.10; // 10% above
        const priceRange = maxPrice - minPrice;
        const numPoints = 151; // match design
        const priceStep = priceRange / (numPoints - 1); // Evenly spaced steps

        // Generate new data array with exchange breakdowns
        const totals = generateTwinPeakDummy(numPoints);
        const newData = Array.from({ length: numPoints }, (_, index) => {
          const price = minPrice + index * priceStep;
          const total = totals[index];

          // Deterministic per-index noise emphasizing Bybit near peaks
          const rand = (seed) => {
            const x = Math.sin((index + seed) * 12.9898) * 43758.5453;
            return x - Math.floor(x);
          };
          const midIdx = Math.floor(numPoints / 2);
          const peakOffset = numPoints * 0.12;
          const sigma = numPoints * 0.08;
          const leftProx = Math.exp(-Math.pow((index - (midIdx - peakOffset)) / sigma, 2));
          const rightProx = Math.exp(-Math.pow((index - (midIdx + peakOffset)) / sigma, 2));
          const nearPeak = Math.max(leftProx, rightProx);

          let bybitRatio = 0.22 + 0.38 * nearPeak + 0.06 * (rand(1) - 0.5);
          let binanceRatio = 0.46 - 0.18 * nearPeak + 0.06 * (rand(2) - 0.5);
          let okxRatio = 1 - bybitRatio - binanceRatio;
          const clamp01 = (v) => Math.max(0.05, Math.min(0.9, v));
          bybitRatio = clamp01(bybitRatio);
          binanceRatio = clamp01(binanceRatio);
          okxRatio = clamp01(okxRatio);
          const sumR = bybitRatio + binanceRatio + okxRatio;
          bybitRatio /= sumR; binanceRatio /= sumR; okxRatio /= sumR;
          const binance = Math.round(total * Math.max(0, Math.min(1, binanceRatio)));
          const bybit = Math.round(total * Math.max(0, Math.min(1, bybitRatio)));
          const okx = total - binance - bybit; // Ensure sum is exact

          return {
            price: Math.round(price * 100) / 100, // Round to 2 decimals
            binance: Math.max(0, binance),
            bybit: Math.max(0, bybit),
            okx: Math.max(0, okx),
            total: total
          };
        });

        // Ensure currentPrice is exactly in data (adjust middle point)
        const middleIndex = Math.floor(numPoints / 2);
        newData[middleIndex].price = Math.round(fetchedPrice * 100) / 100;

        setData(newData);
        console.log('Generated data with exchange breakdowns:', newData);
      } catch (err) {
        console.error('Error fetching price:', err);
        // Fallback to dummy data if API fails
        const totals = generateTwinPeakDummy(151);
        const fallbackData = totals.map((total, index) => ({
          price: 47500 + index * (5000 / (151 - 1)), // Adjusted for 151 points
          binance: Math.round(total * 0.4),
          bybit: Math.round(total * 0.3),
          okx: total - Math.round(total * 0.4) - Math.round(total * 0.3),
          total
        }));
        setData(fallbackData);
        setCurrentPrice(50000);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [symbol]);

  return (
    <div className="w-full min-h-[500px] md:min-h-[600px] lg:min-h-[700px] mt-10 mb-16 rounded-lg p-5">
      <div className="flex justify-center">
        <SymbolSearch onSelect={(sym) => setSymbol(sym)} />
      </div>
      <div className="flex flex-col items-center w-full justify-center my-10">
        <div>
          <h2 className="text-xl text-start text-white mb-4">
            {symbol || ''} Liquidation Map (Per Exchange)
          </h2>
        </div>
        {loading ? (
          <div className="text-white">Loading...</div>
        ) : (
          <>
            <LiquidationChart data={data} currentPrice={currentPrice} />
            <div className="mt-8 w-full">
              <h2 className="text-xl text-start text-white mb-4">{symbol || ''} Heatmap (Experimental)</h2>
              <LiquidationHeatmap data={data} currentPrice={currentPrice} symbol={symbol} apiBase={API_BASE} interval="15m" limit={120} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LiquidationGraph;