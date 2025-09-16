import Plot from "react-plotly.js";

export default function MACDChart({ candles }) {
  if (!candles.length) return null;

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">MACD</h2>
      <Plot
        data={[
          {
            x: candles.map((c) => new Date(c.time)),
            y: candles.map((c) => c.macd?.macd ?? null),
            type: "scatter",
            mode: "lines",
            name: "MACD",
            line: { color: "#00ff88" },
          },
          {
            x: candles.map((c) => new Date(c.time)),
            y: candles.map((c) => c.macd?.signal ?? null),
            type: "scatter",
            mode: "lines",
            name: "Signal",
            line: { color: "#ffaa00" },
          },
          {
            x: candles.map((c) => new Date(c.time)),
            y: candles.map((c) => c.macd?.hist ?? null),
            type: "bar",
            name: "Histogram",
            marker: { color: "rgba(200,200,200,0.5)" },
          },
        ]}
        layout={{
          paper_bgcolor: "black",
          plot_bgcolor: "black",
          font: { color: "white" },
          height: 300,
          margin: { t: 30, l: 50, r: 30, b: 50 },
        }}
        style={{ width: "100%" }}
      />
    </div>
  );
}
