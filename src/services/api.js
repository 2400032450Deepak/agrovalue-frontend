import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout - backend might not be running');
    } else if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userId');
      window.location.href = '/login';
    } else if (error.response?.status === 500) {
      console.error('Server error (500):', error.response?.data);
    }
    return Promise.reject(error);
  }
);

// ========== AUTH APIS ==========
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/auth/me'),  // Make sure this endpoint exists
};
// ========== PRODUCT APIS ==========
export const productAPI = {
  getAll: () => api.get('/api/products'),
  getById: (id) => api.get(`/api/products/${id}`),
  create: (productData) => api.post('/api/products', productData),
  update: (id, productData) => api.put(`/api/products/${id}`, productData),
  delete: (id) => api.delete(`/api/products/${id}`),
  getByFarmer: (farmerId) => api.get(`/api/farmers/${farmerId}/products`),
};

// ========== CART APIS ==========
export const cartAPI = {
  getCart: (userId) => api.get(`/api/cart/${userId}`),
  addItem: (userId, productId, quantity) => 
    api.post('/api/cart/items', { userId, productId, quantity }),
  updateItem: (cartItemId, quantity) => 
    api.put(`/api/cart/items/${cartItemId}`, { quantity }),
  removeItem: (cartItemId) => api.delete(`/api/cart/items/${cartItemId}`),
};

// ========== ORDER APIS ==========
export const orderAPI = {
  placeOrder: (userId) => api.post('/api/orders', { userId }),
  getUserOrders: (userId) => api.get(`/api/orders/user/${userId}`),
  getOrderDetails: (orderId) => api.get(`/api/orders/${orderId}`),
};

// ========== FARMER APIS ==========
export const farmerAPI = {
  getProducts: (farmerId) => api.get(`/api/farmers/${farmerId}/products`),
  getOrders: (farmerId) => api.get(`/api/farmers/${farmerId}/orders`),
  getDashboardStats: (farmerId) => api.get(`/api/farmers/${farmerId}/dashboard-stats`),
};

// ========== ADMIN APIS ==========
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getAllUsers: () => api.get('/admin/users'),
  getUserById: (id) => api.get(`/admin/users/${id}`),
  updateUserStatus: (id, status) => api.put(`/admin/users/${id}/status`, { status }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getAllProducts: () => api.get('/admin/products'),
  updateProductStatus: (id, status) => api.put(`/admin/products/${id}/status`, { status }),
  deleteProduct: (id) => api.delete(`/admin/products/${id}`),
  getTransactions: () => api.get('/admin/transactions'),
  getFarmerAnalytics: () => api.get('/admin/farmers'),
};

export default api;