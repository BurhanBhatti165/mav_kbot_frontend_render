import Plot from "react-plotly.js";

export default function StochChart({ candles }) {
  if (!candles.length) return null;

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">Stochastic Oscillator</h2>
      <Plot
        data={[
          {
            x: candles.map((c) => new Date(c.time)),
            y: candles.map((c) => c.stoch?.k ?? null),
            type: "scatter",
            mode: "lines",
            name: "%K",
            line: { color: "#00ff88" },
          },
          {
            x: candles.map((c) => new Date(c.time)),
            y: candles.map((c) => c.stoch?.d ?? null),
            type: "scatter",
            mode: "lines",
            name: "%D",
            line: { color: "#ffaa00" },
          },
        ]}
        layout={{
          paper_bgcolor: "black",
          plot_bgcolor: "black",
          font: { color: "white" },
          height: 300,
          margin: { t: 30, l: 50, r: 30, b: 50 },
          yaxis: { range: [0, 100] },
        }}
        style={{ width: "100%" }}
      />
    </div>
  );
}
