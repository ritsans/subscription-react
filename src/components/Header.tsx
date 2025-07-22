import React from 'react';
import type { User } from '../types';

interface HeaderProps {
  error: string | null;
  onCloseError: () => void;
  user?: User | null;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ error, onCloseError, user, onLogout }) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* ユーザー情報とログアウトボタン */}
        {user && (
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>{user.email}</span>
            </div>
            {onLogout && (
              <button
                onClick={onLogout}
                className="text-sm text-gray-600 hover:text-red-600 px-3 py-1 rounded transition duration-200 border border-gray-300 hover:border-red-300"
              >
                ログアウト
              </button>
            )}
          </div>
        )}

        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            サブスクリプション管理
          </h1>
          <p className="text-gray-600">
            毎月の支出を把握して、予算を見直しましょう
          </p>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <div className="flex justify-between items-center">
              <span>{error}</span>
              <button
                onClick={onCloseError}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;