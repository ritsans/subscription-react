import { useEffect, useRef } from 'react';

interface OdometerProps {
  value: number;
  className?: string;
}

// odometerライブラリの基本的な型定義
interface OdometerInstance {
  update: (value: number) => void;
}

declare global {
  interface Window {
    Odometer: {
      new (options: {
        el: HTMLElement;
        value: number;
        format: string;
        theme: string;
        duration: number;
      }): OdometerInstance;
    };
  }
}

// eslint-disable-next-line react/prop-types
const Odometer: React.FC<OdometerProps> = ({ value, className = '' }) => {
  const odometerRef = useRef<HTMLDivElement>(null);
  const odometerInstanceRef = useRef<OdometerInstance | null>(null);

  useEffect(() => {
    // tm-odometerライブラリを動的にインポート
    const loadOdometer = async () => {
      if (typeof window !== 'undefined' && !window.Odometer) {
        try {
          // tm-odometerライブラリをインポート
          const odometerModule = await import('tm-odometer');
          window.Odometer = (odometerModule as { default: typeof window.Odometer }).default;
        } catch (error) {
          console.error('Odometerライブラリの読み込みに失敗しました:', error);
          return;
        }
      }

      if (odometerRef.current && window.Odometer && !odometerInstanceRef.current) {
        // Odometerインスタンスを作成
        odometerInstanceRef.current = new window.Odometer({
          el: odometerRef.current,
          value: 0, // 初期値
          format: '(,ddd)', // 数値フォーマット（3桁区切り）
          theme: 'default', // テーマ
          duration: 1000, // アニメーション時間（ミリ秒）
        });
        
        // 初回は即座に値を設定（アニメーション無し）
        if (odometerInstanceRef.current) {
          odometerInstanceRef.current.update(value);
        }
      }
    };

    loadOdometer();

    // クリーンアップ関数
    return () => {
      if (odometerInstanceRef.current) {
        odometerInstanceRef.current = null;
      }
    };
  }, [value]);

  // 値が変更された時にアニメーションを実行
  useEffect(() => {
    if (odometerInstanceRef.current && typeof value === 'number') {
      odometerInstanceRef.current.update(value);
    }
  }, [value]);

  return (
    <div
      ref={odometerRef}
      className={`odometer ${className}`}
    />
  );
};

export default Odometer;