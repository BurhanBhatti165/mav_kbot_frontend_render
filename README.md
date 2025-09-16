# 📊 K-Bot Frontend

A **React + Vite** frontend for real-time cryptocurrency charting.  
It connects to the **FastAPI backend** for initial REST data and then streams live updates via WebSocket.

---

## 🚀 Features

- 🔎 **Symbol search** (USDT pairs from Binance)
- ⏱ **Timeframe selector** (`1m`, `3m`, `15m`, `1h`, etc.)
- 📈 **Candlestick charts** with Plotly.js
- 📊 **Volume bars** (toggle on/off)
- 🔄 **Live updates** via WebSockets
- 🎛 **Customizable limit selector** (100–1000 candles)
- 🎨 Dark theme with TailwindCSS

---

## 🛠 Prerequisites

- **Node.js** ≥ 18
- **npm** or **yarn**
- Running [K-Bot Backend (FastAPI)](../Kbot_backend) on `http://127.0.0.1:8000`

---

## ⚙️ Installation

Clone the repo and install dependencies:

```bash
git clone https://github.com/SOBAN7AKRAM/mavericks_Kbot_frontend.git
cd mavericks_Kbot_frontend
npm install
```

## 🔑 Environment Variables

Create a `.env` file in the project root:

```
# Backend API base URL
VITE_API_BASE_URL=http://127.0.0.1:8000
```

### Notes

- `VITE_API_BASE_URL` is used for REST calls (`/api/data`, `/api/search`, etc.).

- The frontend automatically connects to WebSockets at:

  ```
  ws://127.0.0.1:8000/ws/data?symbol=BTCUSDT&interval=15m&limit=150
  ```

  (In production with HTTPS, it switches to `wss://`.)

------

## ▶️ Development

Run in dev mode with hot reload:

```
npm run dev
```

By default, the app will be available at:

```
http://localhost:5173
```

------

## 🏗 Build & Preview

Build optimized production files:

```
npm run build
```

Preview the production build locally:

```
npm run preview
```

------

## 📂 Project Structure

```
src/
 ├── components/
 │    ├── BasicCharts.jsx     # Main chart component
 │    ├── SymbolSearch.jsx    # Search bar for tickers
 │    ├── PopularTicker.jsx   # Quick access to trending coins
 │    └── TimeFrameSelector.jsx
 |    └── Home.jsx
 ├── App.jsx
 └── main.jsx
```

------

## 💡 Usage

- Select a trading pair (default: `BTCUSDT`).
- Choose timeframe (`1m` to `1M`).
- Adjust candle limit (100–1000).
- Toggle **Show Volumes** to show/hide volume bars.
- Watch real-time updates stream in via WebSockets.

------

## 🔮 Roadmap

- ✅ Add more technical indicators (RSI, EMA, MACD)
- ✅ Save user preferences in local storage
- ✅ Multi-chart layout support

------

## 📝 License

MIT License © 2025 [Your Name / Team]

```
---

👉 This is complete, production-ready markdown.  

Do you also want me to include **deployment instructions** (like Vercel/Netlify or Docker) so it’s easier to ship your frontend along with the backend?
```