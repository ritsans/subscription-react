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

// 認証関連の型定義
export interface User {
  id: string;
  email: string;
  email_confirmed_at: string | null;
  created_at: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
}

export interface LoginFormData {
  email: string;
  password: string;
  rememberEmail?: boolean;
}