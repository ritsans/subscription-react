import React from 'react';

/**
 * ダミートップページコンポーネント
 * 未認証ユーザー向けのウェルカムページ
 */
export const WelcomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* ヘッダーセクション */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            サブスクリプション管理
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            月額・年額サブスクリプションを一元管理して、支出を見える化しましょう
          </p>
        </div>

        {/* 機能紹介セクション */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">多通貨対応</h3>
            <p className="text-gray-600 text-sm">
              JPY、USD、EURに対応。リアルタイム為替レートで正確な円換算を表示
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0a2 2 0 100 4 2 2 0 000-4zm0 0v8a2 2 0 01-2-2V7a2 2 0 012-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">カテゴリー管理</h3>
            <p className="text-gray-600 text-sm">
              音楽、ソフトウェア、エンターテイメントなど、カテゴリー別に整理・管理
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-4a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">支出分析</h3>
            <p className="text-gray-600 text-sm">
              月額・年額の合計金額を自動計算。支出パターンを把握してコスト最適化
            </p>
          </div>
        </div>

        {/* ログイン促進メッセージ */}
        <div className="text-center bg-white rounded-lg p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            今すぐ始めましょう
          </h2>
          <p className="text-gray-600 mb-6">
            ログインしてサブスクリプション管理を開始してください
          </p>
          <div className="inline-flex items-center text-blue-600">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m0 0a2 2 0 012 2 2 2 0 00-2-2m-2-2V9a2 2 0 00-2-2m2 2v10a2 2 0 01-2 2 2 2 0 002-2V9z" />
            </svg>
            <span className="font-medium">安全なログイン認証を使用</span>
          </div>
        </div>
      </div>
    </div>
  );
};