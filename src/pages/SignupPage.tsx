import React from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { SignupForm } from '../components/SignupForm';

/**
 * 新規登録ページ
 * ユーザーが新規アカウントを作成するためのページ
 * すでに認証済みの場合はダッシュボードにリダイレクト
 */
export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
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

  // すでに認証済みの場合はダッシュボードにリダイレクト
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSignupSuccess = () => {
    // 新規登録成功時はダッシュボードにリダイレクト
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* 戻るボタン */}
        <Link
          to="/"
          className="mb-4 text-blue-600 hover:text-blue-800 flex items-center"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          戻る
        </Link>
        
        <SignupForm onSignupSuccess={handleSignupSuccess} />
        
        {/* ログインへのリンク */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            すでにアカウントをお持ちの方は{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
              ログイン
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};