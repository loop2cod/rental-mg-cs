'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Spinner from '../Spinner';
import { post } from '../../utilities/AxiosInterceptor';
import { API_ENDPOINTS } from '../../lib/apiEndpoints';
import Cookies from 'js-cookie';

// Define the expected response type
interface AuthResponse {
  success: boolean;
  data?: any;
  message?: string;
  sessionOut?: boolean;
}

// Generic type for the wrapped component props
export function withAuth<T extends object>(Component: React.ComponentType<T>) {
  // Define props type for the HOC
  function AuthenticatedComponent(props: T) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
      const checkAuth = async () => {
        try {
          const response = await post<AuthResponse>(API_ENDPOINTS.AUTH.VERIFY,{},{ withCredentials: true });

          if (response.success) {
            setIsAuthenticated(true);
          } else if (!response.success && response.sessionOut) {
            Cookies.set(
              'toastMessage',
              JSON.stringify({
                message: 'Your session has expired.',
                description: 'Please try again.',
              }),
              { expires: 1 }
            );
            setIsAuthenticated(false);
          } else {
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error('Error during token verification:', error);
          setIsAuthenticated(false);
        }
      };

      checkAuth();
    }, [router]);

    if (isAuthenticated === null) {
      return <Spinner />;
    }

    if (typeof window !== 'undefined' && isAuthenticated === false) {
      const currentPath = window.location.pathname; // Get the current pathname
      const redirectPath = searchParams.get('redirect') || `/auth?redirect=${encodeURIComponent(currentPath)}`;
      router.push(redirectPath);
      return null;
    }

    return <Component {...props} />;
  }

  // Add display name for better debugging
  AuthenticatedComponent.displayName = `withAuth(${Component.displayName || Component.name || 'Component'})`;

  return AuthenticatedComponent;
}