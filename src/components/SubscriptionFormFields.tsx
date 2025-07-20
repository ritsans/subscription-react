import React from 'react';
import type { SubscriptionFormData } from '../types';
import { CATEGORIES } from '../types';
import { DatePicker } from './DatePicker';

interface SubscriptionFormFieldsProps {
  formData: SubscriptionFormData;
  onChange: (data: SubscriptionFormData) => void;
  errors?: {
    name?: string;
    price?: string;
    payment_start_date?: string;
    payment_day?: string;
  };
}

export const SubscriptionFormFields: React.FC<SubscriptionFormFieldsProps> = ({
  formData,
  onChange,
  errors
}) => {
  const handleChange = (field: keyof SubscriptionFormData, value: string) => {
    onChange({
      ...formData,
      [field]: value
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          サービス名
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
            errors?.name 
              ? 'border-red-300 focus:ring-red-500' 
              : 'border-gray-300 focus:ring-blue-500'
          }`}
          placeholder="Netflix, Spotify など"
        />
        {errors?.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
          価格
        </label>
        <div className="flex gap-2">
          <select
            id="currency"
            value={formData.currency}
            onChange={(e) => handleChange('currency', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="JPY">¥</option>
            <option value="USD">$</option>
            <option value="EUR">€</option>
          </select>
          <input
            type="number"
            id="price"
            value={formData.price}
            onChange={(e) => handleChange('price', e.target.value)}
            className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors?.price 
                ? 'border-red-300 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder="1000"
            min="0"
            step="0.01"
          />
        </div>
        {errors?.price && (
          <p className="mt-1 text-sm text-red-600">{errors.price}</p>
        )}
      </div>

      <div>
        <label htmlFor="cycle" className="block text-sm font-medium text-gray-700 mb-1">
          支払い周期
        </label>
        <select
          id="cycle"
          value={formData.cycle}
          onChange={(e) => handleChange('cycle', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="monthly">月額</option>
          <option value="yearly">年額</option>
        </select>
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
          カテゴリ
        </label>
        <select
          id="category"
          value={formData.category}
          onChange={(e) => handleChange('category', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {Object.values(CATEGORIES).map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* 支払い情報セクション */}
      <div className="border-t pt-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">支払い情報（オプション）</h3>
        <p className="text-xs text-gray-500 mb-4">
          次回支払い日の表示を希望する場合は、以下の情報を入力してください。
        </p>

        <div>
          <label htmlFor="payment_pattern" className="block text-sm font-medium text-gray-700 mb-1">
            支払いパターン
          </label>
          <select
            id="payment_pattern"
            value={formData.payment_pattern || 'none'}
            onChange={(e) => handleChange('payment_pattern', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="none">設定しない（残り日数表示なし）</option>
            <option value="contract_based">契約日ベース（Netflix、Spotifyなど）</option>
            <option value="fixed_day">毎月固定日（電気代、ガス代など）</option>
          </select>
        </div>

        {formData.payment_pattern === 'contract_based' && (
          <div className="mt-4">
            <label htmlFor="payment_start_date" className="block text-sm font-medium text-gray-700 mb-1">
              契約開始日
            </label>
            <DatePicker
              id="payment_start_date"
              value={formData.payment_start_date || ''}
              onChange={(date) => handleChange('payment_start_date', date)}
              error={!!errors?.payment_start_date}
              placeholder="契約開始日を選択してください"
            />
            {errors?.payment_start_date && (
              <p className="mt-1 text-sm text-red-600">{errors.payment_start_date}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              例: Netflix契約日、Spotify契約日など
            </p>
          </div>
        )}

        {formData.payment_pattern === 'fixed_day' && (
          <div className="mt-4">
            <label htmlFor="payment_day" className="block text-sm font-medium text-gray-700 mb-1">
              毎月の支払い日
            </label>
            <select
              id="payment_day"
              value={formData.payment_day || ''}
              onChange={(e) => handleChange('payment_day', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors?.payment_day 
                  ? 'border-red-300 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            >
              <option value="">選択してください</option>
              {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                <option key={day} value={day.toString()}>
                  {day}日
                </option>
              ))}
            </select>
            {errors?.payment_day && (
              <p className="mt-1 text-sm text-red-600">{errors.payment_day}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              例: 電気代は毎月15日、ガス代は毎月25日など
            </p>
          </div>
        )}
      </div>
    </div>
  );
};