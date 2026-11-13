import React from 'react';
import { ListTodo, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function Header() {
  const { user, logout } = useAuth();

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <ListTodo size={32} className="text-white" />
          <h1 className="text-3xl font-bold text-white">Task Master</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-white/90">Hello, {user?.name}</span>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}