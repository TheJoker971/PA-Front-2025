import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ id, type, title, message, duration = 5000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-6 w-6 text-emerald-600" />;
      case 'error':
        return <XCircle className="h-6 w-6 text-red-600" />;
      case 'warning':
        return <AlertCircle className="h-6 w-6 text-amber-600" />;
      case 'info':
        return <Info className="h-6 w-6 text-blue-600" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-white border-l-4 border-emerald-500 shadow-lg shadow-emerald-500/20';
      case 'error':
        return 'bg-white border-l-4 border-red-500 shadow-lg shadow-red-500/20';
      case 'warning':
        return 'bg-white border-l-4 border-amber-500 shadow-lg shadow-amber-500/20';
      case 'info':
        return 'bg-white border-l-4 border-blue-500 shadow-lg shadow-blue-500/20';
    }
  };

  return (
    <div className={`${getStyles()} rounded-r-2xl p-4 mb-4 transform transition-all duration-300 animate-slide-in-right`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-bold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600 mt-1">{message}</p>
        </div>
        <button
          onClick={() => onClose(id)}
          className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default Toast;