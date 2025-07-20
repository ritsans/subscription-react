import React from 'react';
import { CATEGORIES } from '../types';

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onCategoryChange,
}) => {
  // 「すべて」オプションを含む選択肢を作成
  const allCategories = ['すべて', ...Object.values(CATEGORIES)];

  return (
    <div className="mb-6">
      <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-2">
        カテゴリーで絞り込み
      </label>
      <select
        id="category-filter"
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
      >
        {allCategories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategoryFilter;