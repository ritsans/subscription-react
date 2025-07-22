import { QueryClient } from '@tanstack/react-query';

// QueryClient設定 - サブスクリプション管理アプリ用の最適化
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // サブスクリプションデータは比較的静的なので5分間キャッシュ
      staleTime: 5 * 60 * 1000, // 5分
      // ガベージコレクションタイム - 10分
      gcTime: 10 * 60 * 1000, // 10分 
      // ネットワークエラー時の再試行回数
      retry: 3,
      // ウィンドウフォーカス時の再取得（最新データの確保）
      refetchOnWindowFocus: true,
      // 再接続時の再取得
      refetchOnReconnect: true,
    },
    mutations: {
      // ミューテーション失敗時の再試行（1回のみ）
      retry: 1,
      // ネットワークエラー時の再試行間隔
      retryDelay: 1000,
    },
  },
});