import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';

interface UserMetadata {
  full_name?: string;
}

interface UserData {
  user: User | null;
  fullName: string | null;
  isLoading: boolean;
  error: Error | null;
}

export function useUser(): UserData {
  const [userData, setUserData] = useState<UserData>({
    user: null,
    fullName: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const supabase = createClient();

    async function getUser() {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
          throw error;
        }

        if (user) {
          const metadata = user.user_metadata as UserMetadata;
          setUserData({
            user,
            fullName: metadata.full_name || null,
            isLoading: false,
            error: null,
          });
        } else {
          setUserData({
            user: null,
            fullName: null,
            isLoading: false,
            error: null,
          });
        }
      } catch (error) {
        setUserData({
          user: null,
          fullName: null,
          isLoading: false,
          error: error as Error,
        });
      }
    }

    getUser();

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const metadata = session.user.user_metadata as UserMetadata;
          setUserData({
            user: session.user,
            fullName: metadata.full_name || null,
            isLoading: false,
            error: null,
          });
        } else {
          setUserData({
            user: null,
            fullName: null,
            isLoading: false,
            error: null,
          });
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return userData;
}
