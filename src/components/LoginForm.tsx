import React, { useState, useEffect } from 'react';
import type { LoginFormData } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface LoginFormProps {
  onLoginSuccess?: () => void;
}

/**
 * ログインフォームコンポーネント
 * Email/パスワード認証とメールアドレス記憶機能を提供
 */
export const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const { signIn, getRememberedEmail, loading } = useAuth();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberEmail: false,
  });
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 初回ロード時に記憶されたメールアドレスを取得
  useEffect(() => {
    const rememberedEmail = getRememberedEmail();
    if (rememberedEmail) {
      setFormData(prev => ({
        ...prev,
        email: rememberedEmail,
        rememberEmail: true,
      }));
    }
  }, [getRememberedEmail]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    
    // エラーメッセージをクリア
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // バリデーション
    if (!formData.email.trim()) {
      setError('メールアドレスを入力してください');
      setIsSubmitting(false);
      return;
    }
    
    if (!formData.password.trim()) {
      setError('パスワードを入力してください');
      setIsSubmitting(false);
      return;
    }

    try {
      await signIn(formData);
      onLoginSuccess?.();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'ログインに失敗しました';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormDisabled = loading || isSubmitting;

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">ログイン</h2>
        <p className="text-gray-600 text-sm">
          サブスクリプション管理にログインしてください
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* メールアドレス */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            メールアドレス
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            disabled={isFormDisabled}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="example@email.com"
            required
          />
        </div>

        {/* パスワード */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            パスワード
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            disabled={isFormDisabled}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="パスワードを入力"
            required
          />
        </div>

        {/* メールアドレス記憶チェックボックス */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="rememberEmail"
            name="rememberEmail"
            checked={formData.rememberEmail}
            onChange={handleInputChange}
            disabled={isFormDisabled}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:cursor-not-allowed"
          />
          <label htmlFor="rememberEmail" className="ml-2 block text-sm text-gray-700">
            メールアドレスを記憶する
          </label>
        </div>

        {/* エラーメッセージ */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        {/* ログインボタン */}
        <button
          type="submit"
          disabled={isFormDisabled}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-3 px-4 rounded-md transition duration-200 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ログイン中...
            </>
          ) : (
            'ログイン'
          )}
        </button>
      </form>

      {/* テスト用の注意書き */}
      <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
        <p className="text-yellow-800 text-xs">
          <strong>テスト環境：</strong> まずは管理者がユーザーを1名作成してからテストしてください
        </p>
      </div>
    </div>
  );
};