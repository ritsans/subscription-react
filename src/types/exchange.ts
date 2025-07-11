// 通貨の型定義
export type Currency = 'USD' | 'EUR';

// exchange-rate-apiのレスポンス型定義
export interface ExchangeRateResponse {
  result: string;
  documentation: string;
  terms_of_use: string;
  time_last_update_unix: number;
  time_last_update_utc: string;
  time_next_update_unix: number;
  time_next_update_utc: string;
  base_code: string;
  target_code: string;
  conversion_rate: number;
}

// キャッシュデータの型定義
export interface CachedExchangeRate {
  rate: number;
  timestamp: number;
  currency: Currency;
}

// カスタムフックの戻り値型定義
export interface UseExchangeRateReturn {
  rate: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}