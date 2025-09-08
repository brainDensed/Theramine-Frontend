import React from 'react';
import { motion } from 'framer-motion';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 max-w-2xl w-full border border-red-500/30"
          >
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">🚨</div>
              <h1 className="text-3xl font-bold text-white mb-2">Oops! Something went wrong</h1>
              <p className="text-white/70">We encountered an unexpected error. Don't worry, your data is safe.</p>
            </div>

            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 mb-6">
              <h3 className="text-red-300 font-semibold mb-2">Error Details:</h3>
              <p className="text-red-200 text-sm font-mono">
                {this.state.error && this.state.error.toString()}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-blue-500/30 text-white rounded-xl border border-blue-400/50 hover:bg-blue-500/50 transition"
              >
                🔄 Reload Page
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/'}
                className="px-6 py-3 bg-green-500/30 text-white rounded-xl border border-green-400/50 hover:bg-green-500/50 transition"
              >
                🏠 Go Home
              </motion.button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
              <details className="mt-6 bg-black/30 rounded-xl p-4">
                <summary className="text-white/70 cursor-pointer hover:text-white">
                  🔍 Developer Details (Click to expand)
                </summary>
                <pre className="text-xs text-white/60 mt-4 overflow-auto">
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;