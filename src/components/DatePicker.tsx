import React, { useEffect, useRef, useCallback } from 'react';
import flatpickr from 'flatpickr';
import { Japanese } from 'flatpickr/dist/l10n/ja';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/material_blue.css';

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  className?: string;
  placeholder?: string;
  error?: boolean;
  id?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  className = '',
  placeholder = '日付を選択してください',
  error = false,
  id
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const flatpickrRef = useRef<flatpickr.Instance | null>(null);

  // onChangeコールバックをメモ化
  const handleChange = useCallback((_selectedDates: Date[], dateStr: string) => {
    onChange(dateStr);
  }, [onChange]);

  useEffect(() => {
    if (inputRef.current) {
      // flatpickrインスタンスを初期化
      flatpickrRef.current = flatpickr(inputRef.current, {
        locale: Japanese, // 日本語ロケール
        dateFormat: 'Y-m-d', // ISO形式（YYYY-MM-DD）
        allowInput: true, // 手動入力を許可
        clickOpens: true, // クリックでカレンダーを開く
        time_24hr: true, // 24時間形式（時間は使わないが設定）
        showMonths: 1, // 1ヶ月表示
        position: 'auto', // 自動配置
        onChange: handleChange,
        onClose: () => {
          // カレンダーが閉じられた時の処理
          if (inputRef.current) {
            inputRef.current.blur();
          }
        }
      });

      // 初期値を設定
      if (value) {
        flatpickrRef.current.setDate(value, false);
      }
    }

    // クリーンアップ
    return () => {
      if (flatpickrRef.current) {
        flatpickrRef.current.destroy();
      }
    };
  }, [handleChange, value]);

  // value propが変更された時の処理
  useEffect(() => {
    if (flatpickrRef.current && value !== flatpickrRef.current.input.value) {
      flatpickrRef.current.setDate(value || '', false);
    }
  }, [value]);

  const baseClasses = `
    w-full px-3 py-2 border rounded-md 
    focus:outline-none focus:ring-2 transition-colors
    bg-white
  `;

  const errorClasses = error 
    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400';

  const combinedClasses = `${baseClasses} ${errorClasses} ${className}`.trim();

  return (
    <input
      ref={inputRef}
      type="text"
      id={id}
      placeholder={placeholder}
      className={combinedClasses}
      readOnly={false} // 手動入力を許可
    />
  );
};