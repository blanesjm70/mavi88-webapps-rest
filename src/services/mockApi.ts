import { User } from '../types/auth';
import { Todo } from '../types/todo';

// Simulated database
let todos: Todo[] = [];
const users: Record<string, { user: User; password: string; verificationCode?: string }> = {
  'demo@example.com': {
    user: {
      id: 'demo-user',
      email: 'demo@example.com',
      name: 'Demo User',
      verified: true
    },
    password: 'demo123'
  }
};

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function loginUser(email: string, password: string) {
  await delay(500);

  const userAccount = users[email];
  if (!userAccount || userAccount.password !== password) {
    throw new Error('Invalid credentials');
  }

  if (!userAccount.user.verified) {
    throw new Error('Please verify your email first');
  }

  return {
    user: userAccount.user,
    token: `mock-token-${userAccount.user.id}`
  };
}

export async function registerUser(credentials: {
  email: string;
  password: string;
  name: string;
}) {
  await delay(500);

  if (users[credentials.email]) {
    throw new Error('Email already registered');
  }

  const verificationCode = Math.random().toString().slice(2, 8);
  const newUser = {
    id: `user-${Object.keys(users).length + 1}`,
    email: credentials.email,
    name: credentials.name,
    verified: false
  };

  users[credentials.email] = {
    user: newUser,
    password: credentials.password,
    verificationCode
  };
  return { success: true}
}

export async function verifyEmail(email: string, code: string) {
  await delay(500);

  const userAccount = users[email];
  if (!userAccount) {
    throw new Error('User not found');
  }

  userAccount.user.verified = true;

  return {
    user: userAccount.user,
    token: `mock-token-${userAccount.user.id}`
  };
}

export async function resendVerificationCode(email: string) {
  await delay(500);

  const userAccount = users[email];
  if (!userAccount) {
    throw new Error('User not found');
  }

  if (userAccount.user.verified) {
    throw new Error('User already verified');
  }

  const newVerificationCode = Math.random().toString().slice(2, 8);
  userAccount.verificationCode = newVerificationCode;

  return {
    verificationCode: newVerificationCode // In a real app, this would be sent via email
  };
}

export async function getTodos(token: string) {
  await delay(300);
  return todos.filter(todo => todo.userId === getUserIdFromToken(token));
}

export async function createTodo(token: string, title: string) {
  await delay(300);
  const userId = getUserIdFromToken(token);
  const newTodo: Todo = {
    todoId: `todo-${Date.now()}`,
    title,
    completed: false,
    createdAt: new Date(),
    userId
  };
  todos.push(newTodo);
  return newTodo;
}

export async function updateTodo(
  token: string,
  id: string,
  updates: Partial<{ title: string; completed: boolean }>
) {
  await delay(300);
  const userId = getUserIdFromToken(token);
  const todoIndex = todos.findIndex(t => t.todoId === id && t.userId === userId);
  
  if (todoIndex === -1) {
    throw new Error('Todo not found');
  }

  todos[todoIndex] = {
    ...todos[todoIndex],
    ...updates
  };

  return todos[todoIndex];
}

export async function deleteTodo(token: string, id: string) {
  await delay(300);
  const userId = getUserIdFromToken(token);
  todos = todos.filter(todo => !(todo.todoId === id && todo.userId === userId));
  return { success: true };
}

function getUserIdFromToken(token: string) {
  return token.replace('mock-token-', '');
}