import { useState, useEffect } from 'react';
import type { Subscription } from './types';
import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';
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
  const [selectedCategory, setSelectedCategory] = useState<string>('すべて');
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
      <Header error={error} onCloseError={handleCloseError} />
      
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
    </div>
  );
}

export default App;
