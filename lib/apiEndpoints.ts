export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `/api/v1/auth/login`,
    REGISTER: `/api/v1/auth/register`,
    LOGOUT: `/api/v1/auth/logout`,
    REFRESH: `/api/v1/auth/refresh`,
    VERIFY: `/api/v1/auth/check-auth`,
  },
} as const;