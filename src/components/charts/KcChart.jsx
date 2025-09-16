import Plot from "react-plotly.js";

export default function KcChart({ candles }) {
  const times = candles.map(c => new Date(c.time));
  const kcUpper = candles.map(c => c.kc?.upper ?? null);
  const kcMiddle = candles.map(c => c.kc?.middle ?? null);
  const kcLower = candles.map(c => c.kc?.lower ?? null);

  return (
    <div className="bg-black p-3 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-2">Keltner Channel</h2>
      <Plot
        data={[
          {
            x: times,
            y: kcUpper,
            type: "scatter",
            mode: "lines",
            line: { width: 1, color: "#00ccff" },
            name: "KC Upper",
          },
          {
            x: times,
            y: kcMiddle,
            type: "scatter",
            mode: "lines",
            line: { width: 2, color: "#ffffff" },
            name: "KC Middle",
          },
          {
            x: times,
            y: kcLower,
            type: "scatter",
            mode: "lines",
            line: { width: 1, color: "#00ccff" },
            name: "KC Lower",
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
