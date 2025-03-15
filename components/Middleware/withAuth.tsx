'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useLayoutEffect, useState, useCallback, useMemo } from 'react';
import Spinner from '../Spinner';
import { post } from '../../utilities/AxiosInterceptor';
import { API_ENDPOINTS } from '../../lib/apiEndpoints';
import Cookies from 'js-cookie';
import axios from 'axios';
import data from '../app-sidebar';

const apiUrl = process.env.NEXT_PUBLIC_API_URL

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

    // Memoize the authentication check function
    const checkAuth = useCallback(async () => {
      try {
        const response = await axios.post(`${apiUrl}${API_ENDPOINTS.AUTH.VERIFY}`, {}, { withCredentials: true });

        if (response?.data?.success) {
          setIsAuthenticated(true);
        } else if (!response?.data?.success && response?.data?.sessionOut) {
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
    }, []);

    // Run the authentication check on mount
    useLayoutEffect(() => {
      checkAuth();
    }, [checkAuth]);

    // Handle redirects when authentication status changes
    useLayoutEffect(() => {
      if (typeof window !== 'undefined' && isAuthenticated === false) {
        const currentPath = window.location.pathname; // Get the current pathname
        const redirectPath = searchParams.get('redirect') || `/auth?redirect=${encodeURIComponent(currentPath)}`;
        router.push(redirectPath);
      }
    }, [isAuthenticated, router, searchParams]);

    // Memoize the component to avoid unnecessary re-renders
    const MemoizedComponent = useMemo(() => <Component {...props} />, [props]);

    if (isAuthenticated === null) {
      return <Spinner />; // Show a spinner while checking authentication
    }

    if (isAuthenticated === false) {
      return null; // Return null or a loading spinner while redirecting
    }

    return MemoizedComponent;
  }

  // Add display name for better debugging
  AuthenticatedComponent.displayName = `withAuth(${Component.displayName || Component.name || 'Component'})`;

  // Wrap the component in React.memo to prevent unnecessary re-renders
  return React.memo(AuthenticatedComponent);
}