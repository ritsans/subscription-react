export interface Subscription {
  id: string;
  name: string;
  price: number;
  cycle: 'monthly' | 'yearly';
  currency: 'JPY' | 'USD' | 'EUR';
  category: string;
}

export interface SubscriptionFormData {
  name: string;
  price: string;
  cycle: 'monthly' | 'yearly';
  currency: 'JPY' | 'USD' | 'EUR';
  category: string;
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