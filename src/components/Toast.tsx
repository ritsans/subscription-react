import React, { useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

/**
 * Toastコンポーネントのプロパティ
 */
interface ToastProps {
  type: ToastType;        // 表示タイプ（色とアイコンを決定）
  message: string;        // 表示メッセージ
  isVisible: boolean;     // 表示状態の制御
  onClose: () => void;    // 閉じるボタンまたは自動閉じ時のコールバック
  duration?: number;      // 自動で閉じるまでの時間（ミリ秒、デフォルト: 4000ms）
}

/**
 * Toast通知コンポーネント
 * 
 * 画面右上に一時的に表示される通知メッセージ。
 * データベース操作の成功・失敗やその他の重要な情報をユーザーに通知する。
 * 
 * @param type - 通知の種類（success/error/warning/info）
 * @param message - 表示するメッセージテキスト
 * @param isVisible - 表示状態のフラグ
 * @param onClose - 閉じるときのコールバック関数
 * @param duration - 自動で閉じるまでの時間（デフォルト: 4秒）
 */
export const Toast: React.FC<ToastProps> = ({
  type,
  message,
  isVisible,
  onClose,
  duration = 4000   // デフォルトの自動閉じ時間はこれ
}) => {
  // 自動閉じ機能: 指定時間後にonClose()を呼び出す
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      // コンポーネントがアンマウントされた際はタイマーをクリア
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose, duration]);

  // 非表示状態の場合は何もレンダリングしない
  if (!isVisible) return null;

  /**
   * 通知タイプに応じたスタイルクラスを生成
   * 画面右上固定、アニメーション付きで各タイプに適した色を設定
   */
  const getToastStyles = () => {
    // 基本スタイル: 右上固定、影付き、角丸、アニメーション付き
    const baseStyles = 'fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg max-w-md transform transition-all duration-300 ease-in-out';
    
    // タイプ別の色設定
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

  /**
   * 通知タイプに応じたアイコンを取得
   * 視覚的に分かりやすいアイコンで通知内容を表現
   */
  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';  // チェックマーク（成功）
      case 'error':
        return '✕';  // バツマーク（エラー）
      case 'warning':
        return '⚠';  // 警告マーク
      case 'info':
        return 'ℹ';  // 情報マーク
      default:
        return '•';  // デフォルトの点
    }
  };

  return (
    <div className={getToastStyles()}>
      <div className="flex items-center gap-3">
        <span className="text-lg font-bold">{getIcon()}</span>
        {/* メッセージテキスト（メイン部分） */}
        <span className="text-sm font-medium">{message}</span>
        {/* 手動で閉じるボタン（右端に配置） */}
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