import axios from 'axios';
import { config } from '../utils/config';

export const api = axios.create({ baseURL: config.apiBaseUrl, timeout: 15000 });

api.interceptors.request.use((request) => {
  const isAdminRoute = window.location.pathname.startsWith('/admin');
  const token = isAdminRoute ? localStorage.getItem('adminToken') : localStorage.getItem('guideToken');
  if (token) request.headers.Authorization = `Bearer ${token}`;
  return request;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('guideToken');
      localStorage.removeItem('guideUser');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
    }
    return Promise.reject(error);
  }
);

export const unwrap = (response) => response.data.data;
