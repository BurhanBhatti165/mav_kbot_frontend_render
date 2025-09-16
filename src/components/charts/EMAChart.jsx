import Plot from "react-plotly.js";

export default function EMAChart({ candles, periods = [20, 50] }) {
  if (!candles.length) return null;

  const traces = periods.map((p) => ({
    x: candles.map((c) => new Date(c.time)),
    y: candles.map((c) => c.ema?.[p] ?? null),
    type: "scatter",
    mode: "lines",
    name: `EMA ${p}`,
  }));

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">Exponential Moving Average</h2>
      <Plot
        data={traces}
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
