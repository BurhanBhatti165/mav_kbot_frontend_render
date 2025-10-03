// LineChart.js
import React, { useEffect, useRef } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import zoomPlugin from 'chartjs-plugin-zoom';

// Register chart.js components and the zoom plugin
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  zoomPlugin
);

const LineChart = ({ data, onZoomChange, symbol }) => {
  const chartRef = useRef(null);

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: `${symbol} Price Prediction (Line Chart)`
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `$${tooltipItem.raw.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      y: {
        ticks: {
          callback: function(value) {
            return `$${value.toLocaleString()}`;
          }
        }
      }
    },
    // Enable zoom functionality
    interaction: {
      mode: 'index',
      intersect: false
    },
    zoom: {
      pan: {
        enabled: true,
        mode: 'xy', // Pan in both directions (X and Y)
        onPanComplete: (e) => {
          if (onZoomChange) onZoomChange(e);
        }
      },
      zoom: {
        enabled: true,
        mode: 'xy', // Zoom in both directions (X and Y)
        onZoomComplete: (e) => {
          if (onZoomChange) onZoomChange(e);
        }
      }
    }
  };

  return (
    <div className="p-4 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-xl text-white mb-4">{symbol} Price Prediction (Line Chart)</h2>
      <Line ref={chartRef} data={data} options={options} />
    </div>
  );
};

export default LineChart;