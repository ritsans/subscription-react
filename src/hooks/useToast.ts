import { useState, useCallback } from 'react';
import type { ToastType } from '../components/Toast';

interface ToastState {
  id: number;
  type: ToastType;
  message: string;
  isVisible: boolean;
}

export const useToast = () => {
  const [toast, setToast] = useState<ToastState | null>(null);

  // トーストを表示
  const showToast = useCallback((type: ToastType, message: string) => {
    const id = Date.now();
    setToast({
      id,
      type,
      message,
      isVisible: true
    });
  }, []);

  // トーストを閉じる
  const hideToast = useCallback(() => {
    setToast(prev => prev ? { ...prev, isVisible: false } : null);
    setTimeout(() => setToast(null), 300); // アニメーション後に削除
  }, []);

  // ショートカット関数
  const showSuccess = useCallback((message: string) => showToast('success', message), [showToast]);
  const showError = useCallback((message: string) => showToast('error', message), [showToast]);
  const showInfo = useCallback((message: string) => showToast('info', message), [showToast]);
  const showWarning = useCallback((message: string) => showToast('warning', message), [showToast]);

  return {
    toast,
    showToast,
    hideToast,
    showSuccess,
    showError,
    showInfo,
    showWarning
  };
};