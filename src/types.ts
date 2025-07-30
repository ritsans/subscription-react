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
  has_trial: boolean; // 無料トライアル期間の有無
  trial_period_days?: number; // トライアル期間の日数
  trial_start_date?: string; // トライアル開始日（ISO文字列）
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
  has_trial: boolean; // 無料トライアル期間の有無
  trial_period_days?: string; // トライアル期間の日数（フォーム用文字列）
  trial_start_date?: string; // トライアル開始日（ISO文字列）
}

//
// カテゴリ定義
//

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

// カテゴリごとの設定（カテゴリ・色・アイコン名はここで指定します）
export const CATEGORY_CONFIG = {
  [CATEGORIES.MUSIC]: {
    borderColor: 'border-l-purple-500',
    badgeColor: 'bg-purple-100 text-purple-700',
    icon: 'LuMusic'
  },
  [CATEGORIES.SOFTWARE]: {
    borderColor: 'border-l-blue-500',
    badgeColor: 'bg-blue-100 text-blue-700',
    icon: 'LuMonitor'
  },
  [CATEGORIES.GAMING]: {
    borderColor: 'border-l-green-500',
    badgeColor: 'bg-green-100 text-green-700',
    icon: 'LuGamepad2'
  },
  [CATEGORIES.ENTERTAINMENT]: {
    borderColor: 'border-l-red-500',
    badgeColor: 'bg-red-100 text-red-700',
    icon: 'LuPlay'
  },
  [CATEGORIES.NEWS]: {
    borderColor: 'border-l-slate-500',
    badgeColor: 'bg-slate-100 text-slate-700',
    icon: 'LuNewspaper'
  },
  [CATEGORIES.PRODUCTIVITY]: {
    borderColor: 'border-l-yellow-500',
    badgeColor: 'bg-yellow-100 text-yellow-700',
    icon: 'LuZap'
  },
  [CATEGORIES.CLOUD]: {
    borderColor: 'border-l-cyan-500',
    badgeColor: 'bg-cyan-100 text-cyan-700',
    icon: 'LuCloud'
  },
  [CATEGORIES.OTHER]: {
    borderColor: 'border-l-amber-500',
    badgeColor: 'bg-amber-100 text-amber-700',
    icon: 'LuPackage'
  },
  [CATEGORIES.UNCATEGORIZED]: {
    borderColor: 'border-l-gray-400',
    badgeColor: 'bg-gray-100 text-gray-700',
    icon: 'LuCircle'
  }
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