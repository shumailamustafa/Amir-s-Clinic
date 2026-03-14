'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button, Card } from '@dental/ui';
import { AlertCircle, RefreshCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    // In dev, Next.js already logs to console, but we could add to DevErrorStore here too
    // if we wanted to unify it.
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (process.env.NODE_ENV === 'development') {
        return (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-auto">
            <Card className="max-w-4xl w-full border-red-500/50 bg-[#1A1F2E] p-8 shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-red-500/10 rounded-full">
                  <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-red-500">Render Error Caught</h2>
                  <p className="text-gray-400">An unexpected error occurred during component rendering.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-black/40 rounded-lg border border-red-500/20">
                  <p className="text-lg font-mono font-bold text-white mb-2">
                    {this.state.error?.name}: {this.state.error?.message}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-400">Component Stack:</p>
                  <pre className="p-4 bg-black/60 rounded-lg text-xs font-mono text-gray-300 overflow-auto max-h-[200px]">
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </div>

                <details className="group">
                  <summary className="cursor-pointer text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                    View Full Stack Trace
                  </summary>
                  <pre className="mt-4 p-4 bg-black/60 rounded-lg text-xs font-mono text-red-400 overflow-auto max-h-[300px]">
                    {this.state.error?.stack}
                  </pre>
                </details>

                <div className="pt-6 border-t border-gray-800 flex justify-end">
                  <Button variant="primary" onClick={this.handleReset} className="gap-2 bg-red-600 hover:bg-red-700 border-red-800">
                    <RefreshCcw className="w-4 h-4" /> Try Again / Reload
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        );
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] p-4 text-center">
          <div className="max-w-md space-y-6">
            <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-10 h-10 text-[var(--color-primary)]" />
            </div>
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Something went wrong</h1>
            <p className="text-[var(--color-text-secondary)]">
              We've encountered an unexpected error. Dr. Amir's team has been notified.
            </p>
            <Button onClick={this.handleReset} className="w-full">
              Back to Safety
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
