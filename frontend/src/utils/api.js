const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to make API calls
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'An error occurred');
  }

  return data;
};

// Auth API calls
export const authAPI = {
  register: (firstName, lastName, email, password, passwordConfirm) =>
    apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        password,
        passwordConfirm,
      }),
    }),

  login: (email, password) =>
    apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  getMe: () => apiCall('/auth/me', { method: 'GET' }),

  updateProfile: (profileData) =>
    apiCall('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    }),

  changePassword: (currentPassword, newPassword, confirmPassword) =>
    apiCall('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify({
        currentPassword,
        newPassword,
        confirmPassword,
      }),
    }),

  deleteAccount: (password) =>
    apiCall('/auth/account', {
      method: 'DELETE',
      body: JSON.stringify({ password }),
    }),

  getUserById: (userId) => apiCall(`/auth/user/${userId}`, { method: 'GET' }),

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return Promise.resolve();
  },
};

// Store token and user data
export const setAuthToken = (token, user) => {
  if (token) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  } else {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export const getAuthToken = () => localStorage.getItem('token');
export const getAuthUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
