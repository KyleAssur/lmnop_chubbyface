import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Redirect to login page
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
      return Promise.reject(error);
    }
);

// User endpoints
export const userAPI = {
  register: (userData) => api.post('/customers/register', userData),
  login: (credentials) => api.post('/customers/login', credentials),
  getAll: () => api.get('/customers/all'),
  getById: (id) => api.get(`/customers/read/${id}`),
  update: (userData) => api.put('/customers/update', userData),
  delete: (id) => api.delete(`/customers/delete/${id}`),
  getProfile: () => api.get('/customers/profile'),
};

// Admin endpoints
export const adminAPI = {
  register: (adminData) => api.post('/admins/register', adminData),
  login: (credentials) => api.post('/admins/login', credentials),
  getAll: () => api.get('/admins/all'),
  getById: (id) => api.get(`/admins/read/${id}`),
  update: (adminData) => api.put('/admins/update', adminData),
  delete: (id) => api.delete(`/admins/delete/${id}`),
  getProfile: () => api.get('/admins/profile'),
};

// Course endpoints - FIXED
export const courseAPI = {
  create: (formData) => api.post('/courses/create', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  getAll: () => api.get('/courses/all'),
  getById: (id) => api.get(`/courses/${id}`),
  update: (formData) => api.put('/courses/update', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  delete: (id) => api.delete(`/courses/delete/${id}`),
  getImage: (id) => `${API_BASE_URL}/courses/media/${id}`,
};

// Enrollment endpoints - UPDATED with reset functionality
export const enrollmentAPI = {
  enroll: (enrollmentData) => api.post('/api/enrollments/enroll', enrollmentData),
  getAll: () => api.get('/api/enrollments'),
  getById: (id) => api.get(`/api/enrollments/${id}`),
  approve: (id) => api.put(`/api/enrollments/${id}/approve`),
  reject: (id) => api.put(`/api/enrollments/${id}/reject`),
  reset: (id) => api.put(`/api/enrollments/${id}/reset`), // NEW
  updateStatus: (id, status) => api.put(`/api/enrollments/${id}/status`, { status }), // NEW
  getByStudent: (studentId) => api.get(`/api/enrollments/student/${studentId}`),
  getByCourse: (courseId) => api.get(`/api/enrollments/course/${courseId}`),
  getByStatus: (status) => api.get(`/api/enrollments/status/${status}`),
};

// Quiz endpoints
export const quizAPI = {
  create: (quizData) => api.post('/quizzes/create', quizData),
  getAll: () => api.get('/quizzes/all'),
  getById: (id) => api.get(`/quizzes/read/${id}`),
  update: (quizData) => api.put('/quizzes/update', quizData),
  delete: (id) => api.delete(`/quizzes/delete/${id}`),
};

// Support endpoints
export const supportAPI = {
  create: (supportData) => api.post('/api/contact-support', supportData),
  getAll: () => api.get('/api/allSupportMessages'),
  getById: (id) => api.get(`/api/read/${id}`),
  update: (supportData) => api.post('/api/update', supportData),
};

// Auth utility functions
export const authUtils = {
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  hasRole: (role) => {
    const user = authUtils.getCurrentUser();
    return user && user.role === role;
  }
};

export default api;