import { useState, useEffect, useRef } from "react";

export default function SymbolSearch({ onSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const wrapperRef = useRef(null);

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
      try {
        const url = query
          ? `${API_BASE}/api/search?q=${query}`
          : `${API_BASE}/api/search`; // ✅ empty query returns all

        const res = await fetch(url);
        let data;
        try {
          const json = await res.json();
          data = json.symbols || [];
        } catch (parseErr) {
          console.error("Response not JSON:", parseErr);
          data = [];
        }
        setResults(data);
      } catch (err) {
        console.error("Error fetching symbols:", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query, showDropdown]);

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
      {/* <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
        🔍
      </span> */}

      {/* Dropdown */}
      {showDropdown && (
        <ul className="absolute left-0 right-0 bg-[#1e1e1e] border border-[#404040] rounded-lg mt-2 max-h-60 overflow-y-auto z-50 shadow-lg">
          {results?.length > 0 ? (
            results.map((symbol) => (
              <li
                key={symbol}
                onClick={() => {
                  onSelect(symbol);
                  setQuery(symbol);
                  setShowDropdown(false);
                }}
                className="px-4 py-3 cursor-pointer hover:bg-[#404040] transition text-green-400 font-bold"
              >
                {symbol}
              </li>
            ))
          ) : (
            <li className="px-4 py-3 text-gray-400 text-center">
              No results found
            </li>
          )}
        </ul>
      )}

      {loading && (
        <div className="absolute left-0 right-0 mt-1 text-center text-xs text-gray-400">
          Loading...
        </div>
      )}
    </div>
  );
}