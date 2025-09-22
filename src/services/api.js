import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// User endpoints
export const userAPI = {
  register: (userData) => api.post('/customers/register', userData),
  login: (credentials) => api.post('/customers/login', credentials),
  getAll: () => api.get('/customers/all'),
  getById: (id) => api.get(`/customers/read/${id}`),
  update: (userData) => api.post('/customers/update', userData),
  delete: (id) => api.delete(`/customers/delete/${id}`),
};

// Admin endpoints
export const adminAPI = {
  register: (adminData) => api.post('/admins/register', adminData),
  login: (credentials) => api.post('/admins/login', credentials),
  getAll: () => api.get('/admins/all'),
  getById: (id) => api.get(`/admins/read/${id}`),
  update: (adminData) => api.post('/admins/update', adminData),
  delete: (id) => api.delete(`/admins/delete/${id}`),
};

// Course endpoints
export const courseAPI = {
  create: (formData) => api.post('/courses/create', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  getAll: () => api.get('/courses/all'),
  getById: (id) => api.get(`/courses/${id}`),
  update: (courseData) => api.put('/courses/update', courseData),
  delete: (id) => api.delete(`/courses/delete/${id}`),
  getImage: (id) => api.get(`/courses/media/${id}`, { responseType: 'blob' }),
};

// Enrollment endpoints
export const enrollmentAPI = {
  enroll: (enrollmentData) => api.post('/api/enrollments/enroll', enrollmentData),
  getAll: () => api.get('/api/enrollments'),
  getById: (id) => api.get(`/api/enrollments/${id}`),
  approve: (id) => api.put(`/api/enrollments/${id}/approve`),
  reject: (id) => api.put(`/api/enrollments/${id}/reject`),
};

// Quiz endpoints
export const quizAPI = {
  create: (quizData) => api.post('/quizzes/create', quizData),
  getAll: () => api.get('/quizzes/all'),
  getById: (id) => api.get(`/quizzes/read/${id}`),
  update: (quizData) => api.post('/quizzes/update', quizData),
  delete: (id) => api.delete(`/quizzes/delete/${id}`),
};

// Support endpoints
export const supportAPI = {
  create: (supportData) => api.post('/api/contact-support', supportData),
  getAll: () => api.get('/api/allSupportMessages'),
  getById: (id) => api.get(`/api/read/${id}`),
  update: (supportData) => api.post('/api/update', supportData),
};

export default api;