// lib/axios.js
import axios from 'axios';

const customAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

customAxios.interceptors.request.use(async (config) => {
  // Fetch token from a server-side endpoint if needed
  const token = await fetch('/api/get-token').then(res => res.text());
  console.log(token, 'token');
  
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

customAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log(error);
    
    if (error.response?.status === 401) {
      console.error('Unauthorized - token may be expired');
    }
    return Promise.reject(error);
  }
);

export default customAxios;