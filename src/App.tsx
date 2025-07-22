import { useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import type { Subscription } from './types';
import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';
import { AddSubscriptionModal } from './components/AddSubscriptionModal';
import { EditSubscriptionModal } from './components/EditSubscriptionModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { Toast } from './components/Toast';
import { useToast } from './hooks/useToast';
import { queryClient } from './lib/queryClient';
import { 
  useSubscriptions, 
  useCreateSubscription, 
  useUpdateSubscription, 
  useDeleteSubscription 
} from './hooks/useSubscriptions';

const AppContent = () => {
  // TanStack Queryフック
  const { data: subscriptions = [], isLoading, error } = useSubscriptions();
  const createMutation = useCreateSubscription();
  const updateMutation = useUpdateSubscription();
  const deleteMutation = useDeleteSubscription();

  // UIの状態管理（モーダル表示等）
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
  const [deletingSubscription, setDeletingSubscription] = useState<Subscription | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('すべて');
  const { toast, showSuccess, showError, hideToast } = useToast();
  // エラー処理 - TanStack Queryのエラーをtoastで表示
  if (error) {
    showError(error instanceof Error ? error.message : 'データの取得に失敗しました');
  }

  // handle~ 関数は、ユーザーの操作に応じて呼び出されるイベントハンドラ
  const handleAddSubscription = async (subscriptionData: Omit<Subscription, 'id'>) => {
    createMutation.mutate(subscriptionData, {
      onSuccess: (newSubscription) => {
        showSuccess(`${newSubscription.name} を追加しました`);
      },
      onError: (err) => {
        const errorMessage = err instanceof Error ? err.message : 'サブスクリプションの追加に失敗しました';
        showError(errorMessage);
      },
    });
  };

  const handleEditSubscription = (subscription: Subscription) => {
    setEditingSubscription(subscription);
    setIsEditModalOpen(true);
  };

  const handleUpdateSubscription = async (subscription: Subscription) => {
    updateMutation.mutate(subscription, {
      onSuccess: (updatedSubscription) => {
        setEditingSubscription(null);
        setIsEditModalOpen(false);
        showSuccess(`${updatedSubscription.name} を更新しました`);
      },
      onError: (err) => {
        const errorMessage = err instanceof Error ? err.message : 'サブスクリプションの更新に失敗しました';
        showError(errorMessage);
      },
    });
  };

  const handleDeleteSubscription = (subscription: Subscription) => {
    setDeletingSubscription(subscription);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deletingSubscription) {
      deleteMutation.mutate(deletingSubscription.id, {
        onSuccess: () => {
          showSuccess(`${deletingSubscription.name} を削除しました`);
          setDeletingSubscription(null);
          setIsDeleteModalOpen(false);
        },
        onError: (err) => {
          const errorMessage = err instanceof Error ? err.message : 'サブスクリプションの削除に失敗しました';
          showError(errorMessage);
        },
      });
    }
  };

  const handleCloseModals = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setEditingSubscription(null);
    setDeletingSubscription(null);
  };

  // エラー表示のリセット（TanStack Queryではquery client経由でリセット）
  const handleCloseError = () => {
    // エラーの詳細表示は主にtoast側で管理
    hideToast();
  };

  // カテゴリーフィルタリング処理
  const filteredSubscriptions = selectedCategory === 'すべて' 
    ? subscriptions 
    : subscriptions.filter(sub => sub.category === selectedCategory);

  if (isLoading) {
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
      <Header error={error instanceof Error ? error.message : null} onCloseError={handleCloseError} />
      
      <Main
        subscriptions={subscriptions}
        filteredSubscriptions={filteredSubscriptions}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        onEdit={handleEditSubscription}
        onDelete={handleDeleteSubscription}
        onAddClick={() => setIsAddModalOpen(true)}
      />
      
      <Footer />

      <AddSubscriptionModal
        isOpen={isAddModalOpen}
        onClose={handleCloseModals}
        onAdd={handleAddSubscription}
      />

      <EditSubscriptionModal
        isOpen={isEditModalOpen}
        onClose={handleCloseModals}
        onUpdate={handleUpdateSubscription}
        subscription={editingSubscription}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseModals}
        onConfirm={handleConfirmDelete}
        subscription={deletingSubscription}
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
};

// メインAppコンポーネントはQueryClientProviderでラップ
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;
