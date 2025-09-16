import Plot from "react-plotly.js";

export default function SupertrendChart({ candles }) {
  const times = candles.map(c => new Date(c.time));
  const supertrend = candles.map(c => c.supertrend?.value ?? null);

  return (
    <div className="bg-black p-3 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-2">Supertrend</h2>
      <Plot
        data={[
          {
            x: times,
            y: supertrend,
            type: "scatter",
            mode: "lines",
            line: { width: 2, color: "#00ff88" },
            name: "Supertrend",
          },
        ]}
        layout={{
          autosize: true,
          paper_bgcolor: "black",
          plot_bgcolor: "black",
          font: { color: "white" },
          margin: { l: 40, r: 20, t: 20, b: 30 },
        }}
        style={{ width: "100%", height: "300px" }}
        useResizeHandler
      />
    </div>
  );
}
