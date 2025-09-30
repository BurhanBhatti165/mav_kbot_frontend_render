import { useState, useEffect, useRef } from "react";

export default function SymbolSearch({ onSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://mav-kbot-backend-vercel.vercel.app';
  const wrapperRef = useRef(null);

  // Debug API_BASE
  console.log('🔍 SymbolSearch API_BASE:', API_BASE);

  // Debug logging
  const logError = (context, error, additionalInfo = {}) => {
    console.error(`[SYMBOL_SEARCH][${context}] Error:`, {
      message: error.message,
      stack: error.stack,
      ...additionalInfo,
      timestamp: new Date().toISOString(),
      apiBase: API_BASE
    });
  };

  const logInfo = (context, message, data = {}) => {
    console.log(`[SYMBOL_SEARCH][${context}] ${message}:`, {
      ...data,
      timestamp: new Date().toISOString()
    });
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch symbols whenever query changes or dropdown is opened
  useEffect(() => {
    if (!showDropdown) return;

    const timeout = setTimeout(async () => {
      setLoading(true);
      setError(null);
      
      try {
        const url = query
          ? `${API_BASE}/api/search?q=${encodeURIComponent(query)}`
          : `${API_BASE}/api/search`;
          
        logInfo('FETCH_SYMBOLS', 'Starting request', { url, query });

        const res = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 15000, // 15 second timeout
        });
        
        logInfo('FETCH_SYMBOLS', 'Response received', { 
          status: res.status, 
          statusText: res.statusText 
        });
        
        if (!res.ok) {
          const errorText = await res.text();
          let errorData;
          try {
            errorData = JSON.parse(errorText);
          } catch {
            errorData = { detail: errorText || `HTTP ${res.status}: ${res.statusText}` };
          }
          
          throw new Error(`Search API Error (${res.status}): ${errorData.detail || errorData.message || 'Unknown error'}`);
        }
        
        let data;
        try {
          const json = await res.json();
          data = json.symbols || json || [];
        } catch (parseErr) {
          logError('FETCH_SYMBOLS', parseErr, { responseStatus: res.status });
          throw new Error('Failed to parse response as JSON');
        }
        
        if (!Array.isArray(data)) {
          logError('FETCH_SYMBOLS', new Error('Invalid data format'), { data });
          data = [];
        }
        
        logInfo('FETCH_SYMBOLS', 'Data processed successfully', { symbolCount: data.length });
        setResults(data);
        setError(null);
        
      } catch (err) {
        logError('FETCH_SYMBOLS', err, { query, url: query ? `${API_BASE}/api/search?q=${query}` : `${API_BASE}/api/search` });
        setError(err.message);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query, showDropdown, API_BASE]);

  return (
    <div className="relative max-w-md mx-auto mb-5" ref={wrapperRef}>
      <input
        type="text"
        className="w-full py-3 px-15 text-lg border-2 border-[#404040] rounded-full bg-[#404040] text-white text-center uppercase focus:outline-none focus:border-[#00ff88] focus:bg-[#505050] transition"
        placeholder="Search crypto symbols (e.g., BTCUSDT)"
        value={query}
        onFocus={() => setShowDropdown(true)}
        onChange={(e) => setQuery(e.target.value.toUpperCase())}
      />
      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
        🔍
      </span>

      {/* Dropdown */}
      {showDropdown && (
        <ul className="absolute left-0 right-0 bg-[#1e1e1e] border border-[#404040] rounded-lg mt-2 max-h-60 overflow-y-auto z-50 shadow-lg">
          {error ? (
            <li className="px-4 py-3 text-red-400 text-center">
              <div className="text-sm font-medium">⚠️ Search Error</div>
              <div className="text-xs mt-1 text-red-300">{error}</div>
            </li>
          ) : results?.length > 0 ? (
            results.map((symbol) => (
              <li
                key={symbol}
                onClick={() => {
                  onSelect(symbol);
                  setQuery(symbol);
                  setShowDropdown(false);
                  logInfo('SELECT_SYMBOL', 'Symbol selected', { symbol });
                }}
                className="px-4 py-3 cursor-pointer hover:bg-[#404040] transition text-green-400 font-bold"
              >
                {symbol}
              </li>
            ))
          ) : loading ? (
            <li className="px-4 py-3 text-gray-400 text-center">
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></div>
                Searching...
              </div>
            </li>
          ) : (
            <li className="px-4 py-3 text-gray-400 text-center">
              No symbols found
              {query && (
                <div className="text-xs mt-1">Try a different search term</div>
              )}
            </li>
          )}
        </ul>
      )}

      {loading && (
        <div className="absolute left-0 right-0 mt-1 text-center text-xs text-gray-400">
          <div className="flex items-center justify-center gap-2">
            <div className="w-3 h-3 border border-green-400 border-t-transparent rounded-full animate-spin"></div>
            {error ? 'Retrying...' : 'Searching symbols...'}
          </div>
        </div>
      )}
    </div>
  );
}
