import { createClient } from '@/utils/supabase/client';
import { AuthResponse } from './helpers';
import { ROUTES } from './constants';
import { getErrorMessage, isExistingUser, getRedirectUrl } from './helpers';

interface SignUpData {
  email: string;
  password: string;
  fullName: string;
}

export const authService = {
  async signUp({ email, password, fullName }: SignUpData): Promise<AuthResponse> {
    try {
      const supabase = createClient();
      
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: getRedirectUrl(ROUTES.AUTH_CALLBACK)
        },
      });

      if (signUpError) {
        return {
          success: false,
          error: getErrorMessage(signUpError)
        };
      }

      // Check if user already exists
      if (isExistingUser(data.user)) {
        return {
          success: false,
          error: getErrorMessage({ message: 'User already registered' } as any)
        };
      }

      return {
        success: true,
        user: data.user
      };

    } catch (err) {
      console.error('Error during registration:', err);
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Ha ocurrido un error al crear la cuenta'
      };
    }
  }
};
