import type { Subscription } from '../types';
import { useExchangeRate } from '../hooks/useExchangeRate';

interface SummaryProps {
  subscriptions: Subscription[];
}

export default function Summary({ subscriptions }: SummaryProps) {
  // 為替レートを取得
  const { rate: usdRate } = useExchangeRate('USD');
  const { rate: eurRate } = useExchangeRate('EUR');
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
    // 月額料金サマリー: 月額サブスクリプションのみを合計
    const monthlyTotal = subscriptions.reduce((total, subscription) => {
      return subscription.cycle === 'monthly' 
        ? total + subscription.price 
        : total;
    }, 0);
    
    // 年額合計サマリー: 年額サブスクリプションのみを合計
    const yearlyTotal = subscriptions.reduce((total, subscription) => {
      return subscription.cycle === 'yearly' 
        ? total + subscription.price 
        : total;
    }, 0);
    
    return { monthlyTotal, yearlyTotal };
  };

  // 日本円換算の金額を取得
  const getJPYConversion = (amount: number, currency: string) => {
    if (currency === 'JPY') return null;
    
    const rate = currency === 'USD' ? usdRate : currency === 'EUR' ? eurRate : 0;
    if (rate === 0) return null;
    
    const converted = Math.floor(amount * rate);
    return converted;
  };

  // 金額を日本円に換算（JPYの場合はそのまま返す）
  const convertToJPY = (amount: number, currency: string) => {
    if (currency === 'JPY') return amount;
    
    const rate = currency === 'USD' ? usdRate : currency === 'EUR' ? eurRate : 0;
    if (rate === 0) return 0; // 換算できない場合は0を返す
    
    return Math.floor(amount * rate);
  };

  // 全体合計を計算
  const calculateGrandTotal = () => {
    let monthlyTotalJPY = 0;
    let yearlyTotalJPY = 0;
    let hasConversionError = false;
    
    // 各通貨の合計を日本円に換算して加算
    Object.entries(groupedByCurrency).forEach(([currency, subs]) => {
      const { monthlyTotal, yearlyTotal } = calculateTotals(subs);
      
      const monthlyJPY = convertToJPY(monthlyTotal, currency);
      const yearlyJPY = convertToJPY(yearlyTotal, currency);
      
      // 換算できない場合（為替レートが0）はエラーフラグを立てる
      const rate = currency === 'USD' ? usdRate : currency === 'EUR' ? eurRate : 0;
      if (currency !== 'JPY' && rate === 0) {
        hasConversionError = true;
      }
      
      monthlyTotalJPY += monthlyJPY;
      yearlyTotalJPY += yearlyJPY;
    });
    
    return { monthlyTotalJPY, yearlyTotalJPY, hasConversionError };
  };

  const { monthlyTotalJPY, yearlyTotalJPY, hasConversionError } = calculateGrandTotal();

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
                {getJPYConversion(monthlyTotal, currency) && (
                  <p className="text-sm text-gray-500 mt-1">
                    (およそ ¥{getJPYConversion(monthlyTotal, currency)?.toLocaleString()})
                  </p>
                )}
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">年額合計</p>
                <p className="text-2xl font-bold text-blue-600">
                  {symbol}{Math.round(yearlyTotal).toLocaleString()}
                </p>
                {getJPYConversion(yearlyTotal, currency) && (
                  <p className="text-sm text-gray-500 mt-1">
                    (およそ ¥{getJPYConversion(yearlyTotal, currency)?.toLocaleString()})
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}
      
      {/* 全体合計セクション */}
      {subscriptions.length > 0 && Object.keys(groupedByCurrency).length > 1 && (
        <div className="border-t-2 border-gray-200 pt-4 mt-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">全体合計（日本円換算）</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">月額合計</p>
              <p className="text-3xl font-bold text-green-600">
                ¥{monthlyTotalJPY.toLocaleString()}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">年額合計</p>
              <p className="text-3xl font-bold text-green-600">
                ¥{yearlyTotalJPY.toLocaleString()}
              </p>
            </div>
          </div>
          {hasConversionError && (
            <p className="text-sm text-orange-600 mt-2 text-center">
              ※為替レートが取得できませんでした
            </p>
          )}
          <p className="text-xs text-gray-500 mt-2 text-center">
            ※為替レートは常に変動するため、換算結果はあくまで参考としてお考え下さい。（小数点以下は切り捨て）
          </p>
        </div>
      )}
      
      {subscriptions.length === 0 && (
        <p className="text-gray-500 text-center py-8">
          まだサブスクリプションが登録されていません
        </p>
      )}
    </div>
  );
}