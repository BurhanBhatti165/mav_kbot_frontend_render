// CryptoContext.js
import React, { createContext, useState, useEffect, useContext } from "react";

const CryptoContext = createContext();

export const useCrypto = () => {
  return useContext(CryptoContext);
};

export const CryptoProvider = ({ children }) => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchCoins = async () => {
      if (coins.length > 0) return; // If already loaded, do not refetch
        
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/search`);
        const data = await res.json();
        setCoins(data.symbols || []);
      } catch (err) {
        console.error("Error fetching symbols:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();
  }, [coins, API_BASE]);

  return (
    <CryptoContext.Provider value={{ coins, loading }}>
      {children}
    </CryptoContext.Provider>
  );
};
