import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import LiquidationChart from './charts/LiquidationChart';
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

  // Dummy total liquidation data (151 points)
  const dummyTotalLiquidation = [
    // Original 51 points
    1126, 1150, 1200, 1250, 1300, 1466, 1420, 1380, 1340, 1300,
    1331, 1200, 1100, 1000, 950, 1026, 1080, 1140, 1200, 1240,
    1285, 1300, 1280, 1270, 1265, 1357, 1300, 1250, 1200, 1150,
    569, 600, 650, 700, 800, 900, 950, 1000, 1050, 1100,
    1220, 1180, 1150, 1127, 1100, 710, 750, 780, 790, 795, 508,
    // Repeated and adjusted 50 points (from previous 101-point set)
    1126, 1140, 1190, 1240, 1290, 1450, 1410, 1370, 1330, 1290,
    1320, 1190, 1090, 990, 940, 1016, 1070, 1130, 1190, 1230,
    1275, 1290, 1270, 1260, 1255, 1347, 1290, 1240, 1190, 1140,
    559, 590, 640, 690, 790, 890, 940, 990, 1040, 1090,
    1210, 1170, 1140, 1117, 1090, 700, 740, 770, 780, 785,
    // Additional 50 points (extended with similar pattern)
    1120, 1130, 1180, 1230, 1280, 1440, 1400, 1360, 1320, 1280,
    1310, 1180, 1080, 980, 930, 1006, 1060, 1120, 1180, 1220,
    1265, 1280, 1260, 1250, 1245, 1337, 1280, 1230, 1180, 1130,
    549, 580, 630, 680, 780, 880, 930, 980, 1030, 1080,
    1200, 1160, 1130, 1107, 1080, 690, 730, 760, 770, 775
  ];

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE}/get_price/${symbol}`);
        const fetchedPrice = parseFloat(res.data.price);
        setCurrentPrice(fetchedPrice);

        // Calculate ±5% range
        const minPrice = fetchedPrice * 0.95; // 5% below
        const maxPrice = fetchedPrice * 1.05; // 5% above
        const priceRange = maxPrice - minPrice;
        const numPoints = 151; // Decreased to 151 points
        const priceStep = priceRange / (numPoints - 1); // Evenly spaced steps

        // Generate new data array with exchange breakdowns
        const newData = Array.from({ length: numPoints }, (_, index) => {
          const price = minPrice + index * priceStep;
          const total = dummyTotalLiquidation[index];

          // Generate dummy proportions for exchanges (varying per point, sum to total)
          const binanceRatio = 0.3 + 0.2 * Math.sin(index * 0.04) + Math.random() * 0.1;
          const bybitRatio = 0.3 + 0.2 * Math.cos(index * 0.04) + Math.random() * 0.1;
          const okxRatio = 1 - binanceRatio - bybitRatio;
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
        const fallbackData = dummyTotalLiquidation.map((total, index) => ({
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
          <LiquidationChart data={data} currentPrice={currentPrice} />
        )}
      </div>
    </div>
  );
};

export default LiquidationGraph;