import { signUp, confirmSignUp, resendSignUpCode, fetchAuthSession, getCurrentUser, signIn } from 'aws-amplify/auth';
import { config } from './config';
import * as mockApi from './mockApi';

import { Amplify } from 'aws-amplify';
import awsconfig from './aws-config';
Amplify.configure(awsconfig);

const IS_MOCK = config.isMock; // Toggle this to switch between mock and real API
const API_URL = config.serverUrl;

// Real API implementation using Amplify Auth
const realApi = {
  async loginUser(email: string, password: string) {

    try {
      await signIn({ username: email, password });
      const session = await fetchAuthSession();
      const user = await getCurrentUser();

      return {
        user: {
          
          id: user.userId,
          email: user.username,
          name: user.signInDetails?.loginId || email,
          verified: true, 
        },
        token: session.tokens?.idToken?.toString(),
      };
    } catch (error: any) {
      if (error.name === 'UserNotConfirmedException') {
        throw new Error('Please verify your email first');
      }
      throw new Error(error.message || 'Login failed');
    }    
    
  },

  async registerUser(credentials: {
    email: string;
    password: string;
    name: string;
  }) {
    try {
      await signUp({
        username: credentials.email,
        password: credentials.password,
        options: {
          userAttributes: {
            email: credentials.email,
            name: credentials.name,
          },
        },
      });
      
      return { success: true };
    } catch (error: any) {
      if (error.name === 'UsernameExistsException') {
        throw new Error('Email already registered');
      }
      throw new Error(error.message || 'Registration failed');
    }
  },

  async verifyEmail(email: string, code: string) {
    try {
      await confirmSignUp({
        username: email,
        confirmationCode: code,
      });
      
      return { success: true };
    } catch (error: any) {
      if (error.name === 'CodeMismatchException') {
        throw new Error('Invalid verification code');
      }
      throw new Error(error.message || 'Verification failed');
    }
  },

  async resendVerificationCode(email: string) {
    try {
      await resendSignUpCode({ username: email });
      return { success: true };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to resend verification code');
    }
  },

  async getTodos(token: string) {  
    const response = await fetch(`${API_URL}todos`);
    return handleResponse(response);
  },

  async createTodo(token: string, title: string) {
    const response = await fetch(`${API_URL}todos`, {
      method: 'POST',
      body: JSON.stringify({ title }),
    });
    return handleResponse(response);
  },

  async updateTodo(
    token: string,
    id: string,
    updates: Partial<{ title: string; completed: boolean }>
  ) {
    const response = await fetch(`${API_URL}todos/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    return handleResponse(response);

  },

  async deleteTodo(token: string, id: string) {
    const response = await fetch(`${API_URL}todos/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
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