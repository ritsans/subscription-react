export interface Subscription {
  id: string;
  name: string;
  price: number;
  cycle: 'monthly' | 'yearly';
  currency: 'JPY' | 'USD' | 'EUR';
  category: string;
  payment_start_date: string; // ISO date string
  payment_pattern: 'fixed_day' | 'contract_based' | 'none';
  payment_day?: number; // 毎月固定日パターンの場合のみ
}

export interface SubscriptionFormData {
  name: string;
  price: string;
  cycle: 'monthly' | 'yearly';
  currency: 'JPY' | 'USD' | 'EUR';
  category: string;
  payment_start_date: string; // ISO date string
  payment_pattern: 'fixed_day' | 'contract_based' | 'none';
  payment_day?: string; // フォーム用文字列
}

// カテゴリ定義
export const CATEGORIES = {
  UNCATEGORIZED: 'カテゴリなし',
  MUSIC: '音楽',
  SOFTWARE: 'ソフトウェア',
  GAMING: 'ゲーミング',
  ENTERTAINMENT: 'エンターテイメント',
  NEWS: 'ニュース',
  PRODUCTIVITY: '生産性',
  CLOUD: 'クラウド',
  OTHER: 'その他'
} as const;