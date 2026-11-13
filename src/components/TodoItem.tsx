import React, { useState, useRef, useEffect } from 'react';
import { Trash2, Edit2, Check, X } from 'lucide-react';
import { Todo } from '../types/todo';

interface TodoItemProps {
  todo: Todo;
  onToggle: (todoId: string) => void;
  onDelete: (todoId: string) => void;
  onEdit: (todoId: string, title: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleSubmit = () => {
    const trimmedValue = editValue.trim();
    if (trimmedValue && trimmedValue !== todo.title) {
      onEdit(todo.todoId, trimmedValue);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditValue(todo.title);
    }
  };

  return (
    <div className="group flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <button
        onClick={() => onToggle(todo.todoId)}
        className={`flex-shrink-0 w-5 h-5 rounded-full border-2 ${
          todo.completed
            ? 'border-emerald-500 bg-emerald-500'
            : 'border-gray-300'
        } flex items-center justify-center transition-colors`}
      >
        {todo.completed && <Check size={12} className="text-white" />}
      </button>
      
      {isEditing ? (
        <div className="flex-grow flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-grow px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSubmit}
            className="p-1 text-emerald-600 hover:text-emerald-700"
          >
            <Check size={16} />
          </button>
          <button
            onClick={() => {
              setIsEditing(false);
              setEditValue(todo.title);
            }}
            className="p-1 text-red-600 hover:text-red-700"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <>
          <span
            className={`flex-grow ${
              todo.completed ? 'text-gray-400 line-through' : 'text-gray-700'
            }`}
          >
            {todo.title}
          </span>
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setIsEditing(true)}
              className="p-1 text-blue-600 hover:text-blue-700"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={() => onDelete(todo.todoId)}
              className="p-1 text-red-600 hover:text-red-700"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}