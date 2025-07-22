import { useReducer, useEffect } from 'react';
import type { Subscription } from './types';
import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';
import { AddSubscriptionModal } from './components/AddSubscriptionModal';
import { EditSubscriptionModal } from './components/EditSubscriptionModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { Toast } from './components/Toast';
import { useToast } from './hooks/useToast';
import { 
  fetchSubscriptions, 
  createSubscription, 
  updateSubscription, 
  deleteSubscription 
} from './services/subscriptionService';
import { appReducer, initialState } from './reducers/appReducer';

function App() {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { toast, showSuccess, showError, hideToast } = useToast();
  // dispatchは、アクションを発行してstateを更新するための関数です。
  
  // 初期データの取得
  useEffect(() => {
    const loadSubscriptions = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });
        const data = await fetchSubscriptions();
        dispatch({ type: 'SET_SUBSCRIPTIONS', payload: data });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'データの取得に失敗しました';
        dispatch({ type: 'SET_ERROR', payload: errorMessage });
        showError(errorMessage);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    loadSubscriptions();
  }, [showError]);

  // handle~ 関数は、ユーザーの操作をに応じて呼び出されるイベントハンドラ。
  const handleAddSubscription = async (subscriptionData: Omit<Subscription, 'id'>) => {
    try {
      const newSubscription = await createSubscription(subscriptionData);
      dispatch({ type: 'ADD_SUBSCRIPTION', payload: newSubscription });
      showSuccess(`${newSubscription.name} を追加しました`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'サブスクリプションの追加に失敗しました';
      showError(errorMessage);
    }
  };

  const handleEditSubscription = (subscription: Subscription) => {
    dispatch({ type: 'OPEN_EDIT_MODAL', payload: subscription });
  };

  const handleUpdateSubscription = async (subscription: Subscription) => {
    try {
      const updatedSubscription = await updateSubscription(subscription);
      dispatch({ type: 'UPDATE_SUBSCRIPTION', payload: updatedSubscription });
      dispatch({ type: 'CLOSE_ALL_MODALS' });
      showSuccess(`${updatedSubscription.name} を更新しました`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'サブスクリプションの更新に失敗しました';
      showError(errorMessage);
    }
  };

  const handleDeleteSubscription = (subscription: Subscription) => {
    dispatch({ type: 'OPEN_DELETE_MODAL', payload: subscription });
  };

  const handleConfirmDelete = async () => {
    if (state.deletingSubscription) {
      try {
        await deleteSubscription(state.deletingSubscription.id);
        dispatch({ type: 'DELETE_SUBSCRIPTION', payload: state.deletingSubscription.id });
        showSuccess(`${state.deletingSubscription.name} を削除しました`);
        dispatch({ type: 'CLOSE_ALL_MODALS' });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'サブスクリプションの削除に失敗しました';
        showError(errorMessage);
      }
    }
  };

  const handleCloseModals = () => {
    dispatch({ type: 'CLOSE_ALL_MODALS' });
  };

  // エラー表示のリセット
  const handleCloseError = () => {
    dispatch({ type: 'SET_ERROR', payload: null });
  };

  // カテゴリーフィルタリング処理
  const filteredSubscriptions = state.selectedCategory === 'すべて' 
    ? state.subscriptions 
    : state.subscriptions.filter(sub => sub.category === state.selectedCategory);

  if (state.isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">データを読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header error={state.error} onCloseError={handleCloseError} />
      
      <Main
        subscriptions={state.subscriptions}
        filteredSubscriptions={filteredSubscriptions}
        selectedCategory={state.selectedCategory}
        onCategoryChange={(category) => dispatch({ type: 'SET_CATEGORY_FILTER', payload: category })}
        onEdit={handleEditSubscription}
        onDelete={handleDeleteSubscription}
        onAddClick={() => dispatch({ type: 'OPEN_ADD_MODAL' })}
      />
      
      <Footer />

      <AddSubscriptionModal
        isOpen={state.isAddModalOpen}
        onClose={handleCloseModals}
        onAdd={handleAddSubscription}
      />

      <EditSubscriptionModal
        isOpen={state.isEditModalOpen}
        onClose={handleCloseModals}
        onUpdate={handleUpdateSubscription}
        subscription={state.editingSubscription}
      />

      <DeleteConfirmModal
        isOpen={state.isDeleteModalOpen}
        onClose={handleCloseModals}
        onConfirm={handleConfirmDelete}
        subscription={state.deletingSubscription}
      />

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          isVisible={toast.isVisible}
          onClose={hideToast}
        />
      )}
    </div>
  );
}

export default App;
