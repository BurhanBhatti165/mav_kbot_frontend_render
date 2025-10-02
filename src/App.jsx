import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BasicCharts from "./pages/BasicCharts";
import Home from "./pages/Home";
import Glossary from "./pages/Glossary";
import PricePrediction from "./pages/PricePrediction";
import Liquidation from "./pages/Liquidation";
import Strategies from "./pages/Strategies";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0A0A0F]">
        <Navbar />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chart" element={<BasicCharts />} />
          <Route path="/glossary" element={<Glossary />} />
          <Route path="/price-prediction" element={<PricePrediction/>} />
          <Route path="/liquidation" element={<Liquidation/>} />
          <Route path="/strategies" element={<Strategies/>} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}