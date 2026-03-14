'use client';

import React, { useState } from 'react';
import { useDevErrorStore } from '../../stores/devErrorStore';
import { Card, Button, Badge } from '@dental/ui';
import { AlertCircle, ChevronUp, ChevronDown, Trash2, X } from 'lucide-react';

export function DevErrorPanel() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { errors, clearErrors } = useDevErrorStore();

  if (process.env.NODE_ENV !== 'development') return null;
  if (errors.length === 0 && !isExpanded) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col items-end gap-2 max-w-[90vw] sm:max-w-2xl">
      {/* Badge/Trigger */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-lg border transition-all ${
          errors.length > 0 
            ? 'bg-red-500 text-white border-red-600 hover:bg-red-600' 
            : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'
        }`}
      >
        <AlertCircle className="w-4 h-4" />
        <span className="text-xs font-bold uppercase tracking-wider">
          Dev Errors ({errors.length})
        </span>
        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
      </button>

      {/* Expanded Panel */}
      {isExpanded && (
        <Card className="w-full bg-[#141824] border-gray-800 shadow-2xl overflow-hidden flex flex-col max-h-[70vh]">
          <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-[#1A1F2E]">
            <div className="flex items-center gap-2">
              <Badge variant="closed">{errors.length} Active Issues</Badge>
              <h3 className="text-sm font-bold text-white uppercase tracking-tighter">Debug Console</h3>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearErrors}
                className="text-gray-400 hover:text-red-400 h-8 gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsExpanded(false)}
                className="text-gray-400 hover:text-white h-8"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {errors.length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-green-500">✓</span>
                </div>
                <p className="text-sm text-gray-400">No errors detected in this session.</p>
              </div>
            ) : (
              errors.map((err) => (
                <div key={err.id} className="p-4 bg-black/40 rounded-lg border border-gray-800 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="info">
                        {err.source}
                      </Badge>
                      <span className="text-[10px] text-gray-500 font-mono self-center">
                        {err.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm font-mono font-bold text-red-400 leading-relaxed">
                    {err.message}
                  </p>

                  {err.stack && (
                    <details className="group">
                      <summary className="cursor-pointer text-[10px] font-bold text-gray-500 hover:text-gray-400 uppercase tracking-widest transition-colors select-none">
                        Stack Trace
                      </summary>
                      <pre className="mt-2 p-3 bg-black/60 rounded text-[10px] font-mono text-gray-400 overflow-x-auto whitespace-pre leading-normal border border-gray-800">
                        {err.stack}
                      </pre>
                    </details>
                  )}
                </div>
              ))
            )}
          </div>
        </Card>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #2A2F42;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #3A3F52;
        }
      `}</style>
    </div>
  );
}
