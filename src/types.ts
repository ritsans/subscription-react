export interface Subscription {
  id: string;
  name: string;
  price: number;
  cycle: 'monthly' | 'yearly';
}

export interface SubscriptionFormData {
  name: string;
  price: string;
  cycle: 'monthly' | 'yearly';
}