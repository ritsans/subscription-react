import { useState, useEffect } from 'react';
import type { Subscription, SubscriptionFormData } from '../types';

interface SubscriptionFormProps {
  onSubmit: (subscription: Omit<Subscription, 'id'>) => void;
  editingSubscription?: Subscription;
  onCancel?: () => void;
}

export default function SubscriptionForm({ 
  onSubmit, 
  editingSubscription, 
  onCancel 
}: SubscriptionFormProps) {
  const [formData, setFormData] = useState<SubscriptionFormData>({
    name: '',
    price: '',
    cycle: 'monthly'
  });

  useEffect(() => {
    if (editingSubscription) {
      setFormData({
        name: editingSubscription.name,
        price: editingSubscription.price.toString(),
        cycle: editingSubscription.cycle
      });
    }
  }, [editingSubscription]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.price.trim()) {
      alert('名前と価格を入力してください');
      return;
    }

    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      alert('正しい価格を入力してください');
      return;
    }

    onSubmit({
      name: formData.name.trim(),
      price,
      cycle: formData.cycle
    });

    if (!editingSubscription) {
      setFormData({ name: '', price: '', cycle: 'monthly' });
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    if (!editingSubscription) {
      setFormData({ name: '', price: '', cycle: 'monthly' });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-lg font-bold text-gray-800 mb-4">
        {editingSubscription ? 'サブスクリプション編集' : 'サブスクリプション追加'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            サービス名
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Netflix, Spotify など"
          />
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
            価格（円）
          </label>
          <input
            type="number"
            id="price"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="1000"
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <label htmlFor="cycle" className="block text-sm font-medium text-gray-700 mb-1">
            支払い周期
          </label>
          <select
            id="cycle"
            value={formData.cycle}
            onChange={(e) => setFormData({ ...formData, cycle: e.target.value as 'monthly' | 'yearly' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="monthly">月額</option>
            <option value="yearly">年額</option>
          </select>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {editingSubscription ? '更新' : '追加'}
          </button>
          
          {editingSubscription && (
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              キャンセル
            </button>
          )}
        </div>
      </form>
    </div>
  );
}