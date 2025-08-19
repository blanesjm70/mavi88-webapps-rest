import { useState, useEffect } from 'react';
import { Todo } from '../types/todo';
import { useAuth } from '../contexts/AuthContext';
import * as api from '../services/api';

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      api.getTodos(token).then(setTodos);
    }
  }, [token]);

  const addTodo = async (title: string) => {
    if (!token) return;
    const newTodo = await api.createTodo(token, title);
    setTodos(prev => [newTodo, ...prev]);
  };

  const toggleTodo = async (id: string) => {
    if (!token) return;
    const todo = todos.find(t => t.todoId === id);
    if (!todo) return;
    
    const updatedTodo = await api.updateTodo(token, id, {
      completed: !todo.completed
    });
    
    setTodos(prev => prev.map(t =>
      t.todoId === id ? updatedTodo : t
    ));
  };

  const deleteTodo = async (id: string) => {
    if (!token) return;
    await api.deleteTodo(token, id);
    setTodos(prev => prev.filter(todo => todo.todoId !== id));
  };

  const editTodo = async (id: string, title: string) => {
    if (!token) return;
    const updatedTodo = await api.updateTodo(token, id, { title });
    setTodos(prev => prev.map(todo =>
      todo.todoId === id ? updatedTodo : todo
    ));
  };

  const clearCompleted = async () => {
    if (!token) return;
    const completedIds = todos.filter(t => t.completed).map(t => t.todoId);
    await Promise.all(completedIds.map(id => api.deleteTodo(token, id)));
    setTodos(prev => prev.filter(todo => !todo.completed));
  };

  return {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    clearCompleted
  };
}