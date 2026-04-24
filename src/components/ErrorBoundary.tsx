'use client';

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Send to error tracking service (e.g., Sentry)
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      // window.Sentry?.captureException(error);
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <ErrorFallback error={this.state.error} reset={() => this.setState({ hasError: false, error: null })} />;
    }

    return this.props.children;
  }
}

function ErrorFallback({ error, reset }: { error: Error | null; reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-muted/10">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center space-y-6">
        <div className="flex justify-center">
          <div className="p-4 bg-red-50 rounded-full">
            <AlertTriangle className="w-12 h-12 text-red-500" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-serif text-slate-800">Oops! Something went wrong</h2>
          <p className="text-sm text-muted-foreground font-typewriter uppercase tracking-wider">
            We encountered an unexpected error
          </p>
        </div>

        {error && process.env.NODE_ENV === 'development' && (
          <div className="bg-red-50 p-4 rounded-xl text-left">
            <p className="text-xs font-mono text-red-800 break-all">
              {error.message}
            </p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Button
            onClick={() => {
              reset();
              window.location.reload();
            }}
            className="w-full rounded-full py-6 gap-2"
          >
            <RefreshCw size={18} />
            Reload Page
          </Button>
          
          <Button
            onClick={() => window.location.href = '/'}
            variant="outline"
            className="w-full rounded-full py-6"
          >
            Go to Homepage
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          If the problem persists, please contact support
        </p>
      </div>
    </div>
  );
}

// Simpler error boundary for smaller components
export function SimpleErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      fallback={
        <div className="p-4 bg-red-50 rounded-xl text-center">
          <p className="text-sm text-red-600">Failed to load this section</p>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}
