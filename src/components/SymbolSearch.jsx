import { useState, useEffect, useRef } from "react";
import { useCrypto } from "../context/CryptoContext.jsx";

export default function SymbolSearch({ onSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const { coins, loading } = useCrypto(); // Using the context to get coins

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

  // Filter coins based on query
  useEffect(() => {
    if (!showDropdown) return;

    const timeout = setTimeout(() => {
      if (!query) {
        setResults(coins); // Show all coins when query is empty
      } else {
        setResults(coins.filter(coin => coin.includes(query))); // Filter based on query
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query, showDropdown, coins]);

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
