import { supabase } from '../lib/supabase';
import type { User, LoginFormData } from '../types';

/**
 * 認証サービス - Supabase Authenticationを使用した認証機能
 */
export class AuthService {
  /**
   * ログイン処理
   */
  static async signIn(credentials: LoginFormData): Promise<User> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      throw new Error(`ログインに失敗しました: ${error.message}`);
    }

    if (!data.user) {
      throw new Error('ユーザー情報の取得に失敗しました');
    }

    // メールアドレス記憶機能
    if (credentials.rememberEmail) {
      localStorage.setItem('remembered_email', credentials.email);
    } else {
      localStorage.removeItem('remembered_email');
    }

    return {
      id: data.user.id,
      email: data.user.email!,
      email_confirmed_at: data.user.email_confirmed_at,
      created_at: data.user.created_at!,
    };
  }

  /**
   * ユーザー登録処理
   */
  static async signUp(email: string, password: string): Promise<User> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      throw new Error(`ユーザー登録に失敗しました: ${error.message}`);
    }

    if (!data.user) {
      throw new Error('ユーザー情報の取得に失敗しました');
    }

    return {
      id: data.user.id,
      email: data.user.email!,
      email_confirmed_at: data.user.email_confirmed_at,
      created_at: data.user.created_at!,
    };
  }

  /**
   * ログアウト処理
   */
  static async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      throw new Error(`ログアウトに失敗しました: ${error.message}`);
    }
  }

  /**
   * 現在のユーザー情報を取得
   */
  static async getCurrentUser(): Promise<User | null> {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      throw new Error(`ユーザー情報の取得に失敗しました: ${error.message}`);
    }

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email!,
      email_confirmed_at: user.email_confirmed_at,
      created_at: user.created_at!,
    };
  }

  /**
   * 記憶されたメールアドレスを取得
   */
  static getRememberedEmail(): string {
    return localStorage.getItem('remembered_email') || '';
  }

  /**
   * 認証状態の変更を監視
   */
  static onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const user: User = {
          id: session.user.id,
          email: session.user.email!,
          email_confirmed_at: session.user.email_confirmed_at,
          created_at: session.user.created_at!,
        };
        callback(user);
      } else {
        callback(null);
      }
    });
  }
}