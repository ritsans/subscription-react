import React from 'react';
import type { SubscriptionFormData } from '../types';

interface SubscriptionFormFieldsProps {
  formData: SubscriptionFormData;
  onChange: (data: SubscriptionFormData) => void;
  errors?: {
    name?: string;
    price?: string;
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
          価格（円）
        </label>
        <input
          type="number"
          id="price"
          value={formData.price}
          onChange={(e) => handleChange('price', e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
            errors?.price 
              ? 'border-red-300 focus:ring-red-500' 
              : 'border-gray-300 focus:ring-blue-500'
          }`}
          placeholder="1000"
          min="0"
          step="0.01"
        />
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
    </div>
  );
};