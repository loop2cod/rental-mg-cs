export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `/api/v1/auth/login`,
    REGISTER: `/api/v1/auth/register`,
    LOGOUT: `/api/v1/auth/logout`,
    REFRESH: `/api/v1/auth/refresh`,
    VERIFY: `/api/v1/auth/check-auth`,
  },
  INVENTORY: {
    GET_ALL: `/api/v1/inventory/all-products`,
    GET_ALL_WITHOUT_PAGINATION: `/api/v1/inventory/list-all-products`,
    CREATE: `/api/v1/inventory/add-product`,
    UPDATE: `/api/v1/inventory/update-product/:id`,
    DELETE: `/api/v1/inventory/delete-product/:id`,
    GET_BY_ID: `/api/v1/inventory/get-product-details/:id`,
  },
  CATEGORY:{
    GET_ALL: `/api/v1/category/all`,
    CREATE: `/api/v1/category/add`,
    UPDATE: `/api/v1/category/update/:id`,
    DELETE: `/api/v1/category/delete/:id`,
  }
} as const;

