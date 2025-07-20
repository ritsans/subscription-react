import React from 'react';
import type { Subscription } from '../types';
import Summary from './Summary';
import SubscriptionList from './SubscriptionList';
import CategoryFilter from './CategoryFilter';

interface MainProps {
  subscriptions: Subscription[];
  filteredSubscriptions: Subscription[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onEdit: (subscription: Subscription) => void;
  onDelete: (subscription: Subscription) => void;
  onAddClick: () => void;
}

const Main: React.FC<MainProps> = ({
  subscriptions,
  filteredSubscriptions,
  selectedCategory,
  onCategoryChange,
  onEdit,
  onDelete,
  onAddClick,
}) => {
  return (
    <main className="flex-1 bg-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Summary subscriptions={subscriptions} />

        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={onCategoryChange}
        />

        <div className="mb-6">
          <button
            onClick={onAddClick}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            + サブスクリプションを追加
          </button>
        </div>

        <SubscriptionList
          subscriptions={filteredSubscriptions}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>
    </main>
  );
};

export default Main;