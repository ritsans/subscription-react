import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface SignupFormProps {
  onSignupSuccess?: () => void;
}

interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

/**
 * サインアップフォームコンポーネント
 * 新規ユーザー登録機能を提供
 */
export const SignupForm: React.FC<SignupFormProps> = ({ onSignupSuccess }) => {
  const { signUp, loading } = useAuth();
  const [formData, setFormData] = useState<SignupFormData>({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
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

    if (formData.password.length < 6) {
      setError('パスワードは6文字以上で入力してください');
      setIsSubmitting(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('パスワードが一致しません');
      setIsSubmitting(false);
      return;
    }

    try {
      await signUp(formData.email, formData.password);
      onSignupSuccess?.();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '新規登録に失敗しました';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormDisabled = loading || isSubmitting;

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">新規登録</h2>
        <p className="text-gray-600 text-sm">
          サブスクリプション管理のアカウントを作成してください
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
            placeholder="6文字以上のパスワード"
            required
          />
        </div>

        {/* パスワード確認 */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            パスワード確認
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            disabled={isFormDisabled}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="パスワードを再入力"
            required
          />
        </div>

        {/* エラーメッセージ */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        {/* 新規登録ボタン */}
        <button
          type="submit"
          disabled={isFormDisabled}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-3 px-4 rounded-md transition duration-200 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              登録中...
            </>
          ) : (
            '新規登録'
          )}
        </button>
      </form>

      {/* 注意事項 */}
      <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-md">
        <p className="text-blue-800 text-xs">
          <strong>注意：</strong> 登録後、メールアドレス確認が必要になる場合があります
        </p>
      </div>
    </div>
  );
};