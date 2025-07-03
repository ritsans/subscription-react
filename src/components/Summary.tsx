import type { Subscription } from '../types';

interface SummaryProps {
  subscriptions: Subscription[];
}

export default function Summary({ subscriptions }: SummaryProps) {
  // 通貨別にグループ化
  const groupedByCurrency = subscriptions.reduce((groups, subscription) => {
    const currency = subscription.currency;
    if (!groups[currency]) {
      groups[currency] = [];
    }
    groups[currency].push(subscription);
    return groups;
  }, {} as Record<string, Subscription[]>);

  // 通貨シンボルの取得
  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case 'JPY': return '¥';
      case 'USD': return '$';
      case 'EUR': return '€';
      default: return currency;
    }
  };

  // 通貨名の取得
  const getCurrencyName = (currency: string) => {
    switch (currency) {
      case 'JPY': return '日本円';
      case 'USD': return '米ドル';
      case 'EUR': return 'ユーロ';
      default: return currency;
    }
  };

  // 各通貨の合計を計算
  const calculateTotals = (subscriptions: Subscription[]) => {
    const monthlyTotal = subscriptions.reduce((total, subscription) => {
      const monthlyPrice = subscription.cycle === 'yearly' 
        ? subscription.price / 12 
        : subscription.price;
      return total + monthlyPrice;
    }, 0);
    return { monthlyTotal, yearlyTotal: monthlyTotal * 12 };
  };

  return (
    <div className="bg-blue-50 p-6 rounded-lg mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">支出サマリー</h2>
      
      {Object.entries(groupedByCurrency).map(([currency, subs]) => {
        const { monthlyTotal, yearlyTotal } = calculateTotals(subs);
        const symbol = getCurrencySymbol(currency);
        const name = getCurrencyName(currency);
        
        return (
          <div key={currency} className="mb-4 last:mb-0">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">{name}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">月額合計</p>
                <p className="text-2xl font-bold text-blue-600">
                  {symbol}{Math.round(monthlyTotal).toLocaleString()}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">年額合計</p>
                <p className="text-2xl font-bold text-blue-600">
                  {symbol}{Math.round(yearlyTotal).toLocaleString()}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {name}のサブスクリプション数: {subs.length}個
            </p>
          </div>
        );
      })}
      
      {subscriptions.length === 0 && (
        <p className="text-gray-500 text-center py-8">
          まだサブスクリプションが登録されていません
        </p>
      )}
    </div>
  );
}