import Plot from "react-plotly.js";

export default function RSIChart({ candles, rsiPeriod, setRsiPeriod }) {
  if (!candles.length) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">RSI ({rsiPeriod})</h2>

        <select
          value={rsiPeriod}
          onChange={(e) => setRsiPeriod(Number(e.target.value))}
          className="py-2 px-3 rounded bg-[#2a2a2a] border border-[#404040] text-sm cursor-pointer"
        >
          {[6, 8, 12, 14, 24].map((val) => (
            <option key={val} value={val}>
              RSI {val}
            </option>
          ))}
        </select>
      </div>

      <Plot
        data={[
          {
            x: candles.map((c) => new Date(c.time)),
            y: candles.map((c) => c.rsi?.[rsiPeriod] ?? null),
            type: "scatter",
            mode: "lines",
            line: { color: "#ffaa00" },
            name: `RSI ${rsiPeriod}`,
          },
        ]}
        layout={{
          paper_bgcolor: "black",
          plot_bgcolor: "black",
          font: { color: "white" },
          height: 300,
          margin: { t: 30, l: 50, r: 30, b: 50 },
          yaxis: { range: [0, 100] },
          shapes: [
            {
              type: "line",
              x0: 0,
              x1: 1,
              xref: "paper",
              y0: 30,
              y1: 30,
              yref: "y",
              line: { color: "green", width: 1 },
            },
            {
              type: "line",
              x0: 0,
              x1: 1,
              xref: "paper",
              y0: 70,
              y1: 70,
              yref: "y",
              line: { color: "red", width: 1 },
            },
          ],
        }}
        style={{ width: "100%" }}
      />
    </div>
  );
}
