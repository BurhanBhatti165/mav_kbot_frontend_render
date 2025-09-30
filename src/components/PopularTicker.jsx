import { useEffect, useState } from "react";

export default function PopularTicker() {
  const [coins, setCoins] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://mav-kbot-backend-vercel.vercel.app';

  // Debug API_BASE
  console.log('🪙 PopularTicker API_BASE:', API_BASE);

  // Debug logging
  const logError = (context, error, additionalInfo = {}) => {
    console.error(`[POPULAR_TICKER][${context}] Error:`, {
      message: error.message,
      stack: error.stack,
      ...additionalInfo,
      timestamp: new Date().toISOString()
    });
  };

  async function fetchPopular() {
    try {
      setLoading(true);
      
      const res = await fetch(`${API_BASE}/api/popular`, {
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
        throw new Error(`Popular API Error (${res.status}): ${errorData.detail || 'Unknown error'}`);
      }
      
      const json = await res.json();
      const data = Array.isArray(json) ? json : [];
      
      console.log('[POPULAR_TICKER] Popular coins loaded successfully:', { count: data.length });
      setCoins(data);
      setError(null);
      
    } catch (err) {
      logError('FETCH_POPULAR', err, { apiBase: API_BASE });
      setError(err.message);
      setCoins([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPopular();
    const interval = setInterval(fetchPopular, 5 * 60 * 1000); // every 2 min
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed h-8 bottom-0 left-0 right-0 bg-[#111] border-t border-gray-800 py-2 px-3 shadow-lg flex items-center gap-6 overflow-hidden">
      {/* ✅ Fixed Title */}
      <div className="font-semibold text-pink-400 uppercase tracking-wide whitespace-nowrap">
        ⏳ Last 24h Popular Coins
      </div>

      {/* ✅ Content */}
      <div className="flex-1 overflow-hidden">
        {error ? (
          <div className="text-red-400 text-sm flex items-center gap-2">
            <span>⚠️</span>
            <span>Popular coins unavailable: {error}</span>
          </div>
        ) : loading ? (
          <div className="text-gray-400 text-sm flex items-center gap-2">
            <div className="w-3 h-3 border border-pink-400 border-t-transparent rounded-full animate-spin"></div>
            <span>Loading popular coins...</span>
          </div>
        ) : coins.length === 0 ? (
          <div className="text-gray-500 text-sm">
            No popular coins data available
          </div>
        ) : (
          <div className="flex gap-6 animate-marquee whitespace-nowrap text-sm">
            {[...coins, ...coins].map((coin, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-[#1e1e1e] px-3 py-0 rounded-lg hover:bg-[#2a2a2a] transition"
              >
                <span className="font-semibold text-green-400">{coin.symbol}</span>
                <span className="text-gray-200">
                  ${coin.price.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
