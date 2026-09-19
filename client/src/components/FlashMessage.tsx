import React from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

export type FlashType = 'success' | 'error' | 'info';

interface FlashMessageProps {
  type: FlashType;
  message: string;
  onClose?: () => void;
}

const FlashMessage: React.FC<FlashMessageProps> = ({ type, message, onClose }) => {
  if (!message) return null;

  const styles = {
    success: {
      bg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />,
    },
    error: {
      bg: 'bg-rose-50 border-rose-200 text-rose-800',
      icon: <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />,
    },
    info: {
      bg: 'bg-sky-50 border-sky-200 text-sky-800',
      icon: <Info className="w-5 h-5 text-sky-600 flex-shrink-0" />,
    },
  };

  const current = styles[type] || styles.info;

  return (
    <div className={`flex items-center justify-between p-4 mb-6 rounded-xl border shadow-sm transition-all animate-fadeIn ${current.bg}`}>
      <div className="flex items-center gap-3">
        {current.icon}
        <p className="text-sm font-medium">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default FlashMessage;
