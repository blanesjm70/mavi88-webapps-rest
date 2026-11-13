import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { TodoItem } from './TodoItem';
import { Header } from './Header';
import { useTodos } from '../hooks/useTodos';
import { TodoFilters } from '../types/todo';

export function TodoApp() {
  const { todos, addTodo, toggleTodo, deleteTodo, editTodo, clearCompleted } = useTodos();
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState<TodoFilters>('all');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedValue = newTodo.trim();
    if (trimmedValue) {
      addTodo(trimmedValue);
      setNewTodo('');
    }
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const activeTodosCount = todos.filter(todo => !todo.completed).length;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-2xl mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <Header />
          
          <form onSubmit={handleSubmit} className="px-6 py-4 border-b border-gray-100">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
            />
          </form>

          <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle2 size={16} className="text-emerald-500" />
              <span>{activeTodosCount} items left</span>
            </div>
            
            <div className="flex gap-2">
              {(['all', 'active', 'completed'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 rounded-md text-sm font-medium capitalize ${
                    filter === f
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <button
              onClick={clearCompleted}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Clear completed
            </button>
          </div>

          <div className="divide-y divide-gray-100">
            {filteredTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                onEdit={editTodo}
              />
            ))}
          </div>

          {filteredTodos.length === 0 && (
            <div className="px-4 py-8 text-center text-gray-500">
              No tasks found. {filter !== 'all' && 'Try changing the filter.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}