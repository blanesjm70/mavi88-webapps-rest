export interface Todo {
  todoId: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  userId: string;
}

export type TodoFilters = 'all' | 'active' | 'completed';