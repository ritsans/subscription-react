import { supabase } from '../lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';
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

    return this.transformUser(data.user);
  }

  /**
   * ユーザー登録処理（将来の拡張用）
   * 現在はUIでは未使用
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

    return this.transformUser(data.user);
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
   * セッションから現在のユーザー情報を取得
   */
  static async getCurrentUser(): Promise<User | null> {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      throw new Error(`セッション情報の取得に失敗しました: ${error.message}`);
    }

    if (!session?.user) {
      return null;
    }

    return this.transformUser(session.user);
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
    return supabase.auth.onAuthStateChange(async (_event, session) => {
      const user = session?.user ? this.transformUser(session.user) : null;
      callback(user);
    });
  }

  /**
   * SupabaseユーザーをアプリのUser型に変換
   * 型安全性を保証し、undefined→nullの変換を行う
   */
  private static transformUser(supabaseUser: SupabaseUser): User {
    return {
      id: supabaseUser.id,
      email: supabaseUser.email!,
      email_confirmed_at: supabaseUser.email_confirmed_at || null,
      created_at: supabaseUser.created_at!,
    };
  }
}