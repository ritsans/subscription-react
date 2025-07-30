import { supabase } from '../lib/supabase';
import type { Subscription } from '../types';

export interface DatabaseSubscription {
  id: string;
  user_id: string; // ユーザーIDを追加
  name: string;
  price: number;
  cycle: 'monthly' | 'yearly';
  currency: 'JPY' | 'USD' | 'EUR';
  category: string;
  payment_start_date?: string;
  payment_pattern?: 'fixed_day' | 'contract_based' | 'none';
  payment_day?: number;
  has_trial?: boolean; // 無料トライアル期間の有無
  trial_period_days?: number; // トライアル期間の日数
  trial_start_date?: string; // トライアル開始日（ISO文字列）
  created_at: string;
  updated_at: string;
}

// Supabaseからサブスクリプション一覧を取得（ユーザー固有）
export const fetchSubscriptions = async (): Promise<Subscription[]> => {
  // 現在のユーザーを確認
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    throw new Error('認証が必要です');
  }

  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id) // ユーザー固有のデータのみ取得
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch subscriptions: ${error.message}`);
  }

  return data.map(item => ({
    id: item.id,
    name: item.name,
    price: item.price,
    cycle: item.cycle,
    currency: item.currency,
    category: item.category || 'カテゴリなし',
    payment_start_date: item.payment_start_date || '',
    payment_pattern: item.payment_pattern || 'contract_based',
    payment_day: item.payment_day,
    has_trial: item.has_trial || false,
    trial_period_days: item.trial_period_days,
    trial_start_date: item.trial_start_date,
  }));
};

// 新しいサブスクリプションを作成
export const createSubscription = async (subscription: Omit<Subscription, 'id'>): Promise<Subscription> => {
  // 現在のユーザーを確認
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    throw new Error('認証が必要です');
  }

  // 支払い情報の処理：空文字列やundefinedの場合はnullに変換
  const insertData = {
    user_id: user.id, // ユーザーIDを追加
    name: subscription.name,
    price: subscription.price,
    cycle: subscription.cycle,
    currency: subscription.currency,
    category: subscription.category,
    payment_start_date: subscription.payment_start_date || null,
    payment_pattern: subscription.payment_pattern || null,
    payment_day: subscription.payment_day || null,
    has_trial: subscription.has_trial || false,
    trial_period_days: subscription.trial_period_days || null,
    trial_start_date: subscription.trial_start_date || null,
  };

  const { data, error } = await supabase
    .from('subscriptions')
    .insert([insertData])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create subscription: ${error.message}`);
  }

  return {
    id: data.id,
    name: data.name,
    price: data.price,
    cycle: data.cycle,
    currency: data.currency,
    category: data.category || 'カテゴリなし',
    payment_start_date: data.payment_start_date || '',
    payment_pattern: data.payment_pattern || 'contract_based',
    payment_day: data.payment_day,
    has_trial: data.has_trial || false,
    trial_period_days: data.trial_period_days,
    trial_start_date: data.trial_start_date,
  };
};

// サブスクリプションを更新
export const updateSubscription = async (subscription: Subscription): Promise<Subscription> => {
  // 現在のユーザーを確認
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    throw new Error('認証が必要です');
  }

  // 支払い情報の処理：空文字列やundefinedの場合はnullに変換
  const updateData = {
    name: subscription.name,
    price: subscription.price,
    cycle: subscription.cycle,
    currency: subscription.currency,
    category: subscription.category,
    payment_start_date: subscription.payment_start_date || null,
    payment_pattern: subscription.payment_pattern || null,
    payment_day: subscription.payment_day || null,
    has_trial: subscription.has_trial || false,
    trial_period_days: subscription.trial_period_days || null,
    trial_start_date: subscription.trial_start_date || null,
  };

  const { data, error } = await supabase
    .from('subscriptions')
    .update(updateData)
    .eq('id', subscription.id)
    .eq('user_id', user.id) // ユーザー固有の制約を追加
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update subscription: ${error.message}`);
  }

  return {
    id: data.id,
    name: data.name,
    price: data.price,
    cycle: data.cycle,
    currency: data.currency,
    category: data.category || 'カテゴリなし',
    payment_start_date: data.payment_start_date || '',
    payment_pattern: data.payment_pattern || 'contract_based',
    payment_day: data.payment_day,
    has_trial: data.has_trial || false,
    trial_period_days: data.trial_period_days,
    trial_start_date: data.trial_start_date,
  };
};

// サブスクリプションを削除
export const deleteSubscription = async (id: string): Promise<void> => {
  // 現在のユーザーを確認
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    throw new Error('認証が必要です');
  }

  const { error } = await supabase
    .from('subscriptions')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id); // ユーザー固有の制約を追加

  if (error) {
    throw new Error(`Failed to delete subscription: ${error.message}`);
  }
};