export interface User {
  id: string;
  email: string;
  name: string;
  verified?: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
  confirmPassword: string;
}

export interface VerificationData {
  email: string;
  code: string;
}