import React, { useState, useEffect } from 'react';
import { BaseModal } from './BaseModal';
import { SubscriptionFormFields } from './SubscriptionFormFields';
import type { Subscription, SubscriptionFormData } from '../types';
import { CATEGORIES } from '../types';

interface EditSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (subscription: Subscription) => void;
  subscription: Subscription | null;
}

export const EditSubscriptionModal: React.FC<EditSubscriptionModalProps> = ({
  isOpen,
  onClose,
  onUpdate,
  subscription
}) => {
  const [formData, setFormData] = useState<SubscriptionFormData>({
    name: '',
    price: '',
    cycle: 'monthly',
    currency: 'JPY',
    category: CATEGORIES.UNCATEGORIZED,
    payment_start_date: '',
    payment_pattern: 'none',
    has_trial: false,
    trial_period_days: '',
    trial_start_date: ''
  });

  const [errors, setErrors] = useState<{
    name?: string;
    price?: string;
    payment_start_date?: string;
    payment_day?: string;
    trial_period_days?: string;
    trial_start_date?: string;
  }>({});

  useEffect(() => {
    if (subscription) {
      setFormData({
        name: subscription.name,
        price: subscription.price.toString(),
        cycle: subscription.cycle,
        currency: subscription.currency,
        category: subscription.category || CATEGORIES.UNCATEGORIZED,
        payment_start_date: subscription.payment_start_date || '',
        payment_pattern: subscription.payment_pattern || 'none',
        payment_day: subscription.payment_day?.toString() || '',
        has_trial: subscription.has_trial || false,
        trial_period_days: subscription.trial_period_days?.toString() || '',
        trial_start_date: subscription.trial_start_date || ''
      });
      setErrors({});
    }
  }, [subscription]);

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'サービス名を入力してください';
    }

    if (!formData.price.trim()) {
      newErrors.price = '価格を入力してください';
    } else {
      const price = parseFloat(formData.price);
      if (isNaN(price) || price <= 0) {
        newErrors.price = '正しい価格を入力してください';
      }
    }

    // 支払い情報のバリデーション（設定する場合のみ）
    if (formData.payment_pattern === 'contract_based' && formData.payment_start_date && !formData.payment_start_date.trim()) {
      newErrors.payment_start_date = '契約開始日を入力してください';
    }

    if (formData.payment_pattern === 'fixed_day' && formData.payment_day && !formData.payment_day.trim()) {
      newErrors.payment_day = '支払い日を選択してください';
    }

    // トライアル期間のバリデーション
    if (formData.has_trial) {
      if (!formData.trial_period_days || !formData.trial_period_days.trim()) {
        newErrors.trial_period_days = 'トライアル期間を入力してください';
      } else {
        const trialDays = parseInt(formData.trial_period_days);
        if (isNaN(trialDays) || trialDays <= 0 || trialDays > 365) {
          newErrors.trial_period_days = '1〜365日の範囲で入力してください';
        }
      }

    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subscription || !validateForm()) {
      return;
    }

    const price = parseFloat(formData.price);
    
    // 支払い情報とトライアル情報の処理
    const updatedSubscription: Subscription = {
      ...subscription,
      name: formData.name.trim(),
      price,
      cycle: formData.cycle,
      currency: formData.currency,
      category: formData.category,
      payment_start_date: formData.payment_pattern && formData.payment_pattern !== 'none' && formData.payment_start_date ? formData.payment_start_date : '',
      payment_pattern: formData.payment_pattern && formData.payment_pattern !== 'none' ? formData.payment_pattern : 'contract_based',
      payment_day: formData.payment_pattern === 'fixed_day' && formData.payment_day ? parseInt(formData.payment_day) : undefined,
      has_trial: formData.has_trial,
      trial_period_days: formData.has_trial && formData.trial_period_days ? parseInt(formData.trial_period_days) : undefined,
      trial_start_date: formData.has_trial ? (subscription.trial_start_date || new Date().toISOString().split('T')[0]) : undefined
    };

    onUpdate(updatedSubscription);

    setErrors({});
    onClose();
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  if (!subscription) {
    return null;
  }

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title="サブスクリプション編集"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <SubscriptionFormFields
          formData={formData}
          onChange={setFormData}
          errors={errors}
        />

        <div className="flex gap-2 pt-4">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            更新
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            キャンセル
          </button>
        </div>
      </form>
    </BaseModal>
  );
};