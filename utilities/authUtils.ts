import Cookies from "js-cookie";

/**
 * Get the current pathname from window.location
 */
export const getCurrentPathname = (): string => {
  if (typeof window !== 'undefined') {
    return window.location.pathname;
  }
  return '';
};

/**
 * Check if the current path is an authentication page
 */
export const isAuthPage = (path: string): boolean => {
  const authPaths = ['/auth', '/login', '/register', '/signup'];
  return authPaths.some(authPath => path.includes(authPath));
};

/**
 * Clear authentication state and redirect to auth page
 */
export const clearAuthAndRedirect = (message: string, description: string): void => {
  // Set toast message for user feedback
  Cookies.set(
    "toastMessage",
    JSON.stringify({
      message,
      description,
    }),
    { expires: 1 }
  );

  // Redirect to auth page
  if (typeof window !== 'undefined') {
    const currentPath = window.location.pathname;
    window.location.href = `/auth?redirect=${encodeURIComponent(currentPath)}`;
  }
};