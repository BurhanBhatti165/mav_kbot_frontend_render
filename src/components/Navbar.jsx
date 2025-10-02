import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Zap } from "lucide-react";

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="border-b border-white/[0.08] backdrop-blur-xl bg-white/[0.02] sticky top-0 z-50">
      <div className="max-w-[1800px] mx-auto px-6 sm:px-8 lg:px-12 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-blue-600 blur-xl opacity-50" />
                <div className="relative w-10 h-10 bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
              </div>
              <span className="text-white font-bold text-xl tracking-tight">
                MAVERICKS
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              <Link
                to="/"
                className={`px-4 py-2 font-medium text-sm rounded-lg cursor-pointer hover:scale-105 active:scale-95 transition-all duration-200 ${
                  isActive("/")
                    ? "text-white bg-white/5"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Home
              </Link>
              <Link
                to="/chart"
                className={`px-4 py-2 font-medium text-sm rounded-lg cursor-pointer hover:scale-105 active:scale-95 transition-all duration-200 ${
                  isActive("/chart")
                    ? "text-white bg-white/5"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Live Chart
              </Link>
              <Link
                to="/strategies"
                className={`px-4 py-2 font-medium text-sm rounded-lg cursor-pointer hover:scale-105 active:scale-95 transition-all duration-200 ${
                  isActive("/strategies")
                    ? "text-white bg-white/5"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Strategies
              </Link>
              <Link
                to="/price-prediction"
                className={`px-4 py-2 font-medium text-sm rounded-lg cursor-pointer hover:scale-105 active:scale-95 transition-all duration-200 ${
                  isActive("/price-prediction")
                    ? "text-white bg-white/5"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Price Prediction
              </Link>
              <Link
                to="/liquidation"
                className={`px-4 py-2 font-medium text-sm rounded-lg cursor-pointer hover:scale-105 active:scale-95 transition-all duration-200 ${
                  isActive("/liquidation")
                    ? "text-white bg-white/5"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Liquidation
              </Link>
              <Link
                to="/glossary"
                className={`px-4 py-2 font-medium text-sm rounded-lg cursor-pointer hover:scale-105 active:scale-95 transition-all duration-200 ${
                  isActive("/glossary")
                    ? "text-white bg-white/5"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Glossary
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-sm text-gray-300 font-medium">Live</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}