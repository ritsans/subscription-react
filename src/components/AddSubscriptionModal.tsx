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
    category: CATEGORIES.UNCATEGORIZED
  });

  const [errors, setErrors] = useState<{
    name?: string;
    price?: string;
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const price = parseFloat(formData.price);
    onAdd({
      name: formData.name.trim(),
      price,
      cycle: formData.cycle,
      currency: formData.currency,
      category: formData.category
    });

    // フォームをリセット
    setFormData({ name: '', price: '', cycle: 'monthly', currency: 'JPY', category: CATEGORIES.UNCATEGORIZED });
    setErrors({});
    onClose();
  };

  const handleClose = () => {
    setFormData({ name: '', price: '', cycle: 'monthly', currency: 'JPY', category: CATEGORIES.UNCATEGORIZED });
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