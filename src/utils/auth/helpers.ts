import { AuthError, User } from '@supabase/supabase-js';
import { AUTH_ERRORS, AUTH_ERROR_MESSAGES } from './constants';

export interface AuthResponse {
  success: boolean;
  error?: string;
  user?: User | null;
}

export const getErrorMessage = (error: AuthError): string => {
  switch (error.message) {
    case AUTH_ERRORS.USER_ALREADY_REGISTERED:
      return AUTH_ERROR_MESSAGES.USER_ALREADY_REGISTERED;
    case AUTH_ERRORS.PASSWORD_TOO_SHORT:
      return AUTH_ERROR_MESSAGES.PASSWORD_TOO_SHORT;
    case AUTH_ERRORS.EMAIL_NOT_CONFIRMED:
      return AUTH_ERROR_MESSAGES.EMAIL_NOT_CONFIRMED;
    default:
      return error.message || AUTH_ERROR_MESSAGES.GENERIC_ERROR;
  }
};

export const isExistingUser = (user: User | null): boolean => {
  return user?.identities?.length === 0;
};

export const getRedirectUrl = (path: string): string => {
  return `${window.location.origin}${path}`;
};
