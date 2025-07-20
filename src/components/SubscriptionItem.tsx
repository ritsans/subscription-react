import type { Subscription } from '../types';
import { useExchangeRate } from '../hooks/useExchangeRate';
import type { Currency } from '../types/exchange';
import { calculateNextPaymentDate, calculateDaysUntilPayment, getDaysColor, formatDaysText } from '../utils/dateCalculations';

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
  // USD/EUR通貨の場合のみ為替レートを取得
  const shouldShowJPY = subscription.currency === 'USD' || subscription.currency === 'EUR';
  const { rate } = useExchangeRate(shouldShowJPY ? subscription.currency as Currency : 'USD');
  
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

  // 日本円換算の価格を計算
  const formatJPYPrice = (price: number, cycle: 'monthly' | 'yearly') => {
    const convertedPrice = Math.floor(price * rate);
    return `¥${convertedPrice.toLocaleString()} / ${cycle === 'monthly' ? '月' : '年'}`;
  };

  // 次回支払い日と残り日数を計算
  const getPaymentInfo = () => {
    // noneパターンの場合は表示しない
    if (!subscription.payment_pattern || subscription.payment_pattern === 'none') {
      return null;
    }

    // パターン別の必要な情報をチェック
    if (subscription.payment_pattern === 'contract_based' && !subscription.payment_start_date) {
      return null;
    }
    
    if (subscription.payment_pattern === 'fixed_day' && !subscription.payment_day) {
      return null;
    }

    try {
      const paymentInfo = {
        paymentStartDate: subscription.payment_pattern === 'contract_based' 
          ? new Date(subscription.payment_start_date)
          : new Date(), // fixed_dayの場合は今日の日付を使用（実際の計算では使われない）
        paymentPattern: subscription.payment_pattern,
        paymentDay: subscription.payment_day,
        cycle: subscription.cycle
      };

      const nextPaymentDate = calculateNextPaymentDate(paymentInfo);
      const daysUntil = calculateDaysUntilPayment(nextPaymentDate);
      
      return {
        daysUntil,
        color: getDaysColor(daysUntil),
        text: formatDaysText(daysUntil)
      };
    } catch (error) {
      // 日付計算でエラーが発生した場合は表示しない
      console.warn('支払い日計算でエラーが発生しました:', error);
      return null;
    }
  };

  const paymentInfo = getPaymentInfo();

  return (
    <div className="bg-white p-4 rounded-lg shadow-xs border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-800">{subscription.name}</h3>
            {subscription.category && (
              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                {subscription.category}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-lg font-bold text-green-600">
              {formatPrice(subscription.price, subscription.cycle, subscription.currency)}
            </span>
            {paymentInfo && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">次回支払い:</span>
                <span className={`text-sm font-semibold ${paymentInfo.color}`}>
                  {paymentInfo.text}
                </span>
              </div>
            )}
          </div>
          {shouldShowJPY && rate > 0 && (
            <div className="text-sm text-blue-500 mt-1">
              (およそ {formatJPYPrice(subscription.price, subscription.cycle)})
            </div>
          )}
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