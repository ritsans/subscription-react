import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * 認証が必要なルートを保護するコンポーネント
 * 未認証の場合はトップページにリダイレクト
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  // 認証状態の確認中はローディング表示
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  // 未認証の場合はトップページにリダイレクト
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // 認証済みの場合は子コンポーネントを表示
  return <>{children}</>;
};