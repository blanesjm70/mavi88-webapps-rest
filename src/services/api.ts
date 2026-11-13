import { config } from './config';
import * as mockApi from './mockApi';

const IS_MOCK = config.isMock; // Toggle this to switch between mock and real API

// Real API implementation using Amplify Auth
const realApi = {
  async loginUser(email: string, password: string) {

    // TO IMPLEMENT
    
  },

  async registerUser(credentials: {
    email: string;
    password: string;
    name: string;
  }) {
        // TO IMPLEMENT

  },

  async verifyEmail(email: string, code: string) {
    // TO IMPLEMENT
  },

  async resendVerificationCode(email: string) {
      // TO IMPLEMENT
  },

  async getTodos(token: string) {  
    // TO IMPLEMENT
  },

  async createTodo(token: string, title: string) {
        // TO IMPLEMENT
  },

  async updateTodo(
    token: string,
    id: string,
    updates: Partial<{ title: string; completed: boolean }>
  ) {
        // TO IMPLEMENT

  },

  async deleteTodo(token: string, id: string) {
        // TO IMPLEMENT
  }
};

async function handleResponse(response: Response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'An error occurred');
  }
  return response.json();
}

// Export either mock or real API based on IS_MOCK flag
export const {
  loginUser,
  registerUser,
  verifyEmail,
  resendVerificationCode,
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} = IS_MOCK ? mockApi : realApi;