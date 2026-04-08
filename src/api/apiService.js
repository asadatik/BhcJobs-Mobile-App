import axios from 'axios';

const BASE_URL = 'https://dev.bhcjobs.com';
export const STORAGE_URL = 'https://dev.bhcjobs.com/storage';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Image URL helpers
export const getIndustryImageUrl = (image) =>
  image ? `${STORAGE_URL}/industry-image/${image}` : null;

export const getCompanyImageUrl = (image) =>
  image ? `${STORAGE_URL}/company-image/${image}` : null;

// GET endpoints
export const getIndustries = async () => {
  const response = await api.get('/api/industry/get');
  return response.data;
};

export const getJobs = async () => {
  const response = await api.get('/api/job/get');
  return response.data;
};

export const getCompanies = async () => {
  const response = await api.get('/api/company/get');
  return response.data;
};

// POST endpoints
export const registerUser = async (userData) => {
  const response = await api.post('/api/job_seeker/register', userData);
  return response.data;
};

export const verifyPhone = async (verifyData) => {
  const response = await api.post('/api/job_seeker/phone_verify', verifyData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post('/api/job_seeker/login', credentials);
  return response.data;
};