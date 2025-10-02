import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ReferenceLine, ResponsiveContainer, Line, Legend } from 'recharts';

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

  // Rest of the code remains the same as provided in the previous response
  const filteredData = data.filter(
    d => d.price >= zoomRange.minPrice && d.price <= zoomRange.maxPrice
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum, entry) => sum + entry.value, 0);
      return (
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700 text-white">
          <p className="font-bold">Price: ${label}</p>
          <p>Total Liquidation: {total}</p>
          <p>Binance: {payload.find(p => p.dataKey === 'binance')?.value || 0} ({payload.find(p => p.dataKey === 'binance') ? Math.round((payload.find(p => p.dataKey === 'binance').value / total) * 100) : 0}%)</p>
          <p>Bybit: {payload.find(p => p.dataKey === 'bybit')?.value || 0} ({payload.find(p => p.dataKey === 'bybit') ? Math.round((payload.find(p => p.dataKey === 'bybit').value / total) * 100) : 0}%)</p>
          <p>OKX: {payload.find(p => p.dataKey === 'okx')?.value || 0} ({payload.find(p => p.dataKey === 'okx') ? Math.round((payload.find(p => p.dataKey === 'okx').value / total) * 100) : 0}%)</p>
        </div>
      );
    }
    return null;
  };

  const renderLegend = (props) => {
    const { payload } = props;
    return (
      <ul className="flex justify-center gap-4 mt-2">
        {payload.map((entry, index) => (
          <li key={`legend-${index}`} className="flex items-center gap-2 text-white">
            <div className="w-4 h-4" style={{ backgroundColor: entry.color }} />
            {entry.value.charAt(0).toUpperCase() + entry.value.slice(1)}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className='w-full mb-5 md:mb-10'>
      <motion.div
        className="bg-gray-800/90 backdrop-blur-xl p-6 rounded-xl shadow-2xl w-full max-w-[80%] mx-auto border border-gray-700/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <h2 className="text-2xl font-extrabold mb-4 text-cyan-400 tracking-wide">
          Liquidation Chart
        </h2>
        <p className="text-gray-200 mb-6">
          Current Price: ${currentPrice?.toFixed(2)} | Total Current Liquidation: {currentLiquidation} 
          {currentDataPoint && ` (Binance: ${currentDataPoint.binance}, Bybit: ${currentDataPoint.bybit}, OKX: ${currentDataPoint.okx})`}
        </p>
        <div ref={chartRef} className="w-full h-[200px] sm:h-[300px] md:h-[400px] xl:h-[500px] chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={filteredData} margin={{ top: 20, right: 10, left: 10, bottom: 5 }}>
              <XAxis
                dataKey="price"
                stroke="#9CA3AF"
                tick={{ fill: '#9CA3AF' }}
                label={{ value: 'Price ($)', position: 'insideBottom', offset: -5, fill: '#D1D5DB' }}
                domain={[zoomRange.minPrice, zoomRange.maxPrice]}
              />
              <YAxis
                stroke="#9CA3AF"
                tick={{ fill: '#9CA3AF' }}
                label={{ value: 'Liquidation', angle: -90, position: 'insideLeft', fill: '#D1D5DB' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend content={renderLegend} />

              <Bar dataKey="binance" stackId="exchanges" fill="#F0B90B" radius={[0, 0, 0, 0]} />
              <Bar dataKey="bybit" stackId="exchanges" fill="#00C853" radius={[0, 0, 0, 0]} />
              <Bar dataKey="okx" stackId="exchanges" fill="#0099FF" radius={[4, 4, 0, 0]} />

              <Line
                type="monotone"
                dataKey="total"
                stroke="#A855F7"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, fill: '#A855F7' }}
              />

              <ReferenceLine
                x={roundedCurrentPrice}
                stroke="#3B82F6"
                strokeWidth={3}
                strokeDasharray="5 5"
                label={{ value: 'Current Price', position: 'top', fill: '#3B82F6', fontSize: 12 }}
                isFront={true}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};

export default LiquidationChart;