import config from './config';

// Replace all localhost:5000 references with config.API_URL
// This is a helper to update API calls

// Example usage in components:
// OLD: fetch('http://localhost:5000/api/products')
// NEW: fetch(`${config.API_URL}/api/products`)

export default config;