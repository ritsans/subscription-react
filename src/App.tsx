import { useState } from 'react';
import type { Subscription } from './types';
import Summary from './components/Summary';
import SubscriptionList from './components/SubscriptionList';
import { AddSubscriptionModal } from './components/AddSubscriptionModal';
import { EditSubscriptionModal } from './components/EditSubscriptionModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';

function App() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
  const [deletingSubscription, setDeletingSubscription] = useState<Subscription | null>(null);

  const generateId = () => {
    return Date.now().toString() + Math.random().toString(36).slice(2, 11);
  };

  const handleAddSubscription = (subscriptionData: Omit<Subscription, 'id'>) => {
    const newSubscription: Subscription = {
      ...subscriptionData,
      id: generateId(),
    };
    setSubscriptions(prev => [...prev, newSubscription]);
  };

  const handleEditSubscription = (subscription: Subscription) => {
    setEditingSubscription(subscription);
    setIsEditModalOpen(true);
  };

  const handleUpdateSubscription = (subscription: Subscription) => {
    setSubscriptions(prev =>
      prev.map(sub =>
        sub.id === subscription.id ? subscription : sub
      )
    );
    setEditingSubscription(null);
    setIsEditModalOpen(false);
  };

  const handleDeleteSubscription = (subscription: Subscription) => {
    setDeletingSubscription(subscription);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingSubscription) {
      setSubscriptions(prev => prev.filter(sub => sub.id !== deletingSubscription.id));
      setDeletingSubscription(null);
    }
  };

  const handleCloseModals = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setEditingSubscription(null);
    setDeletingSubscription(null);
  };

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
