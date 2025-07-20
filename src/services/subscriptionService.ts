import { supabase } from '../lib/supabase';
import type { Subscription } from '../types';

export interface DatabaseSubscription {
  id: string;
  name: string;
  price: number;
  cycle: 'monthly' | 'yearly';
  currency: 'JPY' | 'USD' | 'EUR';
  category: string;
  payment_start_date?: string;
  payment_pattern?: 'fixed_day' | 'contract_based' | 'none';
  payment_day?: number;
  created_at: string;
  updated_at: string;
}

// Supabaseからサブスクリプション一覧を取得
export const fetchSubscriptions = async (): Promise<Subscription[]> => {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
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
  }));
};

// 新しいサブスクリプションを作成
export const createSubscription = async (subscription: Omit<Subscription, 'id'>): Promise<Subscription> => {
  // 支払い情報の処理：空文字列やundefinedの場合はnullに変換
  const insertData = {
    name: subscription.name,
    price: subscription.price,
    cycle: subscription.cycle,
    currency: subscription.currency,
    category: subscription.category,
    payment_start_date: subscription.payment_start_date || null,
    payment_pattern: subscription.payment_pattern || null,
    payment_day: subscription.payment_day || null,
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
  };
};

// サブスクリプションを更新
export const updateSubscription = async (subscription: Subscription): Promise<Subscription> => {
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
  };

  const { data, error } = await supabase
    .from('subscriptions')
    .update(updateData)
    .eq('id', subscription.id)
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
  };
};

// サブスクリプションを削除
export const deleteSubscription = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('subscriptions')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete subscription: ${error.message}`);
  }
};