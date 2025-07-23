import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { WelcomePage } from '../components/WelcomePage';

/**
 * トップページ（ランディングページ）
 * 未認証ユーザー向けのウェルカムページ
 * 認証済みの場合はダッシュボードにリダイレクト
 */
export const TopPage: React.FC = () => {
  const { user, loading } = useAuth();

  // 認証状態の確認中はローディング表示
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">認証状態を確認中...</p>
        </div>
      </div>
    );
  }

  // 認証済みの場合はダッシュボードにリダイレクト
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 relative">
      <WelcomePage />
      
      {/* ログイン・新規登録ボタン */}
      <div className="fixed top-4 right-4 flex space-x-4">
        <Link
          to="/login"
          className="bg-white hover:bg-gray-50 text-blue-600 px-6 py-2 rounded-lg font-medium transition duration-200 shadow-md border border-blue-200"
        >
          ログイン
        </Link>
        <Link
          to="/signup"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition duration-200 shadow-md"
        >
          新規登録
        </Link>
      </div>
    </div>
  );
};