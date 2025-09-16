import { useEffect, useState } from "react";

export default function TimeFrameSelector({ current, onSelect }) {
  const [timeframes, setTimeframes] = useState([]);
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  async function fetchTimeframes() {
    try {
      const res = await fetch(`${API_BASE}/api/timeframes`);
      const json = await res.json();
      setTimeframes(json || []); // ✅ set as array
    } catch (err) {
      console.error("Error fetching timeframes:", err);
    }
  }

  useEffect(() => {
    fetchTimeframes();
  }, []);

  return (
    <div className="flex gap-2 justify-center flex-wrap mb-4">
      {timeframes.map((tf) => (
        <button
          key={tf.interval}
          className={`px-2 py-2 rounded-md text-sm transition cursor-pointer hover:bg-[#404040] hover:cursor-pointer ${
            current === tf.interval
              ? "bg-[#00ff88] text-black font-bold"
              : "bg-[#404040] text-white hover:bg-[#505050]"
          }`}
          onClick={() => onSelect(tf.interval)}
        >
          {tf.label}
        </button>
      ))}
    </div>
  );
}

