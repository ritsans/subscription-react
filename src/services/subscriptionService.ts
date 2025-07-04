import { supabase } from '../lib/supabase';
import type { Subscription } from '../types';

export interface DatabaseSubscription {
  id: string;
  name: string;
  price: number;
  cycle: 'monthly' | 'yearly';
  currency: 'JPY' | 'USD' | 'EUR';
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
  }));
};

// 新しいサブスクリプションを作成
export const createSubscription = async (subscription: Omit<Subscription, 'id'>): Promise<Subscription> => {
  const { data, error } = await supabase
    .from('subscriptions')
    .insert([subscription])
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
  };
};

// サブスクリプションを更新
export const updateSubscription = async (subscription: Subscription): Promise<Subscription> => {
  const { data, error } = await supabase
    .from('subscriptions')
    .update({
      name: subscription.name,
      price: subscription.price,
      cycle: subscription.cycle,
      currency: subscription.currency,
    })
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