import type { CachedExchangeRate, Currency } from '../types/exchange';

// キャッシュの有効期限（1日 = 24時間）
const CACHE_DURATION = 24 * 60 * 60 * 1000;

// 暫定値の設定
const FALLBACK_RATES = {
  USD: 150,
  EUR: 140,
};

// キャッシュからレートを取得
export const getCachedRate = (currency: Currency): number | null => {
  const cacheKey = `exchange_rate_${currency}`;
  const cachedData = localStorage.getItem(cacheKey);
  
  if (!cachedData) return null;
  
  try {
    const parsed: CachedExchangeRate = JSON.parse(cachedData);
    const now = Date.now();
    
    // キャッシュの有効期限をチェック
    if (now - parsed.timestamp > CACHE_DURATION) {
      localStorage.removeItem(cacheKey);
      return null;
    }
    
    return parsed.rate;
  } catch {
    // パースエラーの場合はキャッシュを削除
    localStorage.removeItem(cacheKey);
    return null;
  }
};

// レートをキャッシュに保存
export const setCachedRate = (currency: Currency, rate: number): void => {
  const cacheKey = `exchange_rate_${currency}`;
  const cacheData: CachedExchangeRate = {
    rate,
    timestamp: Date.now(),
    currency,
  };
  
  localStorage.setItem(cacheKey, JSON.stringify(cacheData));
};

// 暫定値を取得
export const getFallbackRate = (currency: Currency): number => {
  return FALLBACK_RATES[currency];
};

// キャッシュをクリア（強制的にAPIから最新のレートを取得するため）
export const clearCachedRate = (currency: Currency): void => {
  const cacheKey = `exchange_rate_${currency}`;
  localStorage.removeItem(cacheKey);
  console.log(`[Exchange Rate] Cleared cache for ${currency}`);
};

// すべての為替レートキャッシュをクリア
export const clearAllCachedRates = (): void => {
  const currencies: Currency[] = ['USD', 'EUR'];
  currencies.forEach(currency => {
    clearCachedRate(currency);
  });
  console.log('[Exchange Rate] Cleared all exchange rate caches');
};