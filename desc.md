# サブスクリプション管理アプリ - ファイル構成説明

## プロジェクト概要
React 19 + TypeScript + Tailwind CSS v4を使用したサブスクリプション管理アプリケーション。
個人の月額・年額のサブスクリプションサービスを管理し、支出を可視化するSPAです。

## 主要技術スタック
- **フレームワーク**: React 19 with TypeScript
- **ビルドツール**: Vite with @vitejs/plugin-react
- **スタイリング**: Tailwind CSS v4 with @tailwindcss/vite plugin
- **リンティング**: ESLint with TypeScript and React plugins
- **フォーマット**: Prettier with ESLint integration

## ファイル構成

### ルートディレクトリ
- **`package.json`** - プロジェクトの依存関係とスクリプト定義
- **`vite.config.ts`** - Vite設定ファイル（React + Tailwind CSS v4 plugin）
- **`tsconfig.json`** - TypeScript設定のルートファイル
- **`tsconfig.app.json`** - アプリケーション用TypeScript設定
- **`tsconfig.node.json`** - Node.js環境用TypeScript設定
- **`eslint.config.js`** - ESLint設定（フラット設定形式）
- **`CLAUDE.md`** - Claude Code向けプロジェクト指示ファイル
- **`.mcp.json`** - MCPサーバー連携設定（Context7）

### src/ ディレクトリ

#### メインファイル
- **`main.tsx`** - Reactアプリケーションのエントリーポイント
- **`App.tsx`** - メインアプリケーションコンポーネント
  - サブスクリプションの状態管理
  - 各種モーダルの表示制御
  - CRUD操作のハンドリング
- **`types.ts`** - TypeScript型定義
  - `Subscription` - サブスクリプションのデータ型
  - `SubscriptionFormData` - フォーム用データ型

#### components/ ディレクトリ

##### モーダル関連
- **`BaseModal.tsx`** - 共通モーダルベースコンポーネント
  - Escキーでの閉じる機能
  - オーバーレイクリックでの閉じる機能
  - アクセシビリティ対応（ARIA属性）

- **`AddSubscriptionModal.tsx`** - サブスクリプション追加モーダル
  - 新規サブスクリプション登録フォーム
  - バリデーション機能付き

- **`EditSubscriptionModal.tsx`** - サブスクリプション編集モーダル
  - 既存データの編集フォーム
  - バリデーション機能付き

- **`DeleteConfirmModal.tsx`** - 削除確認モーダル
  - 削除前の確認ダイアログ
  - 警告アイコン付きUI

##### フォーム関連
- **`SubscriptionFormFields.tsx`** - フォーム入力フィールド群
  - サービス名入力
  - 価格入力（数値検証付き）
  - 支払い周期選択（月額/年額）
  - エラー表示機能

##### リスト・表示関連
- **`SubscriptionList.tsx`** - サブスクリプション一覧表示
  - 空状態の表示
  - 各アイテムのレンダリング

- **`SubscriptionItem.tsx`** - 個別サブスクリプション表示
  - 価格表示（月額/年額対応）
  - 年額の場合は月額換算も表示
  - 編集・削除ボタン

- **`Summary.tsx`** - 支出サマリー表示
  - 月額合計の計算・表示
  - 年額合計の計算・表示
  - 登録数の表示

## 主な機能
1. **サブスクリプション管理**
   - 追加・編集・削除機能
   - 月額/年額での料金管理

2. **支出可視化**
   - 月額・年額の合計金額表示
   - 登録済みサービス数の表示

3. **モーダルベースUI**
   - アクセシビリティ対応
   - フォームバリデーション
   - 確認ダイアログ

4. **レスポンシブデザイン**
   - Tailwind CSSによるモバイル対応
   - 一貫したデザインシステム

## 開発コマンド
- `pnpm dev` - 開発サーバー起動
- `pnpm build` - プロダクションビルド
- `pnpm lint` - ESLint実行（自動修正）
- `pnpm format` - Prettier実行
- `pnpm preview` - ビルド結果のプレビュー
- `npx @tailwindcss/upgrade` - Tailwind CSS v4アップグレードツール