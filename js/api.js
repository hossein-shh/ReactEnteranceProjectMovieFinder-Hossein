// API configuration
const API_BASE = 'https://moviesapi.ir/api/v1';

// Basic fetch helper
async function fetchAPI(endpoint) {
  const response = await fetch(API_BASE + endpoint);

  if (!response.ok) {
    throw new Error('Request failed');
  }

  const data = await response.json();
  return data;
}
