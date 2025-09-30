import { useEffect, useState } from "react";

export default function TimeFrameSelector({ current, onSelect }) {
  const [timeframes, setTimeframes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://mav-kbot-backend-vercel.vercel.app';

  // Debug API_BASE
  console.log('⏰ TimeFrameSelector API_BASE:', API_BASE);

  // Debug logging
  const logError = (context, error, additionalInfo = {}) => {
    console.error(`[TIMEFRAME_SELECTOR][${context}] Error:`, {
      message: error.message,
      stack: error.stack,
      ...additionalInfo,
      timestamp: new Date().toISOString()
    });
  };

  async function fetchTimeframes() {
    try {
      setLoading(true);
      setError(null);
      
      const res = await fetch(`${API_BASE}/api/timeframes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { detail: errorText || `HTTP ${res.status}: ${res.statusText}` };
        }
        throw new Error(`Timeframes API Error (${res.status}): ${errorData.detail || 'Unknown error'}`);
      }
      
      const json = await res.json();
      const data = Array.isArray(json) ? json : [];
      
      console.log('[TIMEFRAME_SELECTOR] Timeframes loaded successfully:', { count: data.length });
      setTimeframes(data);
      
    } catch (err) {
      logError('FETCH_TIMEFRAMES', err, { apiBase: API_BASE });
      setError(err.message);
      
      // Fallback to default timeframes
      const fallbackTimeframes = [
        { interval: "1m", label: "1 Minute" },
        { interval: "5m", label: "5 Minutes" },
        { interval: "15m", label: "15 Minutes" },
        { interval: "1h", label: "1 Hour" },
        { interval: "4h", label: "4 Hours" },
        { interval: "1d", label: "1 Day" }
      ];
      setTimeframes(fallbackTimeframes);
      console.log('[TIMEFRAME_SELECTOR] Using fallback timeframes');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTimeframes();
  }, []);

  return (
    <div className="flex flex-col items-center">
      {error && (
        <div className="mb-2 text-xs text-red-400 text-center max-w-xs">
          ⚠️ Timeframes: {error}
        </div>
      )}
      
      <div className="flex gap-2 justify-center flex-wrap mb-4">
        {loading ? (
          <div className="px-4 py-2 text-sm text-gray-400 flex items-center gap-2">
            <div className="w-3 h-3 border border-green-400 border-t-transparent rounded-full animate-spin"></div>
            Loading timeframes...
          </div>
        ) : timeframes.length === 0 ? (
          <div className="px-4 py-2 text-sm text-gray-400">
            No timeframes available
          </div>
        ) : (
          timeframes.map((tf) => (
            <button
              key={tf.interval}
              className={`px-2 py-2 rounded-md text-sm transition cursor-pointer hover:bg-[#404040] hover:cursor-pointer ${
                current === tf.interval
                  ? "bg-[#00ff88] text-black font-bold"
                  : "bg-[#404040] text-white hover:bg-[#505050]"
              }`}
              onClick={() => {
                onSelect(tf.interval);
                console.log('[TIMEFRAME_SELECTOR] Timeframe selected:', tf.interval);
              }}
            >
              {tf.label}
            </button>
          ))
        )}
      </div>
    </div>
  );
}

