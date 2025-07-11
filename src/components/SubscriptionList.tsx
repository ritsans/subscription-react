import type { Subscription } from '../types';
import SubscriptionItem from './SubscriptionItem';
import { clearAllCachedRates } from '../utils/exchangeRateCache';

interface SubscriptionListProps {
  subscriptions: Subscription[];
  onEdit: (subscription: Subscription) => void;
  onDelete: (subscription: Subscription) => void;
}

export default function SubscriptionList({ 
  subscriptions, 
  onEdit, 
  onDelete 
}: SubscriptionListProps) {
  // すべての為替レートを強制更新
  const handleRefreshRates = () => {
    clearAllCachedRates();
    // ページをリロードして最新のレートを取得
    window.location.reload();
  };
  
  // USD/EUR通貨のサブスクリプションがあるかチェック
  const hasExchangeRateSubscriptions = subscriptions.some(
    subscription => subscription.currency === 'USD' || subscription.currency === 'EUR'
  );
  if (subscriptions.length === 0) {
    return (
      <div className="bg-gray-50 p-8 rounded-lg text-center">
        <p className="text-gray-500">
          まだサブスクリプションが登録されていません。
        </p>
        <p className="text-sm text-gray-400 mt-1">
          上のボタンから新しいサブスクリプションを追加してください。
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-bold text-gray-800 mb-4">
        登録済みサブスクリプション
      </h2>
      
      {subscriptions.map((subscription) => (
        <SubscriptionItem
          key={subscription.id}
          subscription={subscription}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
      
      {/* 為替レート更新ボタン */}
      {hasExchangeRateSubscriptions && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={handleRefreshRates}
            className="w-full px-4 py-2 bg-gray-50 text-gray-700 rounded hover:bg-gray-100 transition-colors"
            title="すべての為替レートを最新に更新"
          >
            為替レートを更新
          </button>
        </div>
      )}
    </div>
  );
}