import React, { useState, useEffect } from 'react';
import { X, TrendingUp, TrendingDown, Activity } from 'lucide-react';

// Optimization constant: Number of trades to render initially for instant popup loading
const INITIAL_RENDER_COUNT = 50;

const StrategyCard = ({ strategyName, accuracy, monthlyRange, total, profitable, loss }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedList, setSelectedList] = useState(null);
  // State for performance optimization: holds the trades currently visible in the popup table
  const [renderedList, setRenderedList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getFullList = (listType) => {
    if (listType === 'total') return total;
    if (listType === 'profitable') return profitable;
    if (listType === 'loss') return loss;
    return [];
  };

  const handleOpenPopup = (e, listType) => {
    e.stopPropagation();
    setSelectedList(listType);
    const fullList = getFullList(listType);
    
    // 1. Render only a small subset immediately for instant popup open
    setRenderedList(fullList.slice(0, INITIAL_RENDER_COUNT));
    setIsPopupOpen(true);
    document.body.style.overflow = 'hidden';
    
    // 2. Set loading to true and use a minimal timeout to defer rendering the full list
    setIsLoading(true);
    setTimeout(() => {
      setRenderedList(fullList);
      setIsLoading(false);
    }, 10); // Small delay for the browser to render the initial set and popup instantly
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedList(null);
    setRenderedList([]); // Clear the list on close
    document.body.style.overflow = 'unset';
    setIsLoading(false);
  };

  const getPopupTitle = () => {
    if (selectedList === 'total') return 'All Trades';
    if (selectedList === 'profitable') return 'Profitable Trades';
    if (selectedList === 'loss') return 'Loss Trades';
    return '';
  };

  const getPopupColor = () => {
    if (selectedList === 'total') return 'cyan';
    if (selectedList === 'profitable') return 'emerald';
    if (selectedList === 'loss') return 'red';
    return 'cyan';
  };

  const color = getPopupColor();

  return (
    <>
      {/* Refined Strategy Card UI */}
      <div className="bg-gradient-to-br from-[#0F1117] to-[#1A1D2E] border border-white/[0.08] rounded-2xl p-6 h-full flex flex-col hover:shadow-xl transition-all duration-300">
        {/* Strategy Title & Accuracy - Better Alignment */}
        <h3 className="text-xl font-bold text-white mb-1">{strategyName}</h3>
        <p className="text-sm text-gray-400 mb-6 flex justify-between items-center">
          <span className="font-medium uppercase tracking-wider">Accuracy</span>
          <span className="text-lg text-emerald-400 font-bold">{accuracy}%</span>
        </p>

        {/* Info Section - ***Conclusive Alignment Fix*** */}
        <div className="flex-1 text-sm text-gray-300 bg-white/5 border border-white/10 rounded-xl p-4 space-y-1">
          {/* Average Monthly Trades - Aligned with Flex */}
          <div className="flex items-center justify-between py-2 px-3">
            <p className="font-medium">Avg. Monthly Trades:</p>
            <span className="text-white font-semibold">{monthlyRange}</span>
          </div>
          
          {/* Total Trades Button - Aligned with Flex Button structure */}
          <button
            onClick={(e) => handleOpenPopup(e, 'total')}
            className="w-full flex items-center justify-between text-left hover:bg-white/10 rounded-lg transition-colors py-2 px-3"
          >
            <p className="font-medium">Total Trades:</p>
            <span className="text-cyan-400 font-bold underline transition-colors">
              {total.length}
            </span>
          </button>
          
          {/* Wins/Losses Buttons - Aligned with Flex and dedicated structure */}
          <div className="flex gap-2 pt-1">
            <button
              onClick={(e) => handleOpenPopup(e, 'profitable')}
              className="flex-1 flex items-center justify-between text-left hover:bg-white/10 rounded-lg transition-colors py-2 px-3"
            >
              <p className="font-medium">Wins:</p>
              <span className="text-emerald-400 font-bold underline transition-colors">
                {profitable.length}
              </span>
            </button>
            <button
              onClick={(e) => handleOpenPopup(e, 'loss')}
              className="flex-1 flex items-center justify-between text-left hover:bg-white/10 rounded-lg transition-colors py-2 px-3"
            >
              <p className="font-medium">Losses:</p>
              <span className="text-red-400 font-bold underline transition-colors">
                {loss.length}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* DETAILED POPUP */}
      {isPopupOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={handleClosePopup}
        >
          {/* POPUP WIDTH INCREASED TO max-w-6xl */}
          <div
            className="relative bg-gradient-to-br from-[#0F1117] to-[#1A1D2E] border border-white/[0.08] rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            style={{
              animation: 'popupFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            {/* Gradient orb background */}
            <div className={`absolute top-0 right-0 w-64 h-64 bg-${color}-500/10 rounded-full -mr-32 -mt-32 blur-3xl`} />
            
            {/* Header */}
            <div className="relative border-b border-white/[0.08] p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 bg-${color}-500/10 border border-${color}-500/20 rounded-xl`}>
                    {selectedList === 'profitable' && <TrendingUp className={`w-6 h-6 text-${color}-400`} />}
                    {selectedList === 'loss' && <TrendingDown className={`w-6 h-6 text-${color}-400`} />}
                    {selectedList === 'total' && <Activity className={`w-6 h-6 text-${color}-400`} />}
                  </div>
                  <div>
                    <h3 className={`text-2xl font-bold text-white`}>
                      {getPopupTitle()}
                    </h3>
                    <p className={`text-sm text-${color}-400 font-semibold mt-1`}>
                      {strategyName} • {getFullList(selectedList).length} trades
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClosePopup}
                  className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl transition-all duration-200 group flex-shrink-0"
                >
                  <X className="w-5 h-5 text-gray-400 group-hover:text-white" />
                </button>
              </div>

              {/* Accuracy in popup header */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Strategy Accuracy</span>
                  <span className="text-sm font-bold text-white">{accuracy}%</span>
                </div>
                <div className="h-2 bg-white/[0.05] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 rounded-full"
                    style={{ width: `${accuracy}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Table Content - Scrollable */}
            <div className="relative p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
              <div className="overflow-x-auto">
                <table className="w-full table-auto"> {/* Added table-auto for better column control */}
                  <thead className="sticky top-0 bg-gradient-to-br from-[#0F1117] to-[#1A1D2E] z-10">
                    <tr className="border-b border-white/[0.08]">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider w-1/4">
                        Crypto Coin
                      </th>
                      {/* Using w-2/4 to give maximum space to Timestamp */}
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider w-2/4">
                        Timestamp
                      </th>
                      <th className="text-right py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider w-1/4">
                        Profit/Loss
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Rendered list (initial subset + full list after delay) */}
                    {renderedList.map((trade, index) => {
                      const isProfit = trade.percentage.startsWith('+');
                      return (
                        <tr
                          key={index}
                          className="border-b border-white/[0.05] hover:bg-white/[0.02] transition-colors duration-150"
                          style={{
                            animation: `fadeInRow 0.3s ease-out ${index * 0.001}s both` // Reduced animation delay for quicker load
                          }}
                        >
                          <td className="py-3 px-4 text-sm font-medium text-white w-1/4">
                            {trade.coin}
                          </td>
                          {/* Displaying both Date and Time in one cell, ensuring it uses the expanded width */}
                          <td className="py-3 px-4 text-sm text-gray-400 w-2/4">
                            <span className='font-medium text-white'>{trade.date}</span> <span className='text-gray-500'>at</span> {trade.time}
                          </td>
                          <td className="py-3 px-4 text-right w-1/4">
                            <span className={`inline-flex items-center justify-end gap-1 px-2.5 py-1 rounded-lg font-semibold text-sm ${
                              isProfit 
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                : 'bg-red-500/10 text-red-400 border border-red-500/20'
                            }`}>
                              {isProfit ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                              {trade.percentage}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {/* Loading Indicator for deferred trades */}
                {isLoading && (
                  <div className="py-8 text-center text-gray-500">
                    <svg className="animate-spin h-5 w-5 text-gray-500 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-sm">Loading more trades...</p>
                  </div>
                )}
                {/* Fallback for very large list to indicate full data is loaded */}
                {!isLoading && renderedList.length > INITIAL_RENDER_COUNT && (
                    <p className="pt-4 text-center text-xs text-gray-600">
                        {renderedList.length} total entries loaded.
                    </p>
                )}
              </div>
            </div>
          </div>

          {/* Popup animations */}
          <style>{`
            @keyframes popupFadeIn {
              from {
                opacity: 0;
                transform: scale(0.95) translateY(20px);
              }
              to {
                opacity: 1;
                transform: scale(1) translateY(0);
              }
            }
            
            @keyframes fadeInRow {
              from {
                opacity: 0;
                transform: translateX(-10px);
              }
              to {
                opacity: 1;
                transform: translateX(0);
              }
            }
          `}</style>
        </div>
      )}
    </>
  );
};

export default StrategyCard;