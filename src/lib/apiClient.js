import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create a new user on the backend
// userData should have: { uid, email, profile: {...} }
export async function createBackendUser(userData) {
  try {
    const response = await apiClient.post('/users', userData);
    console.log('✅ Backend user created:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error creating backend user:', error.response?.data || error.message);
    throw error;
  }
}

// Get all users
export async function getAllUsers() {
  try {
    const response = await apiClient.get('/users');
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching users:', error.response?.data || error.message);
    throw error;
  }
}

// Get user by UID
export async function getUserByUid(uid) {
  try {
    const response = await apiClient.get(`/users/${uid}`);
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching user:', error.response?.data || error.message);
    throw error;
  }
}

// Update user
export async function updateBackendUser(uid, userData) {
  try {
    const response = await apiClient.put(`/users/${uid}`, userData);
    console.log('✅ Backend user updated:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error updating backend user:', error.response?.data || error.message);
    throw error;
  }
}

export default apiClient;
