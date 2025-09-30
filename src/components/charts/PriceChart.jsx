import Plot from "react-plotly.js";

export default function PriceChart({ candles, symbol }) {
  if (!candles || !Array.isArray(candles) || candles.length === 0) {
    return (
      <div className="mb-6 p-8 bg-gray-800 rounded-lg border border-gray-700">
        <h2 className="text-lg font-semibold mb-2">Price ({symbol || 'Unknown'})</h2>
        <div className="flex items-center justify-center h-64 text-gray-400">
          <div className="text-center">
            <div className="text-4xl mb-2">📊</div>
            <div>No price data available</div>
            <div className="text-sm mt-1">Try selecting a different symbol or timeframe</div>
          </div>
        </div>
      </div>
    );
  }

  try {
    const times = candles.map((c) => {
      if (!c || !c.time) {
        console.warn('[PRICE_CHART] Invalid candle data:', c);
        return new Date();
      }
      return new Date(c.time);
    });

    const validCandles = candles.filter(c => 
      c && 
      typeof c.open === 'number' && 
      typeof c.high === 'number' && 
      typeof c.low === 'number' && 
      typeof c.close === 'number'
    );

    if (validCandles.length === 0) {
      throw new Error('No valid candle data found');
    }

    return (
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Price ({symbol || 'Unknown'})</h2>
        <Plot
          data={[
            {
              x: times,
              open: validCandles.map((c) => c.open),
              high: validCandles.map((c) => c.high),
              low: validCandles.map((c) => c.low),
              close: validCandles.map((c) => c.close),
              type: "candlestick",
              name: symbol,
              increasing: { line: { color: "#00ff88" } },
              decreasing: { line: { color: "#ff4444" } },
            },
          ]}
          layout={{
            paper_bgcolor: "black",
            plot_bgcolor: "black",
            font: { color: "white" },
            height: 450,
            margin: { t: 30, l: 60, r: 40, b: 40 },
            showlegend: false,
            xaxis: {
              showticklabels: true,
              rangeslider: { visible: false },
            },
            yaxis: {
              title: "Price",
              side: "left",
            },
          }}
          style={{ width: "100%" }}
          useResizeHandler
          config={{
            displayModeBar: false,
            responsive: true
          }}
        />
      </div>
    );
  } catch (error) {
    console.error('[PRICE_CHART] Error rendering chart:', error);
    return (
      <div className="mb-6 p-8 bg-red-900/20 border border-red-500 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Price ({symbol || 'Unknown'})</h2>
        <div className="flex items-center justify-center h-64 text-red-400">
          <div className="text-center">
            <div className="text-4xl mb-2">⚠️</div>
            <div>Error rendering price chart</div>
            <div className="text-sm mt-1">{error.message}</div>
          </div>
        </div>
      </div>
    );
  }
}
