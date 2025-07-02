import type { Subscription } from '../types';
import SubscriptionItem from './SubscriptionItem';

interface SubscriptionListProps {
  subscriptions: Subscription[];
  onEdit: (subscription: Subscription) => void;
  onDelete: (id: string) => void;
}

export default function SubscriptionList({ 
  subscriptions, 
  onEdit, 
  onDelete 
}: SubscriptionListProps) {
  if (subscriptions.length === 0) {
    return (
      <div className="bg-gray-50 p-8 rounded-lg text-center">
        <p className="text-gray-500">
          まだサブスクリプションが登録されていません。
        </p>
        <p className="text-sm text-gray-400 mt-1">
          上のフォームから新しいサブスクリプションを追加してください。
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
    </div>
  );
}