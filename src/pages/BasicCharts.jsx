import { useState, useEffect, useRef } from "react";
// import Select from "react-select";


import SymbolSearch from "../components/SymbolSearch";
import PopularTicker from "../components/PopularTicker";
import TimeframeSelector from "../components/TimeFrameSelector";
import Spinner from "../components/Spinner";

// Indicator subcomponents
import PriceChart from "../components/charts/PriceChart";
import RSIChart from "../components/charts/RSIChart";
import SMAChart from "../components/charts/SMAChart";
import EMAChart from "../components/charts/EMAChart";
import MACDChart from "../components/charts/MACDChart";
import BBChart from "../components/charts/BBChart";
import StochChart from "../components/charts/StochChart";
import VolumeChart from "../components/charts/VolumeChart";

import SupertrendChart from "../components/charts/SupertrendChart";
import PsarChart from "../components/charts/PsarChart";
import KcChart from "../components/charts/KcChart";
import CciChart from "../components/charts/CciChart";


import Select, { components } from "react-select";

// ✅ Custom Option component with checkbox
const CheckboxOption = (props) => (
  <components.Option {...props}>
    <input
      type="checkbox"
      checked={props.isSelected}
      onChange={() => null}
      className="mr-2 accent-[#00ff88] cursor-pointer"
    />
    <label>{props.label}</label>
  </components.Option>
);

// ✅ Custom ValueContainer (shows only count, not tags)
const ValueContainer = ({ children, getValue, ...props }) => {
  const count = getValue().length;
  return (
    <components.ValueContainer {...props}>
      {count > 0 ? `${count} indicators selected` : "Select indicators..."}
    </components.ValueContainer>
  );
};

export default function BasicCharts() {
  const searchParams = new URLSearchParams(window.location.search);

  // 🔹 Base states
  const initialSymbol = searchParams.get("symbol") || "BTCUSDT";
  const initialTimeframe = searchParams.get("timeframe") || "15m";
  const initialLimit = Number(searchParams.get("limit")) || 150;

  // Indicators stored in URL or empty
  const [selectedIndicators, setSelectedIndicators] = useState(
    searchParams.get("indicators")?.split(",") || []
  );

  const [rsiPeriod, setRsiPeriod] = useState(Number(searchParams.get("rsi_periods")) || 12);
  const [smaPeriods, setSmaPeriods] = useState([20, 50]);
  const [emaPeriods, setEmaPeriods] = useState([20, 50]);

  const [symbol, setSymbol] = useState(initialSymbol);
  const [timeframe, setTimeframe] = useState(initialTimeframe);
  const [limit, setLimit] = useState(initialLimit);
  const [candles, setCandles] = useState([]);
  const [loading, setLoading] = useState(false);

  const wsRef = useRef(null);
  const pollRef = useRef(null);
  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const ENABLE_WS = String(import.meta.env.VITE_ENABLE_WS ?? "true").toLowerCase() === "true";

  // Dropdown options
  const allIndicators = [
    { value: "Volumes", label: "Volumes" },
    { value: "RSI", label: "RSI" },
    { value: "SMA", label: "SMA" },
    { value: "EMA", label: "EMA" },
    { value: "MACD", label: "MACD" },
    { value: "Bollinger Bands", label: "Bollinger Bands" },
    { value: "Stochastic", label: "Stochastic" },
    { value: "Supertrend", label: "Supertrend" },      // ✅ new
    { value: "PSAR", label: "PSAR" },                                  // ✅ new
    { value: "Keltner Channel", label: "Keltner Channel" }, // ✅ new
    { value: "CCI", label: "CCI" },                    // ✅ new
  ];

  // 🔹 Build query string for API/WS
  function buildQuery() {
    let query = `interval=${timeframe}&symbol=${symbol}&limit=${limit}`;
    if (selectedIndicators.includes("Volumes")) query += `&volumes=true`;
    if (selectedIndicators.includes("RSI")) query += `&include_rsi=true&rsi_periods=${rsiPeriod}`;
    if (selectedIndicators.includes("SMA")) query += `&include_sma=true&sma_periods=${smaPeriods.join(",")}`;
    if (selectedIndicators.includes("EMA")) query += `&include_ema=true&ema_periods=${emaPeriods.join(",")}`;
    if (selectedIndicators.includes("MACD")) query += `&include_macd=true&macd=12,26,9`;
    if (selectedIndicators.includes("Bollinger Bands")) query += `&include_bb=true&bb=20,2`;
    if (selectedIndicators.includes("Stochastic")) query += `&include_stoch=true&stoch=14,3,3`;

    if (selectedIndicators.includes("Supertrend")) query += `&include_supertrend=true&supertrend=10,3.0`;
    if (selectedIndicators.includes("PSAR")) query += `&include_psar=true&psar=0.02,0.2`;
    if (selectedIndicators.includes("Keltner Channel")) query += `&include_kc=true&kc=20,2.0`;
    if (selectedIndicators.includes("CCI")) query += `&include_cci=true&cci=20`;

    return query;
  }

  // 🔹 Fetch chart data
  async function fetchChart() {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/data?${buildQuery()}`);
      const json = await res.json();
      if (Array.isArray(json)) setCandles(json);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  // 🔹 Connect WebSocket
  function connectWS() {
    // If WS disabled (env) or API_BASE is a vercel host (which doesn't support WS), skip WS and use polling
    const isVercelHost = (API_BASE || "").includes("vercel.app");
    if (!ENABLE_WS || isVercelHost) {
      // ensure any socket is closed
      if (wsRef.current) {
        wsRef.current.onclose = null;
        wsRef.current.close();
        wsRef.current = null;
      }
      // start polling
      if (pollRef.current) clearInterval(pollRef.current);
      const POLL_MS = {
        // Short but consistent (non-decreasing) polling intervals per timeframe
        "1m": 2000,
        "3m": 3000,
        "5m": 5000,
        "15m": 8000,
        "30m": 12000,
        "1h": 15000,
        "2h": 20000,
        "4h": 30000,
        "6h": 45000,
        "8h": 60000,
        "12h": 90000,
        "1d": 120000,
        "3d": 180000,
        "1w": 240000,
        "1M": 300000,
      };
      pollRef.current = setInterval(() => {
        fetchChart();
      }, POLL_MS[timeframe] || 10000);
      return;
    }
    if (wsRef.current) {
      wsRef.current.onclose = null;
      wsRef.current.close();
    }
  // Derive WS base from API base (supports http->ws, https->wss)
  const httpBase = (API_BASE || "http://127.0.0.1:8000").replace(/\/$/, "");
  const wsScheme = httpBase.startsWith("https") ? "wss" : "ws";
  const wsBase = httpBase.replace(/^https?/, wsScheme);
  const url = `${wsBase}/ws/data?${buildQuery()}`;
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === "snapshot" && msg.candles) {
          setCandles(msg.candles);
        }
        if (msg.type === "update" && msg.candle) {
          setCandles((prev) => {
            const updated = [...prev];
            const c = msg.candle;
            if (msg.is_new_bar) return [...updated, c].slice(-limit);
            updated[updated.length - 1] = c;
            return [...updated];
          });
        }
      } catch (e) {
        console.error("WS parse error:", e);
      }
    };

    ws.onclose = () => {
      setTimeout(() => connectWS(), 3000);
    };
  }

  // 🔹 Effect: sync URL + fetch + connect WS
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("symbol", symbol);
    url.searchParams.set("timeframe", timeframe);
    url.searchParams.set("limit", limit);
    url.searchParams.set("indicators", selectedIndicators.join(","));
    url.searchParams.set("rsi_periods", rsiPeriod);
    window.history.replaceState({}, "", url);

    fetchChart().then(() => {
      // reset any existing poller
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
      connectWS();
    });

    return () => {
      if (wsRef.current) {
        wsRef.current.onclose = null;
        wsRef.current.close();
      }
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, [symbol, timeframe, limit, selectedIndicators, rsiPeriod, smaPeriods, emaPeriods]);

  return (
    <div className="p-5 bg-gray-900 min-h-screen text-white">
      <h1 className="text-center text-2xl font-bold mb-4">Crypto Live Chart</h1>

      {/* Controls */}
      <div className="flex flex-wrap flex-col gap-4 justify-center items-center mb-4">
        <div>
          <SymbolSearch onSelect={(sym) => setSymbol(sym)} />
        </div>
        <div>
          <TimeframeSelector current={timeframe} onSelect={setTimeframe} />
        </div>
      </div>

      {/* Dropdown + Limit Selector */}
      <div className="flex flex-wrap gap-3 justify-start mb-4">
        <div className="min-w-[260px] max-w-[260px]">
          <Select
            isMulti
            closeMenuOnSelect={false}    // ✅ keeps dropdown open
            hideSelectedOptions={false}  // ✅ keep checkboxes visible
            options={allIndicators}
            value={allIndicators.filter((opt) =>
              selectedIndicators.includes(opt.value)
            )}
            onChange={(selected) =>
              setSelectedIndicators(selected.map((s) => s.value))
            }
            components={{ Option: CheckboxOption, ValueContainer }}
            styles={{
              control: (base) => ({
                ...base,
                backgroundColor: "#2a2a2a",
                borderColor: "#404040",
                borderRadius: "0.5rem",
                padding: "2px 4px",
                color: "white",
                minHeight: "40px",
                boxShadow: "none",
              }),
              menu: (base) => ({
                ...base,
                backgroundColor: "#1c1c1c",
                border: "1px solid #404040",
                borderRadius: "0.5rem",
                marginTop: "2px",
                zIndex: 100,
              }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isFocused ? "#333" : "#1c1c1c",
                color: "white",
                cursor: "pointer",
                padding: "8px 12px",
              }),
              valueContainer: (base) => ({
                ...base,
                color: "white",
                fontSize: "14px",
              }),
              placeholder: (base) => ({
                ...base,
                color: "#aaa",
              }),
            }}
          />
        </div>
        <select
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          className="py-2 px-3 text-sm border-2 border-[#404040] rounded-md bg-[#2a2a2a] text-white cursor-pointer"
        >
          {Array.from({ length: 10 }, (_, i) => (i + 1) * 100).map((val) => (
            <option key={val} value={val} className="bg-[#2a2a2a]">
              {val} candles
            </option>
          ))}
        </select>
      </div>

      {/* Charts */}
      <div className="space-y-6">
        <div className="w-full">
          <PriceChart candles={candles} symbol={symbol} />
          {selectedIndicators.includes("Volumes") && <VolumeChart candles={candles} />}
        </div>
        {selectedIndicators.includes("RSI") && (
          <RSIChart candles={candles} rsiPeriod={rsiPeriod} setRsiPeriod={setRsiPeriod} />
        )}
        {selectedIndicators.includes("SMA") && (
          <SMAChart candles={candles} periods={smaPeriods} loading={loading} />
        )}
        {selectedIndicators.includes("EMA") && (
          <EMAChart candles={candles} periods={emaPeriods} loading={loading} />
        )}
        {selectedIndicators.includes("MACD") && <MACDChart candles={candles} loading={loading} />}
        {selectedIndicators.includes("Bollinger Bands") && <BBChart candles={candles} loading={loading} />}
        {selectedIndicators.includes("Stochastic") && <StochChart candles={candles} loading={loading} />}

        {selectedIndicators.includes("Supertrend") && <SupertrendChart candles={candles} />}
        {selectedIndicators.includes("PSAR") && <PsarChart candles={candles} />}
        {selectedIndicators.includes("Keltner Channel") && <KcChart candles={candles} />}
        {selectedIndicators.includes("CCI") && <CciChart candles={candles} />}



      </div>

      <PopularTicker />
    </div>
  );
}