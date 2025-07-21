import React, { useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  type: ToastType;
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  type,
  message,
  isVisible,
  onClose,
  duration = 4000
}) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose, duration]);

  if (!isVisible) return null;

  const getToastStyles = () => {
    const baseStyles = 'fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg max-w-md transform transition-all duration-300 ease-in-out';
    
    switch (type) {
      case 'success':
        return `${baseStyles} bg-green-100 border border-green-400 text-green-800`;
      case 'error':
        return `${baseStyles} bg-red-100 border border-red-400 text-red-800`;
      case 'warning':
        return `${baseStyles} bg-yellow-100 border border-yellow-400 text-yellow-800`;
      case 'info':
        return `${baseStyles} bg-blue-100 border border-blue-400 text-blue-800`;
      default:
        return `${baseStyles} bg-gray-100 border border-gray-400 text-gray-800`;
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return '•';
    }
  };

  return (
    <div className={getToastStyles()}>
      <div className="flex items-center gap-3">
        <span className="text-lg font-bold">{getIcon()}</span>
        <span className="text-sm font-medium">{message}</span>
        <button
          onClick={onClose}
          className="ml-auto text-lg font-bold opacity-70 hover:opacity-100"
          aria-label="閉じる"
        >
          ×
        </button>
      </div>
    </div>
  );
};