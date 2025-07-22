import type { Subscription } from '../types';
// このファイルは、アプリ全体の「状態(state)」を一元管理するためのファイルです。
// ReactのuseReducerフックと一緒に使うことで、複雑な状態管理をシンプルにできます。

// サブスクリプションの一覧、モーダル開閉、などアプリケーション全体のState型定義
export interface AppState {
    // データ状態
    subscriptions: Subscription[];
    isLoading: boolean;
    error: string | null;

    // モーダル状態
    isAddModalOpen: boolean;
    isEditModalOpen: boolean;
    isDeleteModalOpen: boolean;
    editingSubscription: Subscription | null;
    deletingSubscription: Subscription | null;

    // フィルタ状態
    selectedCategory: string;
}

// 初期値の設定
export const initialState: AppState = {
    subscriptions: [],
    isLoading: true,
    error: null,
    isAddModalOpen: false,
    isEditModalOpen: false,
    isDeleteModalOpen: false,
    editingSubscription: null,
    deletingSubscription: null,
    selectedCategory: 'すべて',
};

// アクション型定義
// ----------------------------------------------------------------
// 状態を変更するための「命令」を定義(useState時代のset~~の代わり)
// 今後は dispatch({ type: 'OPEN_OPEN_MODAL',~~ 命令名を呼び出す形になる

export type AppAction =
    // データアクション
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'SET_SUBSCRIPTIONS'; payload: Subscription[] }
    | { type: 'ADD_SUBSCRIPTION'; payload: Subscription }
    | { type: 'UPDATE_SUBSCRIPTION'; payload: Subscription }
    | { type: 'DELETE_SUBSCRIPTION'; payload: string }

    // モーダルアクション
    | { type: 'OPEN_ADD_MODAL' }
    | { type: 'OPEN_EDIT_MODAL'; payload: Subscription }
    | { type: 'OPEN_DELETE_MODAL'; payload: Subscription }
    | { type: 'CLOSE_ALL_MODALS' }

    // フィルタアクション
    | { type: 'SET_CATEGORY_FILTER'; payload: string };

// メインReducer関数
// ---------------------------------------------------------
// 実際に「アクションが来たらどう状態を変えるか」を定義
// actionTypeが'OPEN_ADD_MODAL'だったらそのcaseを実行する

export const appReducer = (state: AppState, action: AppAction): AppState => {
    switch (action.type) {
        // データ関連のアクション
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };

        case 'SET_ERROR':
            return { ...state, error: action.payload };

        case 'SET_SUBSCRIPTIONS':
            return { ...state, subscriptions: action.payload };

        case 'ADD_SUBSCRIPTION':
            return {
                ...state,
                subscriptions: [...state.subscriptions, action.payload],
            };

        case 'UPDATE_SUBSCRIPTION':
            return {
                ...state,
                subscriptions: state.subscriptions.map(sub =>
                    sub.id === action.payload.id ? action.payload : sub
                ),
            };

        case 'DELETE_SUBSCRIPTION':
            return {
                ...state,
                subscriptions: state.subscriptions.filter(sub => sub.id !== action.payload),
            };

        // モーダル関連のアクション
        case 'OPEN_ADD_MODAL':
            return {
                ...state,
                isAddModalOpen: true,
                isEditModalOpen: false,
                isDeleteModalOpen: false,
                editingSubscription: null,
                deletingSubscription: null,
            };

        case 'OPEN_EDIT_MODAL':
            return {
                ...state,
                isAddModalOpen: false,
                isEditModalOpen: true,
                isDeleteModalOpen: false,
                editingSubscription: action.payload,
                deletingSubscription: null,
            };

        case 'OPEN_DELETE_MODAL':
            return {
                ...state,
                isAddModalOpen: false,
                isEditModalOpen: false,
                isDeleteModalOpen: true,
                editingSubscription: null,
                deletingSubscription: action.payload,
            };

        case 'CLOSE_ALL_MODALS':
            return {
                ...state,
                isAddModalOpen: false,
                isEditModalOpen: false,
                isDeleteModalOpen: false,
                editingSubscription: null,
                deletingSubscription: null,
            };

        // フィルタ関連のアクション
        case 'SET_CATEGORY_FILTER':
            return { ...state, selectedCategory: action.payload };

        default:
            return state;
    }
};
