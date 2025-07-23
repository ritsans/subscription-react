import { Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { TopPage } from './pages/TopPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { DashboardPage } from './pages/DashboardPage';

/**
 * メインAppコンポーネント
 * React Router、AuthProvider、QueryClientProviderでラップした
 * ルーティングベースのアプリケーション
 */
function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/" element={<TopPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;