// 次回支払い日計算と残り日数計算のユーティリティ

export type PaymentPattern = 'fixed_day' | 'contract_based' | 'none';
export type SubscriptionCycle = 'monthly' | 'yearly';

export interface PaymentInfo {
  paymentStartDate: Date;
  paymentPattern: PaymentPattern;
  paymentDay?: number; // 毎月固定日パターンの場合のみ
  cycle: SubscriptionCycle;
  hasTrial?: boolean; // 無料トライアル期間の有無
  trialPeriodDays?: number; // トライアル期間の日数
  trialStartDate?: Date; // トライアル開始日
}

/**
 * 次回支払い日を計算する
 */
export const calculateNextPaymentDate = (paymentInfo: PaymentInfo): Date => {
  const today = new Date();
  const { paymentStartDate, paymentPattern, paymentDay, cycle, hasTrial, trialPeriodDays, trialStartDate } = paymentInfo;

  // トライアル期間がある場合の処理
  if (hasTrial && trialPeriodDays && trialStartDate) {
    const trialEndDate = new Date(trialStartDate);
    trialEndDate.setDate(trialEndDate.getDate() + trialPeriodDays);
    
    // トライアル期間中の場合は、トライアル終了日を返す
    if (today < trialEndDate) {
      return trialEndDate;
    }
    
    // トライアル終了後の初回課金日を計算
    return calculatePostTrialFirstPayment(trialEndDate, paymentStartDate, paymentPattern, paymentDay, cycle);
  }

  // 通常の支払い日計算
  if (paymentPattern === 'fixed_day' && paymentDay) {
    return calculateFixedDayNextPayment(today, paymentDay, cycle);
  } else {
    return calculateContractBasedNextPayment(today, paymentStartDate, cycle);
  }
};

/**
 * 毎月固定日パターンの次回支払い日計算
 */
const calculateFixedDayNextPayment = (
  today: Date,
  paymentDay: number,
  cycle: SubscriptionCycle
): Date => {
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  if (cycle === 'monthly') {
    // 今月の支払い日を確認
    const thisMonthPaymentDate = new Date(currentYear, currentMonth, paymentDay);
    
    if (thisMonthPaymentDate > today) {
      // 今月の支払い日がまだ来ていない
      return thisMonthPaymentDate;
    } else {
      // 来月の支払い日
      return new Date(currentYear, currentMonth + 1, paymentDay);
    }
  } else {
    // yearly の場合は年単位で計算
    const thisYearPaymentDate = new Date(currentYear, currentMonth, paymentDay);
    
    if (thisYearPaymentDate > today) {
      return thisYearPaymentDate;
    } else {
      return new Date(currentYear + 1, currentMonth, paymentDay);
    }
  }
};

/**
 * 契約日ベースパターンの次回支払い日計算
 */
const calculateContractBasedNextPayment = (
  today: Date,
  paymentStartDate: Date,
  cycle: SubscriptionCycle
): Date => {
  const startDay = paymentStartDate.getDate();
  const startMonth = paymentStartDate.getMonth();
  
  if (cycle === 'monthly') {
    // 毎月同じ日付で支払い
    let nextPaymentDate = new Date(today.getFullYear(), today.getMonth(), startDay);
    
    // 今月の支払い日がすでに過ぎている場合は来月
    if (nextPaymentDate <= today) {
      nextPaymentDate = new Date(today.getFullYear(), today.getMonth() + 1, startDay);
    }
    
    // 月末日の調整（例: 1/31契約で2月は2/28になる）
    return adjustForMonthEnd(nextPaymentDate);
  } else {
    // 年単位での支払い
    let nextPaymentDate = new Date(today.getFullYear(), startMonth, startDay);
    
    // 今年の支払い日がすでに過ぎている場合は来年
    if (nextPaymentDate <= today) {
      nextPaymentDate = new Date(today.getFullYear() + 1, startMonth, startDay);
    }
    
    return adjustForMonthEnd(nextPaymentDate);
  }
};

/**
 * 月末日の調整を行う（2月31日→2月28日など）
 */
const adjustForMonthEnd = (date: Date): Date => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  
  // その月の最終日を取得
  const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
  
  if (day > lastDayOfMonth) {
    return new Date(year, month, lastDayOfMonth);
  }
  
  return date;
};

/**
 * 残り日数を計算する
 */
export const calculateDaysUntilPayment = (nextPaymentDate: Date): number => {
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const paymentDateStart = new Date(
    nextPaymentDate.getFullYear(),
    nextPaymentDate.getMonth(),
    nextPaymentDate.getDate()
  );
  
  const diffTime = paymentDateStart.getTime() - todayStart.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

/**
 * 残り日数に基づいて色を決定する
 */
export const getDaysColor = (days: number): string => {
  if (days <= 3) {
    return 'text-red-500'; // 3日以内: 赤
  } else if (days <= 7) {
    return 'text-orange-500'; // 7日以内: 橙
  } else {
    return 'text-green-500'; // それ以外: 緑
  }
};

/**
 * トライアル終了後の初回課金日を計算する
 */
const calculatePostTrialFirstPayment = (
  trialEndDate: Date,
  paymentStartDate: Date,
  paymentPattern: PaymentPattern,
  paymentDay?: number,
  cycle: SubscriptionCycle = 'monthly'
): Date => {
  if (paymentPattern === 'fixed_day' && paymentDay) {
    // 毎月固定日パターンの場合、トライアル終了日以降の最初の固定日
    return calculateFixedDayNextPayment(trialEndDate, paymentDay, cycle);
  } else {
    // 契約日ベースパターンの場合、トライアル終了日以降の最初の契約日
    return calculateContractBasedNextPayment(trialEndDate, paymentStartDate, cycle);
  }
};

/**
 * トライアル期間中かどうかを判定する
 */
export const isInTrialPeriod = (
  hasTrial: boolean,
  trialPeriodDays?: number,
  trialStartDate?: Date
): boolean => {
  if (!hasTrial || !trialPeriodDays || !trialStartDate) {
    return false;
  }
  
  const today = new Date();
  const trialEndDate = new Date(trialStartDate);
  trialEndDate.setDate(trialEndDate.getDate() + trialPeriodDays);
  
  return today < trialEndDate;
};

/**
 * トライアル期間の残り日数を計算する
 */
export const calculateTrialDaysRemaining = (
  trialPeriodDays: number,
  trialStartDate: Date
): number => {
  const trialEndDate = new Date(trialStartDate);
  trialEndDate.setDate(trialEndDate.getDate() + trialPeriodDays);
  
  return calculateDaysUntilPayment(trialEndDate);
};

/**
 * 残り日数の表示テキストを生成する
 */
export const formatDaysText = (days: number): string => {
  if (days === 0) {
    return '今日';
  } else if (days === 1) {
    return '明日';
  } else {
    return `${days}日後`;
  }
};

