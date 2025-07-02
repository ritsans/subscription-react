import { useState } from 'react';
import type { Subscription } from './types';
import Summary from './components/Summary';
import SubscriptionForm from './components/SubscriptionForm';
import SubscriptionList from './components/SubscriptionList';

function App() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | undefined>();

  const generateId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
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
  };

  const handleUpdateSubscription = (subscriptionData: Omit<Subscription, 'id'>) => {
    if (!editingSubscription) return;
    
    setSubscriptions(prev =>
      prev.map(sub =>
        sub.id === editingSubscription.id
          ? { ...subscriptionData, id: editingSubscription.id }
          : sub
      )
    );
    setEditingSubscription(undefined);
  };

  const handleDeleteSubscription = (id: string) => {
    setSubscriptions(prev => prev.filter(sub => sub.id !== id));
  };

  const handleCancelEdit = () => {
    setEditingSubscription(undefined);
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

        <SubscriptionForm
          onSubmit={editingSubscription ? handleUpdateSubscription : handleAddSubscription}
          editingSubscription={editingSubscription}
          onCancel={handleCancelEdit}
        />

        <SubscriptionList
          subscriptions={subscriptions}
          onEdit={handleEditSubscription}
          onDelete={handleDeleteSubscription}
        />
      </div>
    </div>
  );
}

export default App;
