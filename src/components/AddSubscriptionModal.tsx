import React, { useState } from 'react';
import { BaseModal } from './BaseModal';
import { SubscriptionFormFields } from './SubscriptionFormFields';
import type { Subscription, SubscriptionFormData } from '../types';
import { CATEGORIES } from '../types';

interface AddSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (subscription: Omit<Subscription, 'id'>) => void;
}

export const AddSubscriptionModal: React.FC<AddSubscriptionModalProps> = ({
  isOpen,
  onClose,
  onAdd
}) => {
  const [formData, setFormData] = useState<SubscriptionFormData>({
    name: '',
    price: '',
    cycle: 'monthly',
    currency: 'JPY',
    category: CATEGORIES.UNCATEGORIZED,
    payment_start_date: '',
    payment_pattern: 'none'
  });

  const [errors, setErrors] = useState<{
    name?: string;
    price?: string;
    payment_start_date?: string;
    payment_day?: string;
  }>({});

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const price = parseFloat(formData.price);
    
    // 支払い情報の処理
    const subscriptionData: Omit<Subscription, 'id'> = {
      name: formData.name.trim(),
      price,
      cycle: formData.cycle,
      currency: formData.currency,
      category: formData.category,
      payment_start_date: formData.payment_pattern && formData.payment_pattern !== 'none' && formData.payment_start_date ? formData.payment_start_date : '',
      payment_pattern: formData.payment_pattern && formData.payment_pattern !== 'none' ? formData.payment_pattern : 'contract_based',
      payment_day: formData.payment_pattern === 'fixed_day' && formData.payment_day ? parseInt(formData.payment_day) : undefined
    };

    onAdd(subscriptionData);

    // フォームをリセット
    setFormData({ 
      name: '', 
      price: '', 
      cycle: 'monthly', 
      currency: 'JPY', 
      category: CATEGORIES.UNCATEGORIZED,
      payment_start_date: '',
      payment_pattern: 'none'
    });
    setErrors({});
    onClose();
  };

  const handleClose = () => {
    setFormData({ 
      name: '', 
      price: '', 
      cycle: 'monthly', 
      currency: 'JPY', 
      category: CATEGORIES.UNCATEGORIZED,
      payment_start_date: '',
      payment_pattern: 'none'
    });
    setErrors({});
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title="サブスクリプション追加"
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
            追加
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