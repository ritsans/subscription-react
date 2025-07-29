import type { Subscription } from '../types';
import { CATEGORY_CONFIG } from '../types';
import { useExchangeRate } from '../hooks/useExchangeRate';
import type { Currency } from '../types/exchange';
import { calculateNextPaymentDate, calculateDaysUntilPayment, getDaysColor, formatDaysText } from '../utils/dateCalculations';
import {
  LuMusic,
  LuMonitor,
  LuGamepad2,
  LuPlay,
  LuNewspaper,
  LuZap,
  LuCloud,
  LuPackage,
  LuCircle
} from 'react-icons/lu';

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

  // カテゴリに応じたアイコンを取得
  const getCategoryIcon = (category: string) => {
    const config = CATEGORY_CONFIG[category as keyof typeof CATEGORY_CONFIG];
    if (!config) return <LuCircle className="w-4 h-4" />;
    
    const iconName = config.icon;
    switch (iconName) {
      case 'LuMusic': return <LuMusic className="w-4 h-4" />;
      case 'LuMonitor': return <LuMonitor className="w-4 h-4" />;
      case 'LuGamepad2': return <LuGamepad2 className="w-4 h-4" />;
      case 'LuPlay': return <LuPlay className="w-4 h-4" />;
      case 'LuNewspaper': return <LuNewspaper className="w-4 h-4" />;
      case 'LuZap': return <LuZap className="w-4 h-4" />;
      case 'LuCloud': return <LuCloud className="w-4 h-4" />;
      case 'LuPackage': return <LuPackage className="w-4 h-4" />;
      case 'LuCircle': return <LuCircle className="w-4 h-4" />;
      default: return <LuCircle className="w-4 h-4" />;
    }
  };

  // カテゴリの設定を取得
  const categoryConfig = CATEGORY_CONFIG[subscription.category as keyof typeof CATEGORY_CONFIG] || CATEGORY_CONFIG['カテゴリなし'];

  return (
    <div className={`bg-white p-4 rounded-lg shadow-xs border-r border-t border-b border-gray-200 ${categoryConfig.borderColor} border-l-4 hover:shadow-md transition-shadow`}>
      <div className="flex items-center gap-3">
        {/* カテゴリアイコン */}
        <div className="flex-shrink-0">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${categoryConfig.badgeColor}`}>
            {getCategoryIcon(subscription.category)}
          </div>
        </div>
        
        {/* サブスクリプション名 */}
        <div className="w-48 min-w-0">
          <h3 className="font-semibold text-gray-800 truncate">{subscription.name}</h3>
          {subscription.category && (
            <span className="text-xs text-gray-500 block mt-1">
              {subscription.category}
            </span>
          )}
        </div>
        
        {/* 価格 */}
        <div className="w-48 text-right">
          <div className="text-lg font-bold text-green-600">
            {formatPrice(subscription.price, subscription.cycle, subscription.currency)}
          </div>
          {shouldShowJPY && rate > 0 && (
            <div className="text-sm text-blue-500 mt-1">
              (¥{Math.floor(subscription.price * rate).toLocaleString()})
            </div>
          )}
        </div>
        
        {/* 次回支払い日 */}
        <div className="w-48 text-center">
          {paymentInfo ? (
            <span className={`text-sm font-semibold ${paymentInfo.color}`}>
              {paymentInfo.text}
            </span>
          ) : (
            <span className="text-sm text-gray-400">-</span>
          )}
        </div>
        
        {/* 編集・削除ボタン */}
        <div className="flex gap-2 flex-shrink-0 ml-auto">
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