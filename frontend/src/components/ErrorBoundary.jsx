import React, { Component } from "react";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null, timestamp: null };
    this.containerRef = React.createRef();
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      errorInfo,
      timestamp: new Date().toISOString(),
    });
    console.error("[ErrorBoundary] Caught unexpected crash:", error, errorInfo);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.hasError && !prevState.hasError) {
      // Accessibility: Focus on mount for screen readers
      this.containerRef.current?.focus();
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = "/dashboard";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div 
          ref={this.containerRef}
          tabIndex="-1"
          role="alert"
          aria-live="assertive"
          className="fixed inset-0 z-[100] bg-[#0A0A0B] flex flex-col items-center justify-center p-6 text-white font-sans outline-none"
        >
          <div className="max-w-md w-full text-center space-y-8 bg-[#0B0F1A] border border-white/5 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
            {/* Ambient background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-rose-500/10 rounded-full blur-[80px] pointer-events-none z-0"></div>

            <div className="relative z-10 space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-rose-500/10 flex items-center justify-center border border-rose-500/20 mx-auto">
                <AlertTriangle className="text-rose-400" size={32} />
              </div>

              <div className="space-y-2">
                <h1 className="text-3xl font-black tracking-tighter">System Interrupted</h1>
                <p className="text-slate-400 text-sm leading-relaxed">
                  An unexpected error has occurred. We've logged the incident and you can attempt to reload or navigate back.
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={this.handleReload}
                  className="flex-1 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 py-3 px-4 rounded-xl text-sm font-semibold transition-all active:scale-[0.98]"
                >
                  <RotateCcw size={16} />
                  Reload Application
                </button>
                <button
                  onClick={this.handleGoHome}
                  className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 py-3 px-4 rounded-xl text-sm font-semibold transition-all active:scale-[0.98]"
                >
                  <Home size={16} />
                  Go to Dashboard
                </button>
              </div>

              {/* Collapsible Tech Details */}
              <details className="text-left bg-black/40 border border-white/5 rounded-xl p-4 group select-none">
                <summary className="text-xs font-bold text-slate-500 cursor-pointer hover:text-slate-350 list-none flex justify-between items-center outline-none">
                  <span>Technical Diagnostics</span>
                  <span className="material-symbols-outlined text-[16px] group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                <div className="mt-3 pt-3 border-t border-white/5 space-y-2 text-[10px] font-mono text-rose-300 overflow-x-auto select-text leading-relaxed">
                  <p><span className="text-slate-500">Timestamp:</span> {this.state.timestamp}</p>
                  <p><span className="text-slate-500">Error:</span> {this.state.error?.toString()}</p>
                  <pre className="whitespace-pre text-wrap"><span className="text-slate-500">Trace:</span> {this.state.errorInfo?.componentStack}</pre>
                </div>
              </details>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
