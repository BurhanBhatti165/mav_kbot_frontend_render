import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import BasicCharts from "./pages/BasicCharts";
import Home from "./pages/Home";
import Glossary from "./pages/Glossary";
import Logo from "./assets/logo1.jpg"; // 👈 place your logo in src/assets/

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        {/* Navbar */}
        <nav className="bg-gray-800 p-4 flex items-center justify-between">
          {/* Left side - Links */}
          <div className="flex gap-6">
            <Link to="/" className="hover:text-green-400">Home</Link>
            <Link to="/chart" className="hover:text-green-400">Live Chart</Link>
            <Link to="/glossary" className="hover:text-green-400">Glossary</Link>
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chart" element={<BasicCharts />} />
          <Route path="/glossary" element={<Glossary />} />
        </Routes>
      </div>
    </Router>
  );
}
