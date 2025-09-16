import Plot from "react-plotly.js";

export default function BBChart({ candles }) {
  if (!candles.length) return null;

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">Bollinger Bands</h2>
      <Plot
        data={[
          {
            x: candles.map((c) => new Date(c.time)),
            y: candles.map((c) => c.bb?.middle ?? null),
            type: "scatter",
            mode: "lines",
            name: "Middle Band",
            line: { color: "#ffaa00" },
          },
          {
            x: candles.map((c) => new Date(c.time)),
            y: candles.map((c) => c.bb?.upper ?? null),
            type: "scatter",
            mode: "lines",
            name: "Upper Band",
            line: { color: "green" },
          },
          {
            x: candles.map((c) => new Date(c.time)),
            y: candles.map((c) => c.bb?.lower ?? null),
            type: "scatter",
            mode: "lines",
            name: "Lower Band",
            line: { color: "red" },
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
