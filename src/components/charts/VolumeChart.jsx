import Plot from "react-plotly.js";

export default function VolumeChart({ candles }) {
  if (!candles.length) return null;

  const times = candles.map((c) => new Date(c.time));

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">Volume</h2>
      <Plot
        data={[
          {
            x: times,
            y: candles.map((c) => c.volume),
            type: "bar",
            name: "Volume",
            marker: {
              color: candles.map((c) =>
                c.close > c.open ? "rgba(0,200,5,0.6)" : "rgba(200,0,0,0.6)"
              ),
            },
          },
        ]}
        layout={{
          paper_bgcolor: "black",
          plot_bgcolor: "black",
          font: { color: "white" },
          height: 300,
          margin: { t: 10, l: 60, r: 40, b: 60 },
          showlegend: false,
          xaxis: {
            showticklabels: true, // time at bottom
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
