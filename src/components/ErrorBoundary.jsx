import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error details
    console.error('[ERROR_BOUNDARY] Caught an error:', {
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name
      },
      errorInfo: {
        componentStack: errorInfo.componentStack
      },
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    });

    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
          <div className="max-w-2xl w-full">
            <div className="bg-red-900/20 border border-red-500 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">⚠️</span>
                <h1 className="text-xl font-bold text-red-300">
                  Application Error
                </h1>
              </div>
              
              <p className="text-red-200 mb-4">
                Something went wrong with the application. This error has been logged for debugging.
              </p>
              
              <div className="mb-4">
                <h3 className="font-semibold text-red-300 mb-2">Error Details:</h3>
                <div className="bg-gray-800 p-3 rounded text-sm font-mono text-red-400">
                  {this.state.error && this.state.error.toString()}
                </div>
              </div>
              
              <div className="mb-6">
                <details className="cursor-pointer">
                  <summary className="font-semibold text-red-300 hover:text-red-200">
                    Technical Details (Click to expand)
                  </summary>
                  <div className="mt-2 bg-gray-800 p-3 rounded text-xs font-mono text-gray-300 overflow-auto max-h-40">
                    {this.state.error && this.state.error.stack}
                    {this.state.errorInfo && this.state.errorInfo.componentStack}
                  </div>
                </details>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition"
                >
                  Reload Page
                </button>
                <button
                  onClick={() => {
                    this.setState({ hasError: false, error: null, errorInfo: null });
                  }}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;