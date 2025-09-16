import Plot from "react-plotly.js";

export default function PriceChart({ candles, symbol }) {
  if (!candles.length) return null;

  const times = candles.map((c) => new Date(c.time));

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">Price ({symbol})</h2>
      <Plot
        data={[
          {
            x: times,
            open: candles.map((c) => c.open),
            high: candles.map((c) => c.high),
            low: candles.map((c) => c.low),
            close: candles.map((c) => c.close),
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
      />
    </div>
  );
}
