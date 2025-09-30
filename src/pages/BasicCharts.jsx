import { useState, useEffect, useRef } from "react";
// import Select from "react-select";

import SymbolSearch from "../components/SymbolSearch";
import PopularTicker from "../components/PopularTicker";
import TimeframeSelector from "../components/TimeFrameSelector";
import Spinner from "../components/Spinner";
import DebugPanel from "../components/DebugPanel";

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

// 🛠️ Debug logging functions
const logInfo = (context, message, data = null) => {
  console.log(`🟢 [${context}] ${message}`, data || '');
};

const logError = (context, error, data = null) => {
  console.error(`🔴 [${context}] ERROR:`, {
    message: error.message,
    stack: error.stack,
    ...data
  });
};

const logWarn = (context, message, data = null) => {
  console.warn(`🟡 [${context}] ${message}`, data || '');
};

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
  const [error, setError] = useState(null);
  const [wsError, setWsError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');

  const wsRef = useRef(null);
  
  // Environment variable debugging and fallback
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://mav-kbot-backend-vercel.vercel.app';
  
  // Debug logging for environment variables
  console.log('🔧 Environment Debug:', {
    VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
    API_BASE: API_BASE,
    isDev: import.meta.env.DEV,
    mode: import.meta.env.MODE,
    allEnvVars: import.meta.env
  });
  
  // Debug logging for environment variables
  console.log('🔧 Environment Debug:', {
    VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
    API_BASE: API_BASE,
    isDev: import.meta.env.DEV,
    mode: import.meta.env.MODE,
    allEnvVars: import.meta.env
  });

  // Debug logging
  const logError = (context, error, additionalInfo = {}) => {
    console.error(`[${context}] Error:`, {
      message: error.message,
      stack: error.stack,
      ...additionalInfo,
      timestamp: new Date().toISOString(),
      apiBase: API_BASE
    });
  };

  const logInfo = (context, message, data = {}) => {
    console.log(`[${context}] ${message}:`, {
      ...data,
      timestamp: new Date().toISOString()
    });
  };

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
      setError(null);
      
      const url = `${API_BASE}/api/data?${buildQuery()}`;
      logInfo('FETCH_CHART', 'Starting API request', { url, symbol, timeframe, limit });
      
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000, // 30 second timeout
      });
      
      logInfo('FETCH_CHART', 'Response received', { 
        status: res.status, 
        statusText: res.statusText,
        headers: Object.fromEntries(res.headers.entries())
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { detail: errorText || `HTTP ${res.status}: ${res.statusText}` };
        }
        
        throw new Error(`API Error (${res.status}): ${errorData.detail || errorData.message || 'Unknown error'}`);
      }
      
      const json = await res.json();
      logInfo('FETCH_CHART', 'Data parsed successfully', { dataLength: Array.isArray(json) ? json.length : 'not array' });
      
      if (Array.isArray(json)) {
        setCandles(json);
        setError(null);
      } else {
        throw new Error('Invalid data format: Expected array of candles');
      }
    } catch (err) {
      logError('FETCH_CHART', err, { symbol, timeframe, limit, url: `${API_BASE}/api/data?${buildQuery()}` });
      setError(`Failed to fetch chart data: ${err.message}`);
      setCandles([]);
    } finally {
      setLoading(false);
    }
  }

  // 🔹 Connect WebSocket
  function connectWS() {
    try {
      if (wsRef.current) {
        wsRef.current.onopen = null;
        wsRef.current.onmessage = null;
        wsRef.current.onclose = null;
        wsRef.current.onerror = null;
        if (wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.close();
        }
        wsRef.current = null;
      }
      
      setWsError(null);
      setConnectionStatus('connecting');
      
      // Use proper WebSocket protocol based on API URL
      const wsProtocol = API_BASE.startsWith('https://') ? 'wss://' : 'ws://';
      const wsHost = API_BASE.replace(/^https?:\/\//, '');
      const url = `${wsProtocol}${wsHost}/ws/data?${buildQuery()}`;
      
      logInfo('WEBSOCKET', 'Attempting connection', { url, symbol, timeframe, limit });
      
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = (event) => {
        logInfo('WEBSOCKET', 'Connection opened successfully');
        setConnectionStatus('connected');
        setWsError(null);
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          logInfo('WEBSOCKET', 'Message received', { type: msg.type, hasCandles: !!msg.candles, hasCandle: !!msg.candle });
          
          if (msg.type === "snapshot" && msg.candles) {
            if (Array.isArray(msg.candles)) {
              setCandles(msg.candles);
              setError(null);
            } else {
              logError('WEBSOCKET', new Error('Invalid snapshot data format'), { msg });
            }
          }
          
          if (msg.type === "update" && msg.candle) {
            setCandles((prev) => {
              try {
                const updated = [...prev];
                const c = msg.candle;
                if (msg.is_new_bar) {
                  return [...updated, c].slice(-limit);
                } else {
                  if (updated.length > 0) {
                    updated[updated.length - 1] = c;
                  }
                  return [...updated];
                }
              } catch (updateError) {
                logError('WEBSOCKET', updateError, { msg, prevLength: prev.length });
                return prev;
              }
            });
          }
          
          if (msg.type === "error") {
            logError('WEBSOCKET', new Error(msg.message || 'WebSocket server error'), { msg });
            setWsError(`Server error: ${msg.message || 'Unknown error'}`);
          }
        } catch (e) {
          logError('WEBSOCKET', e, { rawData: event.data });
          setWsError(`Failed to parse WebSocket message: ${e.message}`);
        }
      };

      ws.onerror = (error) => {
        logError('WEBSOCKET', new Error('WebSocket connection error'), { error, url });
        setConnectionStatus('error');
        setWsError('WebSocket connection failed');
      };

      ws.onclose = (event) => {
        logInfo('WEBSOCKET', 'Connection closed', { 
          code: event.code, 
          reason: event.reason, 
          wasClean: event.wasClean 
        });
        
        setConnectionStatus('disconnected');
        
        // Only attempt reconnection if it wasn't a clean close
        if (!event.wasClean && event.code !== 1000) {
          setWsError('Connection lost, attempting to reconnect...');
          setTimeout(() => {
            logInfo('WEBSOCKET', 'Attempting reconnection');
            connectWS();
          }, 3000);
        }
      };
      
    } catch (err) {
      logError('WEBSOCKET', err, { API_BASE });
      setConnectionStatus('error');
      setWsError(`Failed to create WebSocket connection: ${err.message}`);
    }
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
      connectWS();
    });

    return () => {
      if (wsRef.current) {
        wsRef.current.onclose = null;
        wsRef.current.close();
      }
    };
  }, [symbol, timeframe, limit, selectedIndicators, rsiPeriod, smaPeriods, emaPeriods]);

  return (
    <div className="p-5 bg-gray-900 min-h-screen text-white">
      <h1 className="text-center text-2xl font-bold mb-4">Crypto Live Chart</h1>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-900/50 border border-red-500 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-red-400">⚠️</span>
            <span className="font-semibold text-red-300">API Error:</span>
          </div>
          <p className="text-red-200 mt-1">{error}</p>
        </div>
      )}

      {/* WebSocket Status */}
      <div className="mb-4 flex items-center justify-center gap-4">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${
            connectionStatus === 'connected' ? 'bg-green-500' :
            connectionStatus === 'connecting' ? 'bg-yellow-500 animate-pulse' :
            connectionStatus === 'error' ? 'bg-red-500' :
            'bg-gray-500'
          }`}></div>
          <span className="text-sm text-gray-300">
            {connectionStatus === 'connected' ? 'Live' :
             connectionStatus === 'connecting' ? 'Connecting...' :
             connectionStatus === 'error' ? 'Connection Error' :
             'Disconnected'}
          </span>
        </div>
        
        {wsError && (
          <div className="text-xs text-red-400 max-w-md truncate" title={wsError}>
            {wsError}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 justify-center mb-4">
        <SymbolSearch onSelect={(sym) => setSymbol(sym)} />
        <TimeframeSelector current={timeframe} onSelect={setTimeframe} />
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

      {/* Loading State */}
      {loading && (
        <div className="mb-4 flex items-center justify-center">
          <Spinner />
          <span className="ml-3 text-gray-300">Loading chart data...</span>
        </div>
      )}

      {/* Charts */}
      <div className="space-y-6">
        {candles.length === 0 && !loading && !error ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">No chart data available</div>
            <div className="text-gray-500 text-sm">
              Try selecting a different symbol or timeframe
            </div>
          </div>
        ) : (
          <div className="w-full">
            <PriceChart candles={candles} symbol={symbol} />
            {selectedIndicators.includes("Volumes") && <VolumeChart candles={candles} />}
          </div>
        )}
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
      
      <DebugPanel 
        apiBase={API_BASE}
        connectionStatus={connectionStatus}
        wsError={wsError}
        error={error}
        candlesCount={chartData?.length || 0}
        selectedIndicators={selectedIndicators}
        symbol={symbol}
        timeframe={timeframe}
      />
    </div>
  );
}
