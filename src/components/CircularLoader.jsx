import React from 'react';

const CircularLoader = ({ text = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative w-[clamp(80px,10vw,120px)] h-[clamp(80px,10vw,120px)]">
        {/* Outer rotating gradient ring with crypto colors */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500/50 via-amber-400/50 to-yellow-500/50 animate-spin-slow border border-white/10" style={{ filter: 'blur(4px)' }} />
        
        {/* Inner rotating ring with subtle crypto glow */}
        <div className="absolute inset-[0.75rem] rounded-full bg-gradient-to-r from-orange-600/30 to-amber-500/30 animate-spin-reverse border border-white/5 shadow-[0_0_15px_rgba(247,147,26,0.3)]" />
        
        {/* Orbiting Bitcoin symbols */}
        <div className="absolute inset-0 animate-orbit">
          <div className="w-5 h-5 text-orange-400 absolute top-0 left-1/2 -translate-x-1/2 animate-pulse-fast flex items-center justify-center" style={{ fontSize: 'clamp(14px,1.5vw,16px)', fontWeight: 'bold' }}>
            ₿
          </div>
          <div className="w-4 h-4 text-amber-400 absolute top-1/2 right-0 -translate-y-1/2 animate-pulse-fast flex items-center justify-center" style={{ fontSize: 'clamp(12px,1.2vw,14px)', fontWeight: 'bold' }}>
            ₿
          </div>
          <div className="w-4.5 h-4.5 text-yellow-400 absolute bottom-0 left-1/2 -translate-x-1/2 animate-pulse-fast flex items-center justify-center" style={{ fontSize: 'clamp(13px,1.3vw,15px)', fontWeight: 'bold' }}>
            ₿
          </div>
        </div>

        {/* Central glowing core with blockchain-inspired design */}
        <div className="absolute inset-[1rem] bg-gradient-to-br from-[#0F1117] to-[#1A1D2E] rounded-full flex items-center justify-center border border-orange-500/20">
          <div className="w-6 h-6 bg-gradient-to-r from-orange-500/40 to-amber-500/40 rounded-full animate-pulse-slow shadow-[0_0_20px_rgba(247,147,26,0.4)]" />
        </div>
      </div>

      {/* Loader text */}
      <p className="text-[clamp(14px,1.5vw,16px)] text-xl font-semibold text-gray-300 tracking-wide">{text}</p>

      {/* Animations */}
      <style>{`
        @keyframes spin-slow {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes spin-reverse {
          0% {
            transform: rotate(360deg);
          }
          100% {
            transform: rotate(0deg);
          }
        }

        @keyframes orbit {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse-fast {
          0%, 100% {
            transform: scale(1);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.3);
            opacity: 1;
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            transform: scale(1);
            opacity: 0.7;
          }
          50% {
            transform: scale(1.2);
            opacity: 1;
          }
        }

        .animate-spin-slow {
          animation: spin-slow 4s linear infinite;
        }

        .animate-spin-reverse {
          animation: spin-reverse 3s linear infinite;
        }

        .animate-orbit {
          animation: orbit 2.5s linear infinite;
        }

        .animate-pulse-fast {
          animation: pulse-fast 1s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default CircularLoader;