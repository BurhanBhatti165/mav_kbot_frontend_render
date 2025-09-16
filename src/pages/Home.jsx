// export default function Home() {
//   return (
//     <div className="bg-gradient-to-b from-gray-900 to-black min-h-screen text-white flex flex-col">
//       {/* Hero Section */}
//       <header className="flex flex-col items-center justify-center text-center px-6 py-20 flex-1">
//         <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
//           🚀 AI Powered <span className="text-green-400">Crypto Trading Bot</span>
//         </h1>
//         <p className="text-lg md:text-xl text-gray-300 max-w-2xl mb-8">
//           Automate your trading with cutting-edge AI algorithms. 
//           Stay ahead of the market, maximize profits, and trade smarter.
//         </p>
//         <div className="flex gap-4">
//           <a
//             href="/chart"
//             className="px-6 py-3 bg-green-400 text-black font-semibold rounded-lg shadow hover:bg-green-500 transition"
//           >
//             Live Demo
//           </a>
//           <a
//             href="#features"
//             className="px-6 py-3 border border-gray-600 rounded-lg hover:border-green-400 hover:text-green-400 transition"
//           >
//             Learn More
//           </a>
//         </div>
//       </header>

//       {/* Features Section */}
//       <section id="features" className="py-16 bg-gray-800">
//         <div className="max-w-5xl mx-auto px-6 text-center">
//           <h2 className="text-3xl font-bold mb-10">Why Choose Our Bot?</h2>
//           <div className="grid md:grid-cols-3 gap-8">
//             <div className="bg-gray-900 p-6 rounded-xl shadow hover:shadow-green-400/40 transition">
//               <h3 className="text-xl font-semibold mb-3">🤖 Smart AI</h3>
//               <p className="text-gray-400">
//                 Leverages deep learning models to analyze market patterns and make real-time trading decisions.
//               </p>
//             </div>
//             <div className="bg-gray-900 p-6 rounded-xl shadow hover:shadow-green-400/40 transition">
//               <h3 className="text-xl font-semibold mb-3">⚡ Lightning Fast</h3>
//               <p className="text-gray-400">
//                 Executes trades in milliseconds, ensuring you never miss profitable opportunities.
//               </p>
//             </div>
//             <div className="bg-gray-900 p-6 rounded-xl shadow hover:shadow-green-400/40 transition">
//               <h3 className="text-xl font-semibold mb-3">🔒 Secure</h3>
//               <p className="text-gray-400">
//                 Built with top-notch security protocols to keep your assets safe and trading worry-free.
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="py-6 bg-black text-center text-gray-500 text-sm">
//         © {new Date().getFullYear()} CryptoBot AI — All rights reserved.
//       </footer>
//     </div>
//   );
// }


import Logo from "../assets/logo1.jpg"; // 👈 make sure your logo is in src/assets/

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-gray-900 to-black min-h-screen text-white flex flex-col">
      {/* Hero Section */}
      <header className="flex flex-col md:flex-row items-center justify-between px-8 py-20 flex-1 max-w-7xl mx-auto w-full">
        {/* Left Side - Text */}
        <div className="text-center md:text-left md:w-1/2">
          <h1 className="text-4xl md:text-5xl font-Roboto font-extrabold mb-6 leading-tight">
            MAVERICKS <span className="text-green-400">ALGO MIND</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-xl mb-8">
            AI Powered Crypto Trading Bot — Automate your trades with
            cutting-edge algorithms. Stay ahead of the market, maximize profits,
            and trade smarter.
          </p>
          <div className="flex gap-4 justify-center md:justify-start">
            <a
              href="/chart"
              className="px-6 py-3 bg-green-400 text-black font-semibold rounded-lg shadow hover:bg-green-500 transition"
            >
              Live Demo
            </a>
            <a
              href="#features"
              className="px-6 py-3 border border-gray-600 rounded-lg hover:border-green-400 hover:text-green-400 transition"
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Right Side - Logo */}
        <div className="mt-12 md:mt-0 md:w-1/2 flex justify-center">
          <div className="bg-gray-800 p-6 rounded-2xl shadow-xl hover:shadow-green-400/40 transition">
            <img
              src={Logo}
              alt="Algo Mind Logo"
              className="h-56 w-56 md:h-72 md:w-72 object-contain rounded-full border-4 border-green-400 shadow-lg"
            />
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-16 bg-gray-800">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-10">Why Choose Our Bot?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-900 p-6 rounded-xl shadow hover:shadow-green-400/40 transition">
              <h3 className="text-xl font-semibold mb-3">🤖 Smart AI</h3>
              <p className="text-gray-400">
                Leverages deep learning models to analyze market patterns and
                make real-time trading decisions.
              </p>
            </div>
            <div className="bg-gray-900 p-6 rounded-xl shadow hover:shadow-green-400/40 transition">
              <h3 className="text-xl font-semibold mb-3">⚡ Lightning Fast</h3>
              <p className="text-gray-400">
                Executes trades in milliseconds, ensuring you never miss
                profitable opportunities.
              </p>
            </div>
            <div className="bg-gray-900 p-6 rounded-xl shadow hover:shadow-green-400/40 transition">
              <h3 className="text-xl font-semibold mb-3">🔒 Secure</h3>
              <p className="text-gray-400">
                Built with top-notch security protocols to keep your assets safe
                and trading worry-free.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 bg-black text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Algo Mind — All rights reserved.
      </footer>
    </div>
  );
}
