import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-16 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-start gap-2.5 p-3 rounded-2xl shadow-xl border backdrop-blur-md transition-all animate-in slide-in-from-right-5 fade-in ${
            t.type === 'success'
              ? 'bg-emerald-950/90 text-emerald-100 border-emerald-700/50'
              : t.type === 'error'
              ? 'bg-red-950/90 text-red-100 border-red-700/50'
              : 'bg-stone-900/90 text-stone-100 border-stone-700/50'
          }`}
        >
          {t.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />}
          {t.type === 'error' && <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />}
          {t.type === 'info' && <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />}
          
          <div className="flex-1 text-xs font-medium leading-relaxed">
            {t.message}
          </div>

          <button
            onClick={() => removeToast(t.id)}
            className="text-stone-400 hover:text-white p-0.5 rounded-lg"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
