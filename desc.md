# サブスクリプション管理アプリ - ファイル構成説明

## プロジェクト概要
React 19 + TypeScript + Tailwind CSS v4を使用したサブスクリプション管理アプリケーション。
個人の月額・年額のサブスクリプションサービスを管理し、多通貨対応で支出を可視化するSPAです。
さらに、支払い日の追跡機能やカテゴリ管理、トースト通知システムを備えています。

## 主要技術スタック
- **フレームワーク**: React 19 with TypeScript
- **ビルドツール**: Vite with @vitejs/plugin-react
- **スタイリング**: Tailwind CSS v4 with @tailwindcss/vite plugin
- **データベース**: Supabase (PostgreSQL)
- **リンティング**: ESLint with TypeScript and React plugins
- **フォーマット**: Prettier with ESLint integration
- **為替レートAPI**: exchange-rate-api.com

## ファイル構成

### ルートディレクトリ
- **`package.json`** - プロジェクトの依存関係とスクリプト定義
- **`pnpm-lock.yaml`** - pnpmロックファイル
- **`pnpm-workspace.yaml`** - pnpmワークスペース設定
- **`vite.config.ts`** - Vite設定ファイル（React + Tailwind CSS v4 plugin）
- **`tsconfig.json`** - TypeScript設定のルートファイル
- **`tsconfig.app.json`** - アプリケーション用TypeScript設定
- **`tsconfig.node.json`** - Node.js環境用TypeScript設定
- **`eslint.config.js`** - ESLint設定（フラット設定形式）
- **`CLAUDE.md`** - Claude Code向けプロジェクト指示ファイル
- **`README.md`** - プロジェクト説明ファイル
- **`desc.md`** - ファイル構成説明（本ファイル）
- **`exchange_pt.md`** - 為替レート機能の仕様書

### src/ ディレクトリ

#### メインファイル
- **`main.tsx`** - Reactアプリケーションのエントリーポイント
- **`App.tsx`** - メインアプリケーションコンポーネント
  - サブスクリプションの状態管理
  - 各種モーダルの表示制御
  - CRUD操作のハンドリング
- **`types.ts`** - TypeScript型定義
  - `Subscription` - サブスクリプションのデータ型（支払い日情報含む）
  - `SubscriptionFormData` - フォーム用データ型
  - `CATEGORIES` - カテゴリ定数定義

#### lib/ ディレクトリ
- **`supabase.ts`** - Supabaseクライアント設定

#### services/ ディレクトリ
- **`subscriptionService.ts`** - Supabaseデータベース操作
  - CRUD操作の抽象化
  - エラーハンドリング

#### hooks/ ディレクトリ
- **`useExchangeRate.ts`** - 為替レートフック
  - 外部APIからリアルタイム為替レート取得
  - LocalStorageキャッシュ機能（24時間）
  - エラー時のフォールバック処理
- **`useToast.ts`** - トースト通知フック
  - 成功・エラー・情報・警告通知
  - 自動非表示機能とアニメーション
  - 便利なショートカット関数

#### utils/ ディレクトリ
- **`exchangeRateCache.ts`** - 為替レートキャッシュ管理
  - LocalStorageベースのキャッシュシステム
  - 期限切れ自動処理
  - フォールバック値提供
- **`dateCalculations.ts`** - 支払い日計算ユーティリティ
  - 次回支払い日計算（固定日・契約日ベース）
  - 残り日数計算と色分け表示
  - 月末日調整処理

#### types/ ディレクトリ
- **`exchange.ts`** - 為替レート関連型定義
  - `Currency` - 対応通貨型（USD, EUR）
  - `ExchangeRateResponse` - API応答型

#### components/ ディレクトリ

##### レイアウト関連
- **`Header.tsx`** - アプリケーションヘッダー
- **`Main.tsx`** - メインコンテンツエリア
- **`Footer.tsx`** - アプリケーションフッター

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

##### フォーム・フィルタ関連
- **`SubscriptionFormFields.tsx`** - フォーム入力フィールド群
  - サービス名入力
  - 価格入力（数値検証付き）
  - 支払い周期選択（月額/年額）
  - 通貨選択（JPY, USD, EUR）
  - カテゴリ選択
  - 支払い日設定（固定日・契約日ベース）
  - エラー表示機能

- **`CategoryFilter.tsx`** - カテゴリフィルター
  - カテゴリ別絞り込み機能
  - 「すべて」オプション付き

- **`DatePicker.tsx`** - 日付選択コンポーネント
  - 支払い開始日の選択
  - カレンダーUI

##### リスト・表示関連
- **`SubscriptionList.tsx`** - サブスクリプション一覧表示
  - 空状態の表示
  - カテゴリフィルタリング
  - 各アイテムのレンダリング

- **`SubscriptionItem.tsx`** - 個別サブスクリプション表示
  - 価格表示（月額/年額対応）
  - 年額の場合は月額換算も表示
  - カテゴリ表示
  - 次回支払い日と残り日数表示（色分け）
  - 編集・削除ボタン

- **`Summary.tsx`** - 支出サマリー表示
  - 通貨別月額・年額合計の計算・表示
  - 外貨の日本円換算表示
  - 全体合計（日本円換算）
  - 為替レートキャッシュクリア機能
  - 通貨表示順序固定（JPY → USD → EUR）
  - 詳細表示の折りたたみ機能

##### UI要素・通知関連
- **`Toast.tsx`** - トースト通知コンポーネント
  - 4種類の通知タイプ（成功・エラー・情報・警告）
  - 自動消失とアニメーション
  - アイコン付き表示

- **`Odometer.tsx`** - 数値アニメーション表示
  - 金額表示のスムーズなアニメーション
  - カウンタ風エフェクト

## 主な機能

### 1. サブスクリプション管理
- **基本操作**: 追加・編集・削除機能
- **料金設定**: 月額/年額での料金管理
- **多通貨対応**: JPY, USD, EUR対応
- **カテゴリ管理**: 9種類のカテゴリ分類（音楽、ソフトウェア、ゲーミング等）
- **支払い日管理**: 固定日・契約日ベースの2パターン

### 2. 支払い日追跡
- **次回支払い日計算**: 固定日パターン・契約日ベースパターン対応
- **残り日数表示**: 色分けでの視覚的表示（緑・橙・赤）
- **月末日調整**: 2月31日→2月28日などの自動調整
- **支払いパターン**: 毎月固定日・契約日ベース・設定なし

### 3. 支出可視化
- **通貨別集計**: 月額・年額別の合計金額表示
- **為替換算**: 外貨の日本円換算表示
- **全体合計**: 日本円換算での総計表示
- **詳細表示**: 折りたたみ可能な詳細パネル
- **統計情報**: 登録済みサービス数の表示

### 4. 為替レート機能
- **リアルタイム取得**: exchange-rate-api.comとの連携
- **キャッシュシステム**: 24時間LocalStorageキャッシュ
- **フォールバック**: エラー時の代替値提供
- **手動更新**: キャッシュクリア機能

### 5. UI/UX機能
- **フィルタリング**: カテゴリ別の絞り込み表示
- **トースト通知**: 成功・エラー・情報・警告の4種類通知
- **数値アニメーション**: 金額変更時のスムーズアニメーション
- **モーダルベースUI**: アクセシビリティ対応の各種ダイアログ

### 6. データ管理
- **Supabase連携**: PostgreSQLによるデータ永続化
- **エラーハンドリング**: 包括的なエラー処理とユーザー通知
- **バリデーション**: フォーム入力の検証機能

### 7. レスポンシブデザイン
- **モバイル対応**: Tailwind CSSによる完全レスポンシブ
- **一貫性**: 統一されたデザインシステム
- **アクセシビリティ**: ARIA属性とキーボード操作対応

## 開発コマンド
- `pnpm dev` - 開発サーバー起動
- `pnpm build` - プロダクションビルド
- `pnpm lint` - ESLint実行（自動修正）
- `pnpm format` - Prettier実行
- `pnpm preview` - ビルド結果のプレビュー
- `npx @tailwindcss/upgrade` - Tailwind CSS v4アップグレードツール

## 環境変数
- `VITE_SUPABASE_URL` - SupabaseプロジェクトURL
- `VITE_SUPABASE_ANON_KEY` - Supabase匿名キー
- `VITE_EXCHANGE_RATE_API_KEY` - exchange-rate-api.com APIキー