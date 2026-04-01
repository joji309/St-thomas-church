import React from 'react';
import { AlertTriangle } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log to error tracking service (e.g., Sentry)
    console.error('Error caught by boundary:', error, errorInfo);
    
    // In production, send to monitoring service
    if (import.meta.env.VITE_ERROR_TRACKING_URL) {
      try {
        fetch(import.meta.env.VITE_ERROR_TRACKING_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            error: error.toString(),
            stack: error.stack,
            url: window.location.href,
            timestamp: new Date().toISOString(),
          }),
        });
      } catch (e) {
        console.error('Failed to send error report:', e);
      }
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-navy-blue to-navy-blue/80">
          <div className="text-center px-6">
            <div className="inline-flex items-center justify-center p-4 bg-red-500/20 rounded-full mb-6">
              <AlertTriangle className="h-12 w-12 text-red-500" />
            </div>
            <h1 className="text-3xl font-serif font-bold text-white mb-4">
              Something Went Wrong
            </h1>
            <p className="text-gray-300 mb-8 max-w-md">
              We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-liturgical-gold hover:bg-liturgical-gold/90 text-navy-blue font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Refresh Page
            </button>
            <p className="text-gray-400 text-sm mt-6">
              Error ID: {Math.random().toString(36).substr(2, 9)}
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
