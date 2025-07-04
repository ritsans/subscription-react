import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4 text-center max-w-4xl">
        <p className="text-gray-300">
          © 2024 サブスクリプション管理アプリ
        </p>
        <p className="text-gray-400 text-sm mt-2">
          支出を把握して、賢い家計管理を
        </p>
      </div>
    </footer>
  );
};

export default Footer;