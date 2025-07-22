import React, { createContext, useContext, useEffect, useState } from 'react';
import type { AuthState, User, LoginFormData } from '../types';
import { AuthService } from '../services/authService';

interface AuthContextType extends AuthState {
  signIn: (credentials: LoginFormData) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  getRememberedEmail: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * 認証コンテキストプロバイダー
 * アプリケーション全体で認証状態を管理
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 初回ロード時に現在の認証状態を確認
    const checkUser = async () => {
      try {
        const currentUser = await AuthService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('ユーザー情報の取得に失敗:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // 認証状態の変更を監視
    const { data: { subscription } } = AuthService.onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
    });

    // クリーンアップ
    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (credentials: LoginFormData): Promise<void> => {
    setLoading(true);
    try {
      const user = await AuthService.signIn(credentials);
      setUser(user);
    } catch (error) {
      setUser(null);
      throw error; // エラーをUIに再スロー
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      const user = await AuthService.signUp(email, password);
      setUser(user);
    } catch (error) {
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    setLoading(true);
    try {
      await AuthService.signOut();
      setUser(null);
    } catch (error) {
      console.error('ログアウト失敗:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getRememberedEmail = (): string => {
    return AuthService.getRememberedEmail();
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    getRememberedEmail,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * useAuth - 認証コンテキストを使用するためのカスタムフック
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};