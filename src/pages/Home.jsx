
import React from "react";
import {
  ArrowRight,
  Zap,
  Shield,
  Brain,
  TrendingUp,
  Activity,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import Logo from "../assets/logo1.jpg";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0A0A0F] relative overflow-hidden">
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
        {/* Hero Section */}
        <div className="max-w-[1800px] mx-auto px-6 sm:px-8 lg:px-12 py-6 lg:py-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
            {/* Left Side - Text */}
            <div
              className="flex-1 text-center lg:text-left space-y-8"
              style={{
                animation:
                  "fadeInScale 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0s both",
              }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-4">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-semibold text-emerald-300">
                  AI-Powered Trading
                </span>
                <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight">
                <span className="bg-gradient-to-br from-white via-white to-gray-400 bg-clip-text text-transparent">
                  MAVERICKS
                </span>
                <br />
                <span className="bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  ALGO MIND
                </span>
              </h1>

              <p className="text-gray-400 text-lg sm:text-xl max-w-2xl leading-relaxed mx-auto lg:mx-0">
                AI Powered Crypto Trading Bot — Automate your trades with
                cutting-edge algorithms. Stay ahead of the market, maximize
                profits, and trade smarter.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a
                  href="/chart"
                  className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-600 to-blue-600 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-emerald-500/50 cursor-pointer hover:scale-105 active:scale-95 transition-all duration-200"
                >
                  <span>Live Demo</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="#features"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/5 border border-white/10 text-white font-semibold rounded-xl hover:bg-white/10 hover:border-white/20 cursor-pointer hover:scale-105 active:scale-95 transition-all duration-200"
                >
                  <span>Learn More</span>
                  <ChevronRight className="w-5 h-5" />
                </a>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 max-w-xl mx-auto lg:mx-0">
                <div className="text-center lg:text-left">
                  <p className="text-3xl font-bold text-white">99.9%</p>
                  <p className="text-sm text-gray-400 font-medium">Uptime</p>
                </div>
                <div className="text-center lg:text-left">
                  <p className="text-3xl font-bold text-white">24/7</p>
                  <p className="text-sm text-gray-400 font-medium">Trading</p>
                </div>
                <div className="text-center lg:text-left">
                  <p className="text-3xl font-bold text-white">AI</p>
                  <p className="text-sm text-gray-400 font-medium">Powered</p>
                </div>
              </div>
            </div>

            {/* Right Side - Logo */}
            <div
              className="flex-shrink-0 lg:mr-20"
              style={{
                animation:
                  "fadeInScale 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both",
              }}
            >
              <div className="group relative">
                {/* Multi-layer glow effect */}
                <div className="absolute -inset-4 bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 rounded-3xl opacity-30 group-hover:opacity-50 blur-2xl transition-all duration-700" />
                <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 rounded-3xl opacity-40 group-hover:opacity-60 blur-xl transition-all duration-500" />

                <div className="relative bg-gradient-to-br from-[#0F1117] to-[#1A1D2E] p-8 rounded-3xl border border-white/[0.08] transform group-hover:scale-105 transition-transform duration-500 overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full -mr-20 -mt-20 blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/10 rounded-full -ml-20 -mb-20 blur-3xl" />

                  <div className="relative">
                    <img
                      src={Logo}
                      alt="Algo Mind Logo"
                      className="h-64 w-64 md:h-80 md:w-80 object-contain rounded-2xl border-4 border-white/10 shadow-2xl"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section
          id="features"
          className="max-w-[1800px] mx-auto px-6 sm:px-8 lg:px-12 py-20"
        >
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-semibold text-blue-300">
                Key Features
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-br from-white via-white to-gray-400 bg-clip-text text-transparent">
                Why Choose Our Bot?
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Institutional-grade technology meets user-friendly design
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div
              className="group relative"
              style={{
                animation:
                  "fadeInScale 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0s both",
              }}
            >
              <div className="absolute -inset-px bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-all duration-500" />
              <div className="relative bg-gradient-to-br from-[#0F1117] to-[#1A1D2E] border border-white/[0.08] rounded-2xl p-8 overflow-hidden h-full">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                <div className="relative">
                  <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl w-fit mb-6">
                    <Brain className="w-8 h-8 text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Smart AI
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    Leverages deep learning models to analyze market patterns
                    and make real-time trading decisions with precision.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div
              className="group relative"
              style={{
                animation:
                  "fadeInScale 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both",
              }}
            >
              <div className="absolute -inset-px bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-all duration-500" />
              <div className="relative bg-gradient-to-br from-[#0F1117] to-[#1A1D2E] border border-white/[0.08] rounded-2xl p-8 overflow-hidden h-full">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                <div className="relative">
                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl w-fit mb-6">
                    <Zap className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Lightning Fast
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    Executes trades in milliseconds, ensuring you never miss
                    profitable opportunities in volatile markets.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div
              className="group relative"
              style={{
                animation:
                  "fadeInScale 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both",
              }}
            >
              <div className="absolute -inset-px bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-all duration-500" />
              <div className="relative bg-gradient-to-br from-[#0F1117] to-[#1A1D2E] border border-white/[0.08] rounded-2xl p-8 overflow-hidden h-full">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                <div className="relative">
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl w-fit mb-6">
                    <Shield className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Secure</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Built with top-notch security protocols to keep your assets
                    safe and trading worry-free.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
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