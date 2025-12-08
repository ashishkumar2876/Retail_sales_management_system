import axios from 'axios';

const API_BASE_URL = `${import.meta.env.baseURL || 'http://localhost:3000'}/api/transactions`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Fetch Transactions
export const fetchSales = async (params) => {
  try {
    const response = await api.get('/', { params });
    return response.data; 
  } catch (error) {
    console.error("API Error fetching transactions:", error);
    throw error;
  }
};
export const fetchOptions = async () => {
  try {
    const response = await api.get('/options');
    return response.data;
  } catch (error) {
    console.error("API Error fetching options:", error);
    throw error;
  }
};