import { useState } from 'react';

export default function DebugPanel({ 
  apiBase, 
  connectionStatus, 
  wsError, 
  error, 
  candlesCount, 
  selectedIndicators,
  symbol,
  timeframe 
}) {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg z-50"
        title="Open Debug Panel"
      >
        🐛
      </button>
    );
  }

  return (
    <div className="fixed bottom-20 right-4 bg-gray-800 border border-gray-600 rounded-lg p-4 w-80 max-h-96 overflow-y-auto z-50 text-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-blue-400">🐛 Debug Info</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-3">
        {/* API Configuration */}
        <div>
          <div className="font-semibold text-green-400 mb-1">API Configuration:</div>
          <div className="bg-gray-900 p-2 rounded text-xs font-mono">
            <div>Base URL: {apiBase || 'Not set'}</div>
            <div>Symbol: {symbol || 'None'}</div>
            <div>Timeframe: {timeframe || 'None'}</div>
          </div>
        </div>

        {/* Connection Status */}
        <div>
          <div className="font-semibold text-green-400 mb-1">Connection:</div>
          <div className="bg-gray-900 p-2 rounded text-xs">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                connectionStatus === 'connected' ? 'bg-green-500' :
                connectionStatus === 'connecting' ? 'bg-yellow-500' :
                connectionStatus === 'error' ? 'bg-red-500' :
                'bg-gray-500'
              }`}></div>
              <span className="capitalize">{connectionStatus}</span>
            </div>
          </div>
        </div>

        {/* Data Status */}
        <div>
          <div className="font-semibold text-green-400 mb-1">Data:</div>
          <div className="bg-gray-900 p-2 rounded text-xs">
            <div>Candles: {candlesCount || 0}</div>
            <div>Indicators: {selectedIndicators?.length || 0} selected</div>
          </div>
        </div>

        {/* Errors */}
        {(error || wsError) && (
          <div>
            <div className="font-semibold text-red-400 mb-1">Errors:</div>
            <div className="bg-red-900/20 border border-red-500 p-2 rounded text-xs">
              {error && <div className="mb-1">API: {error}</div>}
              {wsError && <div>WebSocket: {wsError}</div>}
            </div>
          </div>
        )}

        {/* Environment */}
        <div>
          <div className="font-semibold text-green-400 mb-1">Environment:</div>
          <div className="bg-gray-900 p-2 rounded text-xs">
            <div>Browser: {navigator.userAgent.split(' ')[0]}</div>
            <div>Time: {new Date().toLocaleTimeString()}</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={() => {
              console.log('[DEBUG] Current state:', {
                apiBase,
                connectionStatus,
                wsError,
                error,
                candlesCount,
                selectedIndicators,
                symbol,
                timeframe,
                timestamp: new Date().toISOString()
              });
            }}
            className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs"
          >
            Log State
          </button>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs"
          >
            Reset App
          </button>
        </div>
      </div>
    </div>
  );
}