import axios from "axios";

//pass new generated access token here
const tokenAuth = localStorage.getItem("authUser");
const parsedTokenAuth = tokenAuth ? JSON.parse(tokenAuth) : null;
const token = parsedTokenAuth?.access_token;

//apply base url for axios
const API_URL = process.env.NEXT_PUBLIC_API_URL;;

const axiosApi = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  },
});

const refreshTokenApi = async () => {
  const refreshUrl = `api/v1/auth/refresh`;

  // Get auth user from localStorage
  const authUserString = localStorage.getItem("authUser");
  let authUser = null;

  try {
    authUser = authUserString ? JSON.parse(authUserString) : null;
  } catch (error) {
    console.error("Error parsing authUser from localStorage:", error);
    throw error;
  }

  const accessToken = authUser?.access_token;
  const refreshToken = authUser?.refresh_token;
  if (!refreshToken) {
    throw new Error("No refresh token found in localStorage.");
  }

  try {
    const response = await axiosApi.post(
      refreshUrl,
      {},
      {
        params: { refresh_token: refreshToken },
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    if (response) {
      const authUserData = response?.data;
      localStorage.setItem("authUser", JSON.stringify(authUserData));
    }

    return response.data.access_token;
  } catch (error) {
    console.error("Token refresh failed:", error);
    throw error;
  }
};

axiosApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Modified condition to handle 401 errors
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry 
      // && token
    ) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshTokenApi();

        const bearerToken = `Bearer ${newToken}`;
        axiosApi.defaults.headers.common["Authorization"] = bearerToken;
        originalRequest.headers["Authorization"] = bearerToken;

        return axiosApi(originalRequest);
      } catch (refreshError) {
        console.error("Refresh Token Error:", refreshError);
        // localStorage.removeItem("authUser");
        // window.location.href = '/login';
        throw refreshError;
      }
    }

    return Promise.reject(error);
  }
);

export async function get(url, config = {}) {
  try {
    const response = await axiosApi.get(url, { ...config });
    return response;
  } catch (error) {
    if (!error.response || error.response.status !== 401) {
      console.error("GET Request Error:", error);
    }
    throw error;
  }
}

export async function post(url, data, config = {}) {
  try {
    const response = await axiosApi.post(url, data, config);
    return response;
  } catch (error) {
    if (!error.response || error.response.status !== 401) {
      console.error("POST Request Error:", error);
    }
    throw error;
  }
}

export async function put(url, data, config = {}) {
  try {
    const response = await axiosApi.put(url, { ...data }, { ...config });
    return response;
  } catch (error) {
    if (!error.response || error.response.status !== 401) {
      console.error("PUT Request Error:", error);
    }
    throw error;
  }
}

export async function del(url, config = {}) {
  try {
    const response = await axiosApi.delete(url, { ...config });
    return response;
  } catch (error) {
    if (!error.response || error.response.status !== 401) {
      console.error("DELETE Request Error:", error);
    }
    throw error;
  }
}

export async function patch(url, data, config = {}) {
  try {
    const response = await axiosApi.patch(url, data, { ...config });
    return response;
  } catch (error) {
    console.error("PATCH Request Error:", error);
    throw error;
  }
}
