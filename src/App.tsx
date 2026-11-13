import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { AuthPages } from './components/AuthPages';
import { TodoApp } from './components/TodoApp';
import { useAuth } from './contexts/AuthContext';

function AuthenticatedApp() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return user ? <TodoApp /> : <AuthPages />;
}

function App() {
  return (
    <AuthProvider>
      <AuthenticatedApp />
    </AuthProvider>
  );
}

export default App;