import Plot from "react-plotly.js";

export default function CciChart({ candles }) {
  const times = candles.map(c => new Date(c.time));
  const cci = candles.map(c => c.cci ?? null);

  return (
    <div className="bg-black p-3 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-2">CCI (Commodity Channel Index)</h2>
      <Plot
        data={[
          {
            x: times,
            y: cci,
            type: "scatter",
            mode: "lines",
            line: { width: 2, color: "#ff9900" },
            name: "CCI",
          },
        ]}
        layout={{
          autosize: true,
          paper_bgcolor: "black",
          plot_bgcolor: "black",
          font: { color: "white" },
          margin: { l: 40, r: 20, t: 20, b: 30 },
          shapes: [
            {
              type: "line",
              x0: times[0],
              x1: times[times.length - 1],
              y0: 100,
              y1: 100,
              line: { color: "#888", width: 1, dash: "dash" },
            },
            {
              type: "line",
              x0: times[0],
              x1: times[times.length - 1],
              y0: -100,
              y1: -100,
              line: { color: "#888", width: 1, dash: "dash" },
            },
          ],
        }}
        style={{ width: "100%", height: "300px" }}
        useResizeHandler
      />
    </div>
  );
}
