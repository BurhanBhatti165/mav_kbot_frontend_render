import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Mail, Twitter, Github, Linkedin, TrendingUp, Shield, Brain, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/[0.08] bg-[#0A0A0F]">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -bottom-40 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
        <div className="absolute -bottom-40 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
      </div>

      <div className="relative max-w-[1800px] mx-auto px-6 sm:px-8 lg:px-12 py-16">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-blue-600 blur-xl opacity-50" />
                <div className="relative w-10 h-10 bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
              </div>
              <span className="text-white font-bold text-xl tracking-tight">MAVERICKS</span>
            </div>
            <p className="text-gray-400 leading-relaxed max-w-xs">
              AI-powered crypto trading platform built for professional traders who demand excellence.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-white/5 border border-white/10 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 hover:border-emerald-500/50 hover:scale-110 transition-all duration-200"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-white/5 border border-white/10 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 hover:border-emerald-500/50 hover:scale-110 transition-all duration-200"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-white/5 border border-white/10 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 hover:border-emerald-500/50 hover:scale-110 transition-all duration-200"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-6">Product</h3>
            <ul className="space-y-4">
              <li>
                <Link
                  to="/chart"
                  className="text-gray-400 hover:text-emerald-400 transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span>Live Chart</span>
                  <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link
                  to="/strategies"
                  className="text-gray-400 hover:text-emerald-400 transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span>Trading Strategies</span>
                  <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link
                  to="/price-prediction"
                  className="text-gray-400 hover:text-emerald-400 transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span>Price Prediction</span>
                  <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link
                  to="/liquidation"
                  className="text-gray-400 hover:text-emerald-400 transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span>Liquidation Data</span>
                  <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-6">Resources</h3>
            <ul className="space-y-4">
              <li>
                <Link
                  to="/glossary"
                  className="text-gray-400 hover:text-emerald-400 transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span>Glossary</span>
                  <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-emerald-400 transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span>Documentation</span>
                  <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-emerald-400 transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span>API Reference</span>
                  <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-emerald-400 transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span>Support</span>
                  <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
            </ul>
          </div>

          {/* Features Highlight */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-6">Why Choose Us</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg mt-0.5">
                  <Brain className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">AI-Powered</p>
                  <p className="text-gray-400 text-xs mt-1">Advanced algorithms</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg mt-0.5">
                  <TrendingUp className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">Real-time Data</p>
                  <p className="text-gray-400 text-xs mt-1">Live market analysis</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-500/10 border border-purple-500/20 rounded-lg mt-0.5">
                  <Shield className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">Secure Platform</p>
                  <p className="text-gray-400 text-xs mt-1">Bank-level security</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/[0.08]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">
              © {currentYear} Mavericks Algo Mind. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 text-sm transition-colors flex items-center gap-1">
                <Mail className="w-4 h-4" />
                Contact
              </a>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}