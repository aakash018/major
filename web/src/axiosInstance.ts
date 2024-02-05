import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { getAccessToken, setAccessToken } from "./accessToken";

// Function to check if the token has expired
export const isTokenExpired = (token: string) => {
  try {
    try {
      const decoded = jwtDecode(token);

      const currentTime = Date.now() / 1000;
      if (decoded.exp) {
        return decoded.exp < currentTime;
      } else {
        return true;
      }
    } catch (error) {
      return true;
    }
  } catch (error) {
    return true;
  }
};

// Function to refresh token (assuming you have an API endpoint for refreshing tokens)
export const refreshToken = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_SERVER_ENDPOINT}/auth/refresh-token`,
      {
        withCredentials: true,
      }
    );
    if (response.data.status === "ok") {
      return response.data.accessToken;
    } else {
      throw new Error("could not refresh token");
    }
  } catch (error) {
    throw new Error("Token refresh failed");
  }
};

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_ENDPOINT,
  headers: {
    "ngrok-skip-browser-warning": true,
  },
  // Other axios configurations...
});

// Axios interceptor for token refresh
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = getAccessToken();
    if (isTokenExpired(token)) {
      const newAccessToken = await refreshToken();
      setAccessToken(newAccessToken);
      config.headers.Authorization = `Bearer ${newAccessToken}`;
    } else {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
