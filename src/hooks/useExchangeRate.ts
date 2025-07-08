import { useState, useEffect } from 'react';
import type { Currency, ExchangeRateResponse, UseExchangeRateReturn } from '../types/exchange';
import { getCachedRate, setCachedRate, getFallbackRate } from '../utils/exchangeRateCache';

// APIキーを環境変数から取得
const API_KEY = import.meta.env.VITE_EXCHANGE_RATE_API_KEY;

// exchange-rate-apiからレートを取得
const fetchExchangeRate = async (currency: Currency): Promise<number> => {
  if (!API_KEY) {
    throw new Error('API key is not configured');
  }
  
  const response = await fetch(
    `https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${currency}/JPY`
  );
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const data: ExchangeRateResponse = await response.json();
  
  if (data.result !== 'success') {
    throw new Error('API returned error result');
  }
  
  return data.conversion_rate;
};

// カスタムフック: exchange-rate-apiから為替レートを取得
export const useExchangeRate = (currency: Currency): UseExchangeRateReturn => {
  const [rate, setRate] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const getRate = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // キャッシュから取得を試行
        const cachedRate = getCachedRate(currency);
        if (cachedRate) {
          setRate(Math.floor(cachedRate)); // 小数点以下切り捨て
          setIsLoading(false);
          return;
        }
        
        // APIから取得
        const fetchedRate = await fetchExchangeRate(currency);
        setCachedRate(currency, fetchedRate);
        setRate(Math.floor(fetchedRate)); // 小数点以下切り捨て
        
      } catch (err) {
        // エラー時は暫定値を使用
        const fallbackRate = getFallbackRate(currency);
        setRate(fallbackRate);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        
        console.warn(`Exchange rate API error for ${currency}:`, err);
        console.info(`Using fallback rate: ${fallbackRate} JPY`);
      } finally {
        setIsLoading(false);
      }
    };
    
    getRate();
  }, [currency]);
  
  return { rate, isLoading, error };
};