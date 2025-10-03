import React, { useEffect, useState } from "react";
import LineChart from "../components/charts/LineChart";
import SymbolSearch from "../components/SymbolSearch";
import axios from "axios";
import CircularLoader from "../components/CircularLoader";
import TimeFrameSelector from "../components/TimeFrameSelector";

const PricePrediction = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const initialSymbol = searchParams.get("symbol") || "BTCUSDT";
  const [symbol, setSymbol] = useState(initialSymbol);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const initialTimeframe = searchParams.get("timeframe") || "15m";
  const [timeframe, setTimeframe] = useState(initialTimeframe);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        setLoading(true);

        const resHist = await axios.get(`${API_BASE}/api/data?interval=1d&symbol=${symbol}`);
        const histData = resHist.data; // array of {time, close, ...}

        // Extract times and actual prices
        const times = histData.map(entry => entry.time);
        const actual = histData.map(entry => entry.close);

        if (times.length < 1) {
          // Handle empty data, perhaps set default or error
          return;
        }

        const delta = times.length > 1 ? times[1] - times[0] : 86400000; // default to 1 day in ms

        const num_historical = times.length;
        const num_future = Math.max(1, Math.round(num_historical * 0.2));

        const future_times = [];
        let last_time = times[times.length - 1];
        for (let i = 1; i <= num_future; i++) {
          future_times.push(last_time + i * delta);
        }

        const all_times = [...times, ...future_times];

        const labels = all_times.map(t => {
          const date = new Date(t);
          if (delta >= 86400000) { // 1 day or more
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
          } else {
            return date.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' });
          }
        });

        // Fit linear regression on log prices to get slope
        const n = actual.length;
        const x = Array.from({length: n}, (_, i) => i);
        const log_actual = actual.map(p => Math.log(p));
        const sum_x = x.reduce((a, b) => a + b, 0);
        const sum_y = log_actual.reduce((a, b) => a + b, 0);
        const mean_x = sum_x / n;
        const mean_y = sum_y / n;
        const sum_xy = x.reduce((sum, xi, i) => sum + xi * log_actual[i], 0);
        const sum_xx = x.reduce((sum, xi) => sum + xi * xi, 0);
        let slope = 0;
        if (n >= 2) {
          const denominator = sum_xx - n * mean_x * mean_x;
          if (denominator !== 0) {
            slope = (sum_xy - n * mean_x * mean_y) / denominator;
          }
        }

        // Generate predicted prices starting after actual data
        const predicted = new Array(all_times.length).fill(null);
        for (let i = num_historical; i < all_times.length; i++) {
          const variation = 0.02 + Math.random() * 0.03; // 2-5%
          const sign = Math.random() > 0.5 ? 1 : -1;
          let base;
          if (i === num_historical) {
            base = actual[actual.length - 1]; // Start from last actual price
          } else {
            base = predicted[i - 1] * Math.exp(slope); // Continue trend
          }
          predicted[i] = base * (1 + sign * variation);
        }

        // Create datasets
        const datasets = [
          {
            label: "Actual Price",
            data: actual, // Historical points only
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            fill: true,
          },
          {
            label: "Predicted Price",
            data: predicted, // Only future points
            borderColor: "rgba(255, 159, 64, 1)",
            backgroundColor: "rgba(255, 159, 64, 0.2)",
            fill: false,
            borderDash: [5, 5],
          }
        ];

        // Set chart data
        setChartData({ labels, datasets });
      } catch (err) {
        console.error("Error fetching price:", err);
        // Optionally handle error, e.g., set default data
      } finally {
        setLoading(false);
      }
    };

    fetchPrice();
  }, [symbol, timeframe]);

  return (
    <div className="p-6 bg-gray-800 min-h-screen">
      <div className="flex flex-wrap flex-col gap-4 justify-center items-center mb-4">
        <div>
          <SymbolSearch onSelect={(sym) => setSymbol(sym)} />
        </div>
        <div>
          {/* time interval is fixed to 1d in api if un comment this then also add timeframe varible in api */}
          {/* <TimeFrameSelector current={timeframe} onSelect={setTimeframe} /> */}
        </div>
      </div>

      <div className="mt-4">
        {loading ? <CircularLoader /> : chartData && <LineChart data={chartData} symbol={symbol} />}
      </div>
    </div>
  );
};

export default PricePrediction;