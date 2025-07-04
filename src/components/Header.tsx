import React from 'react';

interface HeaderProps {
  error: string | null;
  onCloseError: () => void;
}

const Header: React.FC<HeaderProps> = ({ error, onCloseError }) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
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