import { useEffect, useState } from "react";

export default function PopularTicker() {
  const [coins, setCoins] = useState([]);
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  async function fetchPopular() {
    try {
      const res = await fetch(`${API_BASE}/api/popular`);
      const json = await res.json();
      setCoins(json || []);
    } catch (err) {
      console.error("Error fetching popular coins:", err);
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

      {/* ✅ Scrolling Coins */}
      <div className="flex-1 overflow-hidden">
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
      </div>
    </div>
  );
}
