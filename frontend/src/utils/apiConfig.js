// Centralized API configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 
    (process.env.NODE_ENV === 'production' 
      ? 'https://decanokart-production.up.railway.app/api' 
      : 'http://localhost:5000/api'),
  
  // Helper method to get full API URL
  getUrl: (endpoint) => {
    const baseUrl = API_CONFIG.BASE_URL;
    // Remove /api suffix if endpoint already includes it
    const cleanBase = baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    return `${cleanBase}/${cleanEndpoint}`;
  }
};

// Export the base URL for backward compatibility
export const API_BASE_URL = API_CONFIG.BASE_URL;

export default API_CONFIG;