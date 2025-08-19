import { signUp, confirmSignUp, resendSignUpCode } from 'aws-amplify/auth';
import { config } from './config';
import * as mockApi from './mockApi';

import { Amplify } from 'aws-amplify';
import awsconfig from './aws-config';
Amplify.configure(awsconfig);

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
