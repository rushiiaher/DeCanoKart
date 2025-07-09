// API configuration helper
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem('token');
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers
    }
  };

  const config = { ...defaultOptions, ...options };
  
  try {
    const response = await fetch(url, config);
    return response;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

export const API_URL = API_BASE_URL;
export default { apiCall, API_URL };