import { useState } from 'react';
import type { Subscription } from '../types';
import { useExchangeRate } from '../hooks/useExchangeRate';

interface SummaryProps {
  subscriptions: Subscription[];
}

export default function Summary({ subscriptions }: SummaryProps) {
  // 詳細表示の状態管理
  const [showDetails, setShowDetails] = useState(false);

  // 詳細表示の切り替え
  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

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

  // 金額表示フォーマット関数（0円の場合は--を表示）
  const formatCurrencyAmount = (amount: number, symbol: string): string => {
    return amount === 0 ? '--' : `${symbol}${Math.round(amount).toLocaleString()}`;
  };

  // 金額表示スタイル取得関数（0円の場合はグレー・細字）
  const getCurrencyAmountStyle = (amount: number): string => {
    return amount === 0 
      ? 'text-xl font-normal text-gray-400'
      : 'text-xl font-bold text-blue-600';
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

  // サマリーの通貨別表示の表示順序を固定する
  const currencyOrder = ['JPY', 'USD', 'EUR'] as const;

  return (
    <div className="bg-blue-50 p-6 rounded-lg mb-6">
      {/* ヘッダー部分 */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">支出サマリー</h2>
        {subscriptions.length > 0 && (
          <button
            onClick={toggleDetails}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleDetails()}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors duration-200 bg-white px-3 py-1 rounded-md border border-blue-200 hover:border-blue-300"
            aria-expanded={showDetails}
            aria-label={showDetails ? '詳細を閉じる' : '詳細を表示'}
          >
            <span className="text-sm font-medium">詳細</span>
            <span className={`transform transition-transform duration-300 ${showDetails ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>
        )}
      </div>

      {subscriptions.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          まだサブスクリプションが登録されていません
        </p>
      ) : (
        <>
          {/* メイン表示：合計のみ */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">月額合計</p>
              <p className="text-3xl font-bold text-blue-600">
                ¥{monthlyTotalJPY.toLocaleString()}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">年額合計</p>
              <p className="text-3xl font-bold text-blue-600">
                ¥{yearlyTotalJPY.toLocaleString()}
              </p>
            </div>
          </div>

          {/* 注記文 */}
          <div className="text-center mb-4">
            {Object.keys(groupedByCurrency).length > 1 ? (
              <p className="text-xs text-gray-500">
                ※複数通貨を日本円換算で表示
              </p>
            ) : (
              <p className="text-xs text-gray-500">
                ※日本円での合計金額
              </p>
            )}
            {hasConversionError && (
              <p className="text-xs text-orange-600 mt-1">
                ※一部の為替レートが取得できませんでした
              </p>
            )}
          </div>

          {/* 詳細セクション（条件付き表示） */}
          <div 
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              showDetails ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="border-t-2 border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">通貨別詳細</h3>
              
              {currencyOrder.filter(currency => {
                // 該当通貨のサブスクリプションが存在する場合は表示（価格が0円でも表示）
                const subs = groupedByCurrency[currency];
                const hasSubscriptions = subs && subs.length > 0;
                
                return hasSubscriptions;
              }).map(currency => {
                const subs = groupedByCurrency[currency];
                const { monthlyTotal, yearlyTotal } = calculateTotals(subs);
                const symbol = getCurrencySymbol(currency);
                const name = getCurrencyName(currency);
                
                return (
                  <div key={currency} className="mb-6 last:mb-0">
                    <h4 className="text-md font-semibold text-gray-700 mb-3">{name}</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center bg-white p-3 rounded-lg">
                        <p className="text-sm text-gray-600">月額</p>
                        <p className={getCurrencyAmountStyle(monthlyTotal)}>
                          {formatCurrencyAmount(monthlyTotal, symbol)}
                        </p>
                        {monthlyTotal > 0 && getJPYConversion(monthlyTotal, currency) && (
                          <p className="text-sm text-gray-500 mt-1">
                            (¥{getJPYConversion(monthlyTotal, currency)?.toLocaleString()})
                          </p>
                        )}
                      </div>
                      <div className="text-center bg-white p-3 rounded-lg">
                        <p className="text-sm text-gray-600">年額</p>
                        <p className={getCurrencyAmountStyle(yearlyTotal)}>
                          {formatCurrencyAmount(yearlyTotal, symbol)}
                        </p>
                        {yearlyTotal > 0 && getJPYConversion(yearlyTotal, currency) && (
                          <p className="text-sm text-gray-500 mt-1">
                            (¥{getJPYConversion(yearlyTotal, currency)?.toLocaleString()})
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              
              <div className="text-center mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  ※為替レートは常に変動するため、換算結果はあくまで参考としてお考え下さい。（小数点以下は切り捨て）
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}