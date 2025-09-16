

// src/pages/Glossary.jsx
import Plot from "react-plotly.js";

export default function Glossary() {
    // Dummy data for small charts
    const dummyCandles = {
        x: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"],
        open: [100, 105, 110, 108, 115],
        high: [106, 112, 115, 112, 118],
        low: [98, 103, 107, 106, 111],
        close: [105, 110, 108, 115, 117],
    };

    const dummyRSI = {
        x: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"],
        y: [25, 40, 65, 80, 70], // showing oversold → normal → overbought
    };

    const dummySMA = {
        price: [100, 102, 104, 106, 108, 110, 112],
        sma20: [101, 103, 105, 107, 109, 111, 113],
    };
    const dummyStoch = {
        x: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"],
        y: [15, 35, 60, 85, 75],
    };
    const dummyVolume = {
        x: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"],
        y: [120, 300, 180, 450, 220],
    };

    return (
        <div className="p-6 bg-gray-900 text-white min-h-screen space-y-12">
            <h1 className="text-3xl font-bold text-center mb-6">📘 Beginner’s Glossary of Trading Indicators</h1>
            <p className="text-center text-gray-400 mb-12 max-w-3xl mx-auto">
                These examples use <span className="text-green-300">dummy charts</span> to help you visualize
                how each indicator works. They are not real market data.
            </p>

            {/* RSI */}
            <section className="bg-[#1c1c1c] rounded-2xl shadow-lg p-6 space-y-6">
                <h2 className="text-2xl font-semibold text-green-400">RSI – Relative Strength Index</h2>
                <p>
                    Imagine the market is like a runner. Sometimes it runs too fast and gets tired, other times it rests.
                    RSI tells us whether the price has been moving up or down too quickly.
                </p>
                <ul className="list-disc list-inside text-gray-300">
                    <li>If RSI is above 70 → the market is “tired” (overbought). It might slow down or fall.</li>
                    <li>If RSI is below 30 → the market is “resting too much” (oversold). It might wake up and rise.</li>
                </ul>
                <p className="text-sm text-gray-400">
                    📊 Example: If Bitcoin keeps going up for many days, RSI will become high. That warns you a fall may come soon.
                </p>
                <p>
                    RSI tells us if the market is “overheated” (overbought) or “resting too much” (oversold).
                </p>
                <Plot
                    data={[
                        { x: dummyRSI.x, y: dummyRSI.y, type: "scatter", mode: "lines+markers", line: { color: "lime" } },
                        { x: dummyRSI.x, y: [70, 70, 70, 70, 70], type: "scatter", mode: "lines", line: { dash: "dot", color: "red" }, name: "Overbought" },
                        { x: dummyRSI.x, y: [30, 30, 30, 30, 30], type: "scatter", mode: "lines", line: { dash: "dot", color: "blue" }, name: "Oversold" },
                    ]}
                    layout={{ paper_bgcolor: "#1c1c1c", plot_bgcolor: "#1c1c1c", font: { color: "white" }, height: 250, margin: { t: 30 } }}
                />
                <p className="text-sm text-gray-400">
                    📊 Example: On Day 4, RSI = 80 → too high → likely pullback.
                </p>
            </section>

            {/* SMA */}
            <section className="bg-[#1c1c1c] rounded-2xl shadow-lg p-6 space-y-6">
                <h2 className="text-2xl font-semibold text-blue-400">SMA – Simple Moving Average</h2>
                <p>
                    SMA is like asking, “On average, how has the price been in the last few days?”
                    It doesn’t care about small jumps; it smooths the line so you can see the bigger trend.
                </p>
                <ul className="list-disc list-inside text-gray-300">
                    <li>Short SMA (like 20 days) = shows short-term mood.</li>
                    <li>Long SMA (like 50 or 200 days) = shows long-term direction.</li>
                </ul>
                <p className="text-sm text-gray-400">
                    📊 Example: If the price is above the 50-day SMA, it usually means the trend is strong and positive.
                </p>
                <p>
                    SMA smooths out prices so you can clearly see the overall direction.
                </p>
                <Plot
                    data={[
                        { y: dummySMA.price, type: "scatter", mode: "lines+markers", line: { color: "white" }, name: "Price" },
                        { y: dummySMA.sma20, type: "scatter", mode: "lines", line: { color: "blue" }, name: "SMA 20" },
                    ]}
                    layout={{ paper_bgcolor: "#1c1c1c", plot_bgcolor: "#1c1c1c", font: { color: "white" }, height: 250, margin: { t: 30 } }}
                />
                <p className="text-sm text-gray-400">
                    📊 Example: Price staying above SMA → healthy upward trend.
                </p>
            </section>

            {/* EMA */}
            <section className="bg-[#1c1c1c] rounded-2xl shadow-lg p-6 space-y-6">
                <h2 className="text-2xl font-semibold text-purple-400">EMA – Exponential Moving Average</h2>
                <p>
                    EMA is almost the same as SMA, but it pays more attention to what happened recently.
                    Think of it like a teacher: the teacher cares more about your latest test result than the one from last year.
                    EMA reacts faster to changes in price.
                </p>
                <p className="text-sm text-gray-400">
                    📊 Example: Traders love the “golden cross” → when the short EMA (fast) crosses above the long EMA (slow), it’s often a buy signal.
                </p>
                <p>
                    EMA reacts faster than SMA, giving more weight to recent prices.
                </p>
                <Plot
                    data={[
                        { y: [100, 102, 104, 108, 111], type: "scatter", mode: "lines+markers", line: { color: "white" }, name: "Price" },
                        { y: [99, 101, 103, 107, 110], type: "scatter", mode: "lines", line: { color: "purple" }, name: "EMA 20" },
                    ]}
                    layout={{ paper_bgcolor: "#1c1c1c", plot_bgcolor: "#1c1c1c", font: { color: "white" }, height: 250, margin: { t: 30 } }}
                />
                <p className="text-sm text-gray-400">
                    📊 Example: EMA turning upward faster than SMA = early trend signal.
                </p>
            </section>

            {/* MACD */}
            <section className="bg-[#1c1c1c] rounded-2xl shadow-lg p-6 space-y-6">
                <h2 className="text-2xl font-semibold text-pink-400">MACD – Momentum Indicator</h2>
                <p>
                    MACD looks at two EMAs (one fast, one slow) and shows when they move apart or come together.
                    Think of two cars on a highway: if the fast car pulls ahead, momentum is strong; if it slows down, momentum weakens.
                </p>
                <ul className="list-disc list-inside text-gray-300">
                    <li>MACD line above signal line = market gaining strength (bullish).</li>
                    <li>MACD line below signal line = market losing strength (bearish).</li>
                </ul>
                <p className="text-sm text-gray-400">
                    📊 Example: If MACD crosses upward, many traders take it as a green light to enter.
                </p>
                <p>
                    MACD shows when momentum is shifting between bullish and bearish.
                </p>
                <Plot
                    data={[
                        { x: ["Day 1", "Day 2", "Day 3", "Day 4"], y: [0.5, 1.0, 0.3, -0.2], type: "bar", name: "MACD Histogram", marker: { color: "pink" } },
                        { x: ["Day 1", "Day 2", "Day 3", "Day 4"], y: [0.4, 0.8, 0.6, 0.1], type: "scatter", mode: "lines", line: { color: "white" }, name: "MACD Line" },
                        { x: ["Day 1", "Day 2", "Day 3", "Day 4"], y: [0.3, 0.5, 0.5, 0.0], type: "scatter", mode: "lines", line: { dash: "dot", color: "yellow" }, name: "Signal Line" },
                    ]}
                    layout={{ paper_bgcolor: "#1c1c1c", plot_bgcolor: "#1c1c1c", font: { color: "white" }, height: 250, margin: { t: 30 } }}
                />
                <p className="text-sm text-gray-400">
                    📊 Example: MACD line crossing above signal = bullish momentum.
                </p>
            </section>

            {/* Bollinger Bands */}
            <section className="bg-[#1c1c1c] rounded-2xl shadow-lg p-6 space-y-6">
                <h2 className="text-2xl font-semibold text-yellow-400">Bollinger Bands</h2>
                <p>
                    Picture a rubber band stretched around the price.
                    When the band is wide, the market is wild (high volatility).
                    When the band is tight, the market is calm.
                    Price touching the top of the band means it may be expensive, touching the bottom means it may be cheap.
                </p>
                <p className="text-sm text-gray-400">
                    📊 Example: If Bitcoin suddenly shoots up and hits the upper band, traders expect it might pull back soon.
                </p>
                <p>
                    Think of them as “price boundaries.” When price hits the top band, it might be too expensive.
                    When it touches the bottom band, it might be cheap.
                </p>
                <Plot
                    data={[
                        { y: [100, 105, 110, 107, 115], type: "scatter", mode: "lines+markers", line: { color: "white" }, name: "Price" },
                        { y: [95, 100, 105, 102, 110], type: "scatter", mode: "lines", line: { dash: "dot", color: "red" }, name: "Lower Band" },
                        { y: [105, 110, 115, 112, 120], type: "scatter", mode: "lines", line: { dash: "dot", color: "green" }, name: "Upper Band" },
                    ]}
                    layout={{ paper_bgcolor: "#1c1c1c", plot_bgcolor: "#1c1c1c", font: { color: "white" }, height: 250, margin: { t: 30 } }}
                />
                <p className="text-sm text-gray-400">
                    📊 Example: Price touching upper band → overbought zone.
                </p>
            </section>
            {/* Stochastic Oscillator */}
            <section className="bg-[#1c1c1c] rounded-2xl shadow-lg p-6 space-y-4">
                <h2 className="text-2xl font-semibold text-orange-400">Stochastic Oscillator</h2>
                <p>
                    This indicator compares today’s closing price to the range of prices over the past few days.
                    Think of it like checking if today’s result is closer to the highest mark or the lowest mark recently.
                </p>
                <ul className="list-disc list-inside text-gray-300">
                    <li>Above 80 = price is near recent highs → maybe too expensive.</li>
                    <li>Below 20 = price is near recent lows → maybe too cheap.</li>
                </ul>
                <p className="text-sm text-gray-400">
                    📊 Example: If BTC stochastic = 85, it means it’s near the top of its recent range → possible correction.
                </p>
                <Plot
                    data={[
                        { x: dummyStoch.x, y: dummyStoch.y, type: "scatter", mode: "lines+markers", line: { color: "orange" }, name: "Stochastic" },
                        { x: dummyStoch.x, y: [80, 80, 80, 80, 80], type: "scatter", mode: "lines", line: { dash: "dot", color: "red" }, name: "Overbought" },
                        { x: dummyStoch.x, y: [20, 20, 20, 20, 20], type: "scatter", mode: "lines", line: { dash: "dot", color: "blue" }, name: "Oversold" },
                    ]}
                    layout={{ paper_bgcolor: "#1c1c1c", plot_bgcolor: "#1c1c1c", font: { color: "white" }, height: 250, margin: { t: 30 } }}
                />
                <p className="text-sm text-gray-400">
                    📊 Example: On Day 4, Stochastic = 85 → near the top of its range → likely correction.
                </p>
            </section>

            {/* Volume */}
            <section className="bg-[#1c1c1c] rounded-2xl shadow-lg p-6 space-y-4">
                <h2 className="text-2xl font-semibold text-cyan-400">Trading Volume</h2>
                <p>
                    Volume is simply “how many people are buying or selling.”
                    If many people are trading, the move is stronger.
                    If only a few people are trading, the move is weak and may not last.
                </p>
                <p className="text-sm text-gray-400">
                    📊 Example: If Bitcoin breaks a key price level with high volume, that breakout is more trustworthy.
                </p>
                <Plot
                    data={[
                        { x: dummyVolume.x, y: dummyVolume.y, type: "bar", marker: { color: "cyan" }, name: "Volume" },
                    ]}
                    layout={{ paper_bgcolor: "#1c1c1c", plot_bgcolor: "#1c1c1c", font: { color: "white" }, height: 250, margin: { t: 30 } }}
                />
                <p className="text-sm text-gray-400">
                    📊 Example: On Day 4, volume is very high. That makes the price move more reliable.
                </p>
            </section>

            {/* Supertrend */}
            <section className="bg-[#1c1c1c] rounded-2xl shadow-lg p-6 space-y-6">
                <h2 className="text-2xl font-semibold text-emerald-400">Supertrend</h2>
                <p>
                    Supertrend is like a “trend-following traffic light.” It paints a line above or below the price.
                    When the line is below the price → it’s green (uptrend).
                    When the line is above the price → it’s red (downtrend).
                </p>
                <ul className="list-disc list-inside text-gray-300">
                    <li>Price above Supertrend = bullish signal.</li>
                    <li>Price below Supertrend = bearish signal.</li>
                </ul>
                <p className="text-sm text-gray-400">
                    📊 Example: If Bitcoin keeps closing higher, Supertrend flips to green and sits below price → trend confirmation.
                </p>
                <Plot
                    data={[
                        { x: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"], y: [100, 105, 110, 108, 115], type: "scatter", mode: "lines+markers", line: { color: "white" }, name: "Price" },
                        { x: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"], y: [95, 100, 105, 104, 110], type: "scatter", mode: "lines", line: { color: "lime" }, name: "Supertrend" },
                    ]}
                    layout={{ paper_bgcolor: "#1c1c1c", plot_bgcolor: "#1c1c1c", font: { color: "white" }, height: 250, margin: { t: 30 } }}
                />
                <p className="text-sm text-gray-400">
                    📊 Example: On Day 3, price above Supertrend → uptrend continues.
                </p>
            </section>

            {/* PSAR */}
            <section className="bg-[#1c1c1c] rounded-2xl shadow-lg p-6 space-y-6">
                <h2 className="text-2xl font-semibold text-yellow-400">PSAR – Parabolic SAR</h2>
                <p>
                    PSAR places little dots (stops) above or below the price.
                    These dots act like “guideposts”: they flip sides when the trend changes.
                </p>
                <ul className="list-disc list-inside text-gray-300">
                    <li>Dots below candles = uptrend.</li>
                    <li>Dots above candles = downtrend.</li>
                </ul>
                <p className="text-sm text-gray-400">
                    📊 Example: If BTC climbs steadily, PSAR dots appear below it. When price turns down, dots flip above.
                </p>
                <Plot
                    data={[
                        { x: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"], y: [100, 105, 110, 108, 115], type: "scatter", mode: "lines+markers", line: { color: "white" }, name: "Price" },
                        { x: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"], y: [98, 103, 107, 109, 111], mode: "markers", marker: { color: "gold", size: 8, symbol: "circle" }, name: "PSAR" },
                    ]}
                    layout={{ paper_bgcolor: "#1c1c1c", plot_bgcolor: "#1c1c1c", font: { color: "white" }, height: 250, margin: { t: 30 } }}
                />
                <p className="text-sm text-gray-400">
                    📊 Example: Dots flip from below to above price → possible trend reversal.
                </p>
            </section>

            {/* Keltner Channel */}
            <section className="bg-[#1c1c1c] rounded-2xl shadow-lg p-6 space-y-6">
                <h2 className="text-2xl font-semibold text-cyan-400">Keltner Channel</h2>
                <p>
                    Keltner Channel is like a tunnel built around the price.
                    It uses an average line in the middle and adds upper/lower “rails” to show volatility.
                </p>
                <ul className="list-disc list-inside text-gray-300">
                    <li>Price touching upper rail → possibly overbought.</li>
                    <li>Price touching lower rail → possibly oversold.</li>
                </ul>
                <p className="text-sm text-gray-400">
                    📊 Example: If Ethereum keeps pushing against the top channel, trend is strong but may pull back.
                </p>
                <Plot
                    data={[
                        { y: [100, 105, 110, 107, 112], type: "scatter", mode: "lines+markers", line: { color: "white" }, name: "Price" },
                        { y: [95, 100, 105, 102, 107], type: "scatter", mode: "lines", line: { dash: "dot", color: "cyan" }, name: "Lower Band" },
                        { y: [105, 110, 115, 112, 117], type: "scatter", mode: "lines", line: { dash: "dot", color: "cyan" }, name: "Upper Band" },
                        { y: [100, 105, 110, 107, 112], type: "scatter", mode: "lines", line: { color: "gray" }, name: "Middle" },
                    ]}
                    layout={{ paper_bgcolor: "#1c1c1c", plot_bgcolor: "#1c1c1c", font: { color: "white" }, height: 250, margin: { t: 30 } }}
                />
                <p className="text-sm text-gray-400">
                    📊 Example: Price hugging upper rail → strong uptrend but watch for corrections.
                </p>
            </section>

            {/* CCI */}
            <section className="bg-[#1c1c1c] rounded-2xl shadow-lg p-6 space-y-6">
                <h2 className="text-2xl font-semibold text-orange-400">CCI – Commodity Channel Index</h2>
                <p>
                    CCI measures how far the price is from its “average normal.”
                    High CCI = price is well above average (maybe too expensive).
                    Low CCI = price is well below average (maybe too cheap).
                </p>
                <ul className="list-disc list-inside text-gray-300">
                    <li>Above +100 → overbought area.</li>
                    <li>Below -100 → oversold area.</li>
                </ul>
                <p className="text-sm text-gray-400">
                    📊 Example: If CCI shoots above +100, traders expect a correction soon.
                </p>
                <Plot
                    data={[
                        { x: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"], y: [-80, 20, 120, 90, -50], type: "scatter", mode: "lines+markers", line: { color: "orange" }, name: "CCI" },
                        { x: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"], y: [100, 100, 100, 100, 100], type: "scatter", mode: "lines", line: { dash: "dot", color: "red" }, name: "Overbought" },
                        { x: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"], y: [-100, -100, -100, -100, -100], type: "scatter", mode: "lines", line: { dash: "dot", color: "blue" }, name: "Oversold" },
                    ]}
                    layout={{ paper_bgcolor: "#1c1c1c", plot_bgcolor: "#1c1c1c", font: { color: "white" }, height: 250, margin: { t: 30 } }}
                />
                <p className="text-sm text-gray-400">
                    📊 Example: On Day 3, CCI = 120 → overbought → possible pullback.
                </p>
            </section>


        </div>
    );
}
