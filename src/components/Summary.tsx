import type { Subscription } from '../types';

interface SummaryProps {
  subscriptions: Subscription[];
}

export default function Summary({ subscriptions }: SummaryProps) {
  const monthlyTotal = subscriptions.reduce((total, subscription) => {
    const monthlyPrice = subscription.cycle === 'yearly' 
      ? subscription.price / 12 
      : subscription.price;
    return total + monthlyPrice;
  }, 0);

  const yearlyTotal = monthlyTotal * 12;

  return (
    <div className="bg-blue-50 p-6 rounded-lg mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">支出サマリー</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <p className="text-sm text-gray-600">月額合計</p>
          <p className="text-2xl font-bold text-blue-600">
            ¥{Math.round(monthlyTotal).toLocaleString()}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">年額合計</p>
          <p className="text-2xl font-bold text-blue-600">
            ¥{Math.round(yearlyTotal).toLocaleString()}
          </p>
        </div>
      </div>
      <p className="text-sm text-gray-500 mt-4">
        登録サブスクリプション数: {subscriptions.length}個
      </p>
    </div>
  );
}