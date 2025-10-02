import React, { useState } from "react";
import StrategyCard from "../components/StrategyCard";
import {
  TrendingUp,
  Award,
  Target,
  Zap,
  ArrowUpRight,
  BarChart3,
  Activity,
  ChevronDown,
  Info,
} from "lucide-react";

function Strategies() {
  const [sortBy, setSortBy] = useState("accuracy");
  const [activeFilter, setActiveFilter] = useState("all");

  // Helper function to generate trades based on monthly range and accuracy
  const generateStrategyData = (monthlyMin, monthlyMax, accuracy) => {
    const monthlyAvg = Math.floor((monthlyMin + monthlyMax) / 2);
    const totalMonths = 84; // 2018-2025 = 7 years = 84 months
    const totalTrades = monthlyAvg * totalMonths;

    const profitableCount = Math.round((totalTrades * accuracy) / 100);
    const lossCount = totalTrades - profitableCount;

    const coins = [
      "Bitcoin",
      "Ethereum",
      "Ripple",
      "Cardano",
      "Solana",
      "Polkadot",
      "Chainlink",
      "Litecoin",
      "BNB",
      "Avalanche",
    ];

    const generateTrade = (isProfit) => ({
      coin: coins[Math.floor(Math.random() * coins.length)],
      date: `${2018 + Math.floor(Math.random() * 8)}-${String(
        Math.floor(Math.random() * 12) + 1
      ).padStart(2, "0")}-${String(Math.floor(Math.random() * 28) + 1).padStart(
        2,
        "0"
      )}`,
      time: `${String(Math.floor(Math.random() * 12) + 1).padStart(
        2,
        "0"
      )}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")} ${
        Math.random() > 0.5 ? "AM" : "PM"
      }`,
      percentage: isProfit
        ? `+${(Math.random() * 15 + 2).toFixed(2)}%`
        : `-${(Math.random() * 10 + 1).toFixed(2)}%`,
    });

    const total = [];
    const profitable = [];
    const loss = [];

    for (let i = 0; i < profitableCount; i++) {
      const trade = generateTrade(true);
      total.push(trade);
      profitable.push(trade);
    }

    for (let i = 0; i < lossCount; i++) {
      const trade = generateTrade(false);
      total.push(trade);
      loss.push(trade);
    }

    return {
      total,
      profitable,
      loss,
      monthlyRange: `${monthlyMin}-${monthlyMax}`,
      totalMonths,
    };
  };

  const strategyData = [
    {
      strategyName: "T-KYO",
      accuracy: 78,
      monthlyMin: 15,
      monthlyMax: 20,
      ...generateStrategyData(15, 20, 78),
    },
    {
      strategyName: "BR-LN",
      accuracy: 83,
      monthlyMin: 18,
      monthlyMax: 24,
      ...generateStrategyData(18, 24, 83),
    },
    {
      strategyName: "N-RBI",
      accuracy: 72,
      monthlyMin: 12,
      monthlyMax: 18,
      ...generateStrategyData(12, 18, 72),
    },
    {
      strategyName: "R-10",
      accuracy: 85,
      monthlyMin: 20,
      monthlyMax: 28,
      ...generateStrategyData(20, 28, 85),
    },
    {
      strategyName: "P-RF",
      accuracy: 74,
      monthlyMin: 14,
      monthlyMax: 19,
      ...generateStrategyData(14, 19, 74),
    },
  ];

  const totalStrategies = strategyData.length;
  const avgAccuracy = Math.round(
    strategyData.reduce((acc, s) => acc + s.accuracy, 0) / strategyData.length
  );
  const totalProfitable = strategyData.reduce(
    (acc, s) => acc + s.profitable.length,
    0
  );
  const totalTrades = strategyData.reduce((acc, s) => acc + s.total.length, 0);
  const winRate = Math.round((totalProfitable / totalTrades) * 100);

  const sortedStrategies = [...strategyData].sort((a, b) => {
    if (sortBy === "accuracy") return b.accuracy - a.accuracy;
    if (sortBy === "name") return a.strategyName.localeCompare(b.strategyName);
    return 0;
  });

  return (
    <div className="min-h-screen bg-[#0A0A0F] relative">
      {/* Ultra premium animated mesh gradient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-blue-600/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-0 -right-40 w-96 h-96 bg-purple-600/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-40 left-1/2 w-96 h-96 bg-emerald-600/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      {/* Sophisticated noise texture overlay */}
      <div
        className="fixed inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10">
        <div className="max-w-[1800px] mx-auto px-6 sm:px-8 lg:px-12 py-8">
          {/* Data Source Notice */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-3 px-5 py-3 bg-blue-500/10 border border-blue-500/20 rounded-xl backdrop-blur-sm">
              <Info className="w-5 h-5 text-blue-400 flex-shrink-0" />
              <p className="text-sm text-gray-300 font-medium">
                These strategies are based on backtesting with historical available data
                from 2018-2025{" "}
              </p>
            </div>
          </div>

          {/* Hero Section */}
          <div className="mb-12">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 mb-12">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6">
                  <Activity className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-semibold text-blue-300">
                    Portfolio Performance
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-blue-400" />
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-[1.1] tracking-tight">
                  <span className="bg-gradient-to-br from-white via-white to-gray-400 bg-clip-text text-transparent">
                    AlgoMind Trading
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
                    Strategies
                  </span>
                </h1>
                <p className="text-gray-400 text-base sm:text-lg max-w-2xl leading-relaxed">
                  Institutional-grade algorithms powered by machine learning and
                  real-time market analysis. Built for professional traders who
                  demand excellence.
                </p>
              </div>

              {/* Advanced filter system */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <button
                    className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                      activeFilter === "all"
                        ? "bg-white/10 text-white border border-white/20"
                        : "bg-white/5 text-gray-400 border border-transparent hover:bg-white/10"
                    }`}
                    onClick={() => setActiveFilter("all")}
                  >
                    All Strategies
                  </button>
                  <button
                    className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                      activeFilter === "top"
                        ? "bg-white/10 text-white border border-white/20"
                        : "bg-white/5 text-gray-400 border border-transparent hover:bg-white/10"
                    }`}
                    onClick={() => setActiveFilter("top")}
                  >
                    Top Performers
                  </button>
                </div>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full appearance-none bg-white/5 border border-white/10 text-white px-5 py-3 pr-10 rounded-xl font-medium text-sm cursor-pointer hover:bg-white/10 transition-all outline-none"
                  >
                    <option value="accuracy" className="bg-gray-900">
                      Sort by Accuracy
                    </option>
                    <option value="name" className="bg-gray-900">
                      Sort by Name
                    </option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Ultra-premium metrics dashboard */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Metric 1 */}
              <div className="group relative">
                <div className="absolute -inset-px bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-all duration-500" />
                <div className="relative bg-gradient-to-br from-[#0F1117] to-[#1A1D2E] border border-white/[0.08] rounded-2xl p-6 overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                  <div className="relative">
                    <div className="flex items-start justify-between mb-8">
                      <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                        <BarChart3 className="w-6 h-6 text-blue-400" />
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
                        <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">
                          Active
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-5xl font-bold text-white tracking-tight">
                        {totalStrategies}
                      </p>
                      <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                        Active Strategies
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Metric 2 */}
              <div className="group relative">
                <div className="absolute -inset-px bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-all duration-500" />
                <div className="relative bg-gradient-to-br from-[#0F1117] to-[#1A1D2E] border border-white/[0.08] rounded-2xl p-6 overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                  <div className="relative">
                    <div className="flex items-start justify-between mb-8">
                      <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                        <Award className="w-6 h-6 text-emerald-400" />
                      </div>
                      <div className="flex items-center gap-1 text-emerald-400 text-sm font-bold">
                        <ArrowUpRight className="w-4 h-4" />
                        <span>+{winRate}%</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-5xl font-bold text-white tracking-tight">
                        {avgAccuracy}%
                      </p>
                      <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                        Average Accuracy
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Metric 3 */}
              <div className="group relative">
                <div className="absolute -inset-px bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-all duration-500" />
                <div className="relative bg-gradient-to-br from-[#0F1117] to-[#1A1D2E] border border-white/[0.08] rounded-2xl p-6 overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                  <div className="relative">
                    <div className="flex items-start justify-between mb-8">
                      <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                        <Target className="w-6 h-6 text-purple-400" />
                      </div>
                      <div className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-full">
                        <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">
                          Wins
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-5xl font-bold text-white tracking-tight">
                        {totalProfitable}
                      </p>
                      <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                        Profitable Trades
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Metric 4 */}
              <div className="group relative">
                <div className="absolute -inset-px bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-all duration-500" />
                <div className="relative bg-gradient-to-br from-[#0F1117] to-[#1A1D2E] border border-white/[0.08] rounded-2xl p-6 overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                  <div className="relative">
                    <div className="flex items-start justify-between mb-8">
                      <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                        <TrendingUp className="w-6 h-6 text-orange-400" />
                      </div>
                      <div className="px-3 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full">
                        <span className="text-xs font-bold text-orange-300 uppercase tracking-wider">
                          Total
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-5xl font-bold text-white tracking-tight">
                        {totalTrades}
                      </p>
                      <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                        Total Signals
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Strategy Cards Grid - Compact Design */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedStrategies.map((strategy, index) => (
              <div
                key={index}
                className="group relative"
                style={{
                  animation: `fadeInScale 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${
                    index * 0.1
                  }s both`,
                }}
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 rounded-2xl opacity-0 group-hover:opacity-50 blur transition-all duration-500" />

                <div className="relative transform group-hover:scale-[1.02] transition-transform duration-300">
                  <StrategyCard {...strategy} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Advanced keyframe animations */}
      <style>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        @keyframes blob {
          0%, 100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

export default Strategies;