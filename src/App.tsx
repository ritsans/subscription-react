import { useState, useEffect } from 'react';
import type { Subscription } from './types';
import Summary from './components/Summary';
import SubscriptionList from './components/SubscriptionList';
import { AddSubscriptionModal } from './components/AddSubscriptionModal';
import { EditSubscriptionModal } from './components/EditSubscriptionModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { 
  fetchSubscriptions, 
  createSubscription, 
  updateSubscription, 
  deleteSubscription 
} from './services/subscriptionService';

function App() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
  const [deletingSubscription, setDeletingSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // setIs~は、モーダルの開閉状態を管理するためのstateです。
  
  // 初期データの取得
  useEffect(() => {
    const loadSubscriptions = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchSubscriptions();
        setSubscriptions(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'データの取得に失敗しました');
      } finally {
        setIsLoading(false);
      }
    };

    loadSubscriptions();
  }, []);

  // handle~ 関数は、ユーザーの操作をに応じて呼び出されるイベントハンドラ。
  const handleAddSubscription = async (subscriptionData: Omit<Subscription, 'id'>) => {
    try {
      setError(null);
      const newSubscription = await createSubscription(subscriptionData);
      setSubscriptions(prev => [...prev, newSubscription]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'サブスクリプションの追加に失敗しました');
    }
  };

  const handleEditSubscription = (subscription: Subscription) => {
    setEditingSubscription(subscription);
    setIsEditModalOpen(true);
  };

  const handleUpdateSubscription = async (subscription: Subscription) => {
    try {
      setError(null);
      const updatedSubscription = await updateSubscription(subscription);
      setSubscriptions(prev =>
        prev.map(sub =>
          sub.id === subscription.id ? updatedSubscription : sub
        )
      );
      setEditingSubscription(null);
      setIsEditModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'サブスクリプションの更新に失敗しました');
    }
  };

  const handleDeleteSubscription = (subscription: Subscription) => {
    setDeletingSubscription(subscription);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deletingSubscription) {
      try {
        setError(null);
        await deleteSubscription(deletingSubscription.id);
        setSubscriptions(prev => prev.filter(sub => sub.id !== deletingSubscription.id));
        setDeletingSubscription(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'サブスクリプションの削除に失敗しました');
      }
    }
  };

  const handleCloseModals = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setEditingSubscription(null);
    setDeletingSubscription(null);
  };

  // エラー表示のリセット
  const handleCloseError = () => {
    setError(null);
  };

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
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            サブスクリプション管理
          </h1>
          <p className="text-gray-600">
            毎月の支出を把握して、予算を見直しましょう
          </p>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <div className="flex justify-between items-center">
              <span>{error}</span>
              <button
                onClick={handleCloseError}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          </div>
        )}

        <Summary subscriptions={subscriptions} />

        <div className="mb-6">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            + サブスクリプションを追加
          </button>
        </div>

        <SubscriptionList
          subscriptions={subscriptions}
          onEdit={handleEditSubscription}
          onDelete={handleDeleteSubscription}
        />

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
      </div>
    </div>
  );
}

export default App;
