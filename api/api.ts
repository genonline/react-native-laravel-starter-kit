import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

type Token = string | null;

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;
const STORAGE_KEY = 'session';

let token: Token = null;

const api = axios.create({
  baseURL: API_BASE_URL,
  // timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (req) => {
  const token = await getBearerToken();

  if (token !== null) {
    req.headers['Authorization'] = `Bearer ${token}`;
  }

  return req;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 422) {
      // Return validation errors for further handling
      return Promise.reject({ validationErrors: error.response.data.errors });
    }

    return Promise.reject(error);
  },
);

export default api;

const getBearerToken = async () => {
  if (token !== null) {
    return token;
  }

  if (Platform.OS === 'web') {
    try {
      if (typeof localStorage !== 'undefined') {
        token = localStorage.getItem(STORAGE_KEY);
      }
    } catch (e) {
      console.error('Local storage is unavailable:', e);
    }
  } else {
    token = await SecureStore.getItemAsync(STORAGE_KEY);
  }

  return token;
};

export const clearApiToken = () => {
  token = null;
};
