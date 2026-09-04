import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, Info, X, AlertCircle } from 'lucide-react';

export type ToastType = 'success' | 'warning' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (title: string, message?: string, type?: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (title: string, message?: string, type: ToastType = 'success', duration = 4000) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
      const newToast: ToastMessage = { id, title, message, type, duration };

      setToasts((prev) => [...prev.slice(-4), newToast]); // keep max 5

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      {/* Toast Render Portal */}
      <div
        id="toast-notifications-portal"
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-xl border shadow-xl flex items-start gap-3 transition-all duration-300 animate-in slide-in-from-bottom-3 fade-in ${
              toast.type === 'success'
                ? 'bg-[#18261b] border-[#9cd499]/60 text-[#eae1dd]'
                : toast.type === 'warning'
                ? 'bg-[#292015] border-[#fecc93]/60 text-[#eae1dd]'
                : toast.type === 'error'
                ? 'bg-[#2b1618] border-[#ffb4ab]/60 text-[#eae1dd]'
                : 'bg-[#1e2329] border-[#a0c4ff]/60 text-[#eae1dd]'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-[#9cd499]" />}
              {toast.type === 'warning' && <AlertTriangle className="w-4 h-4 text-[#fecc93]" />}
              {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-[#ffb4ab]" />}
              {toast.type === 'info' && <Info className="w-4 h-4 text-[#a0c4ff]" />}
            </div>

            <div className="flex-1 text-xs">
              <span className="font-bold block text-[#eae1dd]">{toast.title}</span>
              {toast.message && <p className="text-xs text-[#d3c4b6] mt-0.5 leading-relaxed">{toast.message}</p>}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#9c8e82] hover:text-[#eae1dd] p-0.5 transition cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export function useToast(): ToastContextType {
  const context = useContext(ToastContext);
  if (!context) {
    // Fallback if rendered outside provider
    return {
      showToast: (title, msg) => console.log(`[Toast Fallback] ${title}: ${msg}`),
      removeToast: () => {},
    };
  }
  return context;
}
