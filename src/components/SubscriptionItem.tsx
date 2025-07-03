import type { Subscription } from '../types';

interface SubscriptionItemProps {
  subscription: Subscription;
  onEdit: (subscription: Subscription) => void;
  onDelete: (subscription: Subscription) => void;
}

export default function SubscriptionItem({
  subscription,
  onEdit,
  onDelete
}: SubscriptionItemProps) {
  const handleDelete = () => {
    onDelete(subscription);
  };

  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case 'JPY': return '¥';
      case 'USD': return '$';
      case 'EUR': return '€';
      default: return currency;
    }
  };

  const formatPrice = (price: number, cycle: 'monthly' | 'yearly', currency: string) => {
    const symbol = getCurrencySymbol(currency);
    return `${symbol}${price.toLocaleString()} / ${cycle === 'monthly' ? '月' : '年'}`;
  };

  const getMonthlyPrice = (price: number, cycle: 'monthly' | 'yearly') => {
    return cycle === 'yearly' ? price / 12 : price;
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-xs border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800">{subscription.name}</h3>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-lg font-bold text-green-600">
              {formatPrice(subscription.price, subscription.cycle, subscription.currency)}
            </span>
            {subscription.cycle === 'yearly' && (
              <span className="text-sm text-gray-500">
                (月額 {getCurrencySymbol(subscription.currency)}{Math.round(getMonthlyPrice(subscription.price, subscription.cycle)).toLocaleString()})
              </span>
            )}
          </div>
        </div>
        
        <div className="flex gap-2 ml-4">
          <button
            onClick={() => onEdit(subscription)}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
          >
            編集
          </button>
          <button
            onClick={handleDelete}
            className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
          >
            削除
          </button>
        </div>
      </div>
    </div>
  );
}