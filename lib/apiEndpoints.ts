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
  },
  BOOKING:{
    GET_ALL: `/api/v1/booking/list`,
    CREATE: `/api/v1/booking/add`,
    UPDATE: `/api/v1/booking/update`,
    GET_DETAIL: `/api/v1/booking/view`,
    CANCEL: `/api/v1/booking/cancel`,
    GET_BY_ID: `/api/v1/booking/details`,
  },
  SUPPLIERS:{
    GET_ALL: `/api/v1/supplier/list-all`,
    CREATE: `/api/v1/supplier/add`,
    UPDATE: `/api/v1/supplier/update/`,
    LIST_WITH_PAGINATION: `/api/v1/supplier/list`,
  },
  OUTSOURCED_PRODUCTS:{
    GET_ALL: `/api/v1/inventory/list-all-outsourced`,
    CREATE: `/api/v1/inventory/add-outsourced-product`,
    GET_BY_SUPPLIER: `/api/v1/inventory/list-outsourced`
  },
  DASHBOARD:{
    VALUES: `/api/v1/dashboard/data`,
    CHART: `/api/v1/dashboard/chart`,
    RECENT_BOOKINGS: `/api/v1/dashboard/recent`
  }
} as const;

