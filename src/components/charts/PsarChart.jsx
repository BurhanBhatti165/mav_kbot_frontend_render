import Plot from "react-plotly.js";

export default function PsarChart({ candles }) {
  const times = candles.map(c => new Date(c.time));
  const psar = candles.map(c => c.psar ?? null);

  return (
    <div className="bg-black p-3 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-2">Parabolic SAR</h2>
      <Plot
        data={[
          {
            x: times,
            y: psar,
            mode: "markers",
            marker: { color: "#ffcc00", size: 6, symbol: "circle" },
            name: "PSAR",
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
