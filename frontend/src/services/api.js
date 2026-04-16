import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = 'https://military-asset-management-system-7esy.onrender.com/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to every request
apiClient.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  console.log(' API Request:', config.method.toUpperCase(), config.url, { hasToken: !!token });
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle responses
apiClient.interceptors.response.use(
  (response) => {
    console.log(' API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.log(' API Error:', error.response?.status, error.config?.url, error.response?.data?.message);
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (email, password) => 
    apiClient.post('/auth/login', { email, password }),
  register: (name, email, password, role, base) => 
    apiClient.post('/auth/register', { name, email, password, role, base }),
};

// Dashboard API
export const dashboardAPI = {
  get: () => apiClient.get('/dashboard'),
};

// Assets APIs
export const assetsAPI = {
  getAll: () => apiClient.get('/assets'),
  create: (data) => apiClient.post('/assets', data),
  update: (id, data) => apiClient.put(`/assets/${id}`, data),
  delete: (id) => apiClient.delete(`/assets/${id}`),
};

// Purchases APIs
export const purchasesAPI = {
  getAll: () => apiClient.get('/purchases'),
  create: (data) => apiClient.post('/purchases', data),
};

// Transfers APIs
export const transfersAPI = {
  getAll: () => apiClient.get('/transfers'),
  create: (data) => apiClient.post('/transfers', data),
};

// Assignments APIs
export const assignmentsAPI = {
  getAll: () => apiClient.get('/assignments'),
  create: (data) => apiClient.post('/assignments', data),
};

// Expenditures API
export const expendituresAPI = {
  create: (data) => apiClient.post('/expenditures', data),
};

export default apiClient;
