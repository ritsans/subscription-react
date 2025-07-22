import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Subscription } from '../types';
import {
  fetchSubscriptions,
  createSubscription,
  updateSubscription,
  deleteSubscription,
} from '../services/subscriptionService';

// クエリキー定義
export const SUBSCRIPTION_QUERY_KEY = ['subscriptions'] as const;

// サブスクリプション一覧取得フック
export const useSubscriptions = () => {
  return useQuery({
    queryKey: SUBSCRIPTION_QUERY_KEY,
    queryFn: fetchSubscriptions,
  });
};

// サブスクリプション作成フック（楽観的更新あり）
export const useCreateSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSubscription,
    onMutate: async (newSubscription) => {
      // 進行中のクエリをキャンセル
      await queryClient.cancelQueries({ queryKey: SUBSCRIPTION_QUERY_KEY });

      // 現在のデータを取得
      const previousSubscriptions = queryClient.getQueryData<Subscription[]>(SUBSCRIPTION_QUERY_KEY);

      // 楽観的更新 - 一時的なIDで新しいサブスクリプションを追加
      if (previousSubscriptions) {
        const optimisticSubscription = {
          ...newSubscription,
          id: `temp-${Date.now()}`, // 一時ID
        };
        queryClient.setQueryData<Subscription[]>(
          SUBSCRIPTION_QUERY_KEY,
          [optimisticSubscription, ...previousSubscriptions]
        );
      }

      // ロールバック用の前のデータを返す
      return { previousSubscriptions };
    },
    onError: (_err, _newSubscription, context) => {
      // エラー時にロールバック
      if (context?.previousSubscriptions) {
        queryClient.setQueryData(SUBSCRIPTION_QUERY_KEY, context.previousSubscriptions);
      }
    },
    onSuccess: (data, _variables, context) => {
      // 成功時にキャッシュを正しいデータで更新
      const previousSubscriptions = context?.previousSubscriptions || [];
      const updatedSubscriptions = [data, ...previousSubscriptions];
      queryClient.setQueryData(SUBSCRIPTION_QUERY_KEY, updatedSubscriptions);
    },
    onSettled: () => {
      // 最終的にサーバーからの最新データで同期
      queryClient.invalidateQueries({ queryKey: SUBSCRIPTION_QUERY_KEY });
    },
  });
};

// サブスクリプション更新フック（楽観的更新あり）
export const useUpdateSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSubscription,
    onMutate: async (updatedSubscription) => {
      await queryClient.cancelQueries({ queryKey: SUBSCRIPTION_QUERY_KEY });

      const previousSubscriptions = queryClient.getQueryData<Subscription[]>(SUBSCRIPTION_QUERY_KEY);

      // 楽観的更新
      if (previousSubscriptions) {
        const optimisticSubscriptions = previousSubscriptions.map((sub) =>
          sub.id === updatedSubscription.id ? updatedSubscription : sub
        );
        queryClient.setQueryData(SUBSCRIPTION_QUERY_KEY, optimisticSubscriptions);
      }

      return { previousSubscriptions };
    },
    onError: (_err, _updatedSubscription, context) => {
      // エラー時にロールバック
      if (context?.previousSubscriptions) {
        queryClient.setQueryData(SUBSCRIPTION_QUERY_KEY, context.previousSubscriptions);
      }
    },
    onSuccess: (data) => {
      // 成功時にキャッシュを正しいデータで更新
      queryClient.setQueryData<Subscription[]>(
        SUBSCRIPTION_QUERY_KEY,
        (old) => old?.map((sub) => (sub.id === data.id ? data : sub)) || []
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: SUBSCRIPTION_QUERY_KEY });
    },
  });
};

// サブスクリプション削除フック（楽観的更新あり）
export const useDeleteSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSubscription,
    onMutate: async (subscriptionId) => {
      await queryClient.cancelQueries({ queryKey: SUBSCRIPTION_QUERY_KEY });

      const previousSubscriptions = queryClient.getQueryData<Subscription[]>(SUBSCRIPTION_QUERY_KEY);

      // 楽観的更新 - 削除対象を除外
      if (previousSubscriptions) {
        const optimisticSubscriptions = previousSubscriptions.filter(
          (sub) => sub.id !== subscriptionId
        );
        queryClient.setQueryData(SUBSCRIPTION_QUERY_KEY, optimisticSubscriptions);
      }

      return { previousSubscriptions };
    },
    onError: (_err, _subscriptionId, context) => {
      // エラー時にロールバック
      if (context?.previousSubscriptions) {
        queryClient.setQueryData(SUBSCRIPTION_QUERY_KEY, context.previousSubscriptions);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: SUBSCRIPTION_QUERY_KEY });
    },
  });
};