// lib/axios.js
import axios from 'axios';

// In-memory token cache to avoid fetching on every request
let cachedToken: string | null = null;
let tokenFetchPromise: Promise<string> | null = null;

const getToken = async (): Promise<string> => {
  // Return cached token if available
  if (cachedToken) return cachedToken;
  
  // Prevent multiple simultaneous fetches
  if (tokenFetchPromise) return tokenFetchPromise;
  
  // Fetch and cache the token
  tokenFetchPromise = fetch('/api/get-token')
    .then(res => res.text())
    .then(token => {
      cachedToken = token;
      tokenFetchPromise = null;
      return token;
    })
    .catch(err => {
      tokenFetchPromise = null;
      throw err;
    });
  
  return tokenFetchPromise;
};

// Function to clear token cache (call on logout)
export const clearTokenCache = () => {
  cachedToken = null;
  tokenFetchPromise = null;
};

// Function to set token cache (call on login)
export const setTokenCache = (token: string) => {
  cachedToken = token;
};

const customAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

customAxios.interceptors.request.use(async (config) => {
  try {
    const token = await getToken();
    if (token && token !== '') {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  } catch (error) {
    // Silent fail - user will get 401 if needed
  }
  return config;
}, (error) => Promise.reject(error));

customAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('Unauthorized - token may be expired');
      // Clear cache on 401 to force re-fetch
      clearTokenCache();
      // Optionally redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

export default customAxios;