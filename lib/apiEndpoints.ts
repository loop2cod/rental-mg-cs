export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `/api/v1/auth/login`,
    REGISTER: `/api/v1/auth/register`,
    LOGOUT: `/api/v1/auth/logout`,
    REFRESH: `/api/v1/auth/refresh`,
    VERIFY: `/api/v1/auth/check-auth`,
  },
  INVENTORY: {

  },
  CATEGORY:{
    GET_ALL: `/api/v1/category/all`,
    CREATE: `/api/v1/category/add`,
    UPDATE: `/api/v1/category/update/:id`,
    DELETE: `/api/v1/category/delete/:id`,
  }
} as const;

