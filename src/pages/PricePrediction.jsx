import React, { useState } from "react";
import LineChart from "../components/charts/LineChart";
import SymbolSearch from "../components/SymbolSearch";

const PricePrediction = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const [coin, setCoin] = useState("Bitcoin"); // Default coin
  const [timeframe, setTimeframe] = useState("1 Month"); // Default timeframe
  const initialSymbol = searchParams.get("symbol") || "BTCUSDT";
  const [symbol, setSymbol] = useState(initialSymbol);
  
  // Manually hardcoded data for actual and predicted values for Bitcoin, Ethereum, and Cardano
  const coinData = {
    Bitcoin: {
      // Labels from January 2025 to December 2025
      labels: [
        'Jan 2025', 'Feb 2025', 'Mar 2025', 'Apr 2025', 'May 2025', 'Jun 2025', 
        'Jul 2025', 'Aug 2025', 'Sep 2025', 'Oct 2025', 'Nov 2025', 'Dec 2025'
      ],
      datasets: [
        {
          label: "Actual Price", 
          data: [40000, 42000, 43000, 44000, 45000, 46000, 47000, 48000, 49000], // Actual data for Jan-Sep 2025
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          fill: true, // Fill the actual price line area
        },
        {
          label: "Predicted Price", 
          data: [41800, 44500, 45700, 46300, 46900, 47700, 49800, 50800, 52300, 53000, 55500, 53300], // Predicted data for Jan-Dec 2025
          borderColor: "rgba(255, 159, 64, 1)", // Different color for predicted data
          backgroundColor: "rgba(255, 159, 64, 0.2)",
          fill: false, // Don't fill the predicted price area
          borderDash: [5, 5], // Dashed line for predicted price
        }
      ]
    },
    Ethereum: {
      labels: [
        'Jan 2025', 'Feb 2025', 'Mar 2025', 'Apr 2025', 'May 2025', 'Jun 2025', 
        'Jul 2025', 'Aug 2025', 'Sep 2025', 'Oct 2025', 'Nov 2025', 'Dec 2025'
      ],
      datasets: [
        {
          label: "Actual Price", 
          data: [2500, 2700, 2800, 2900, 3100, 3200, 3300, 3400, 3500], // Actual data for Jan-Sep 2025
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          fill: true, // Fill the actual price line area
        },
        {
          label: "Predicted Price", 
          data: [2550, 2790, 2900, 2990, 3150, 3300, 3370, 3500, 3580, 3650, 3700, 3800], // Predicted data for Jan-Dec 2025
          borderColor: "rgba(255, 159, 64, 1)", // Different color for predicted data
          backgroundColor: "rgba(255, 159, 64, 0.2)",
          fill: false, // Don't fill the predicted price area
          borderDash: [5, 5], // Dashed line for predicted price
        }
      ]
    },
    Cardano: {
      labels: [
        'Jan 2025', 'Feb 2025', 'Mar 2025', 'Apr 2025', 'May 2025', 'Jun 2025', 
        'Jul 2025', 'Aug 2025', 'Sep 2025', 'Oct 2025', 'Nov 2025', 'Dec 2025'
      ],
      datasets: [
        {
          label: "Actual Price", 
          data: [1.0, 1.1, 1.2, 1.3, 1.5, 1.6, 1.7, 1.8, 1.9], // Actual data for Jan-Sep 2025
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          fill: true, // Fill the actual price line area
        },
        {
          label: "Predicted Price", 
          data: [1.05, 1.15, 1.28, 1.33, 1.55, 1.67, 1.79, 1.84, 1.91, 2.0, 2.1, 2.2], // Predicted data for Jan-Dec 2025
          borderColor: "rgba(255, 159, 64, 1)", // Different color for predicted data
          backgroundColor: "rgba(255, 159, 64, 0.2)",
          fill: false, // Don't fill the predicted price area
          borderDash: [5, 5], // Dashed line for predicted price
        }
      ]
    }
  };

  // Handle coin selection change
  const handleCoinChange = (event) => {
    setCoin(event.target.value);
  };

  // Handle timeframe selection change
  const handleTimeframeChange = (event) => {
    setTimeframe(event.target.value);
  };

  return (
    <div className="p-6 bg-gray-800 min-h-screen">
      {/* <div className="mb-4 text-white">
        <label className="mr-4">Select Coin:</label>
        <select
          value={coin}
          onChange={handleCoinChange}
          className="p-2 rounded bg-gray-700 text-white"
        >
          <option value="Bitcoin">Bitcoin</option>
          <option value="Ethereum">Ethereum</option>
          <option value="Cardano">Cardano</option>
        </select>
      </div> */}
      <div className="flex justify-center">
        <SymbolSearch onSelect={(sym) => setSymbol(sym)} />
      </div>

      <div className="mt-4">
        <LineChart
          data={coinData[coin]} // Passing the combined data (actual + predicted)
        />
      </div>
    </div>
  );
};

export default PricePrediction;