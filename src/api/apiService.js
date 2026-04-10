import axios from 'axios';

const BASE_URL = 'https://dev.bhcjobs.com';
export const STORAGE_URL = 'https://dev.bhcjobs.com/storage';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

//Image URL helpers
export const getIndustryImageUrl = (image) =>
  image ? `${STORAGE_URL}/industry-image/${image}` : null;

export const getCompanyImageUrl = (image) =>
  image ? `${STORAGE_URL}/company-image/${image}` : null;

//
const toFormData = (obj) => {
  const fd = new FormData();
  Object.entries(obj).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      fd.append(key, String(value));
    }
  });
  return fd;
};

//GET endpoints 
export const getIndustries = async () => {
  const res = await api.get('/api/industry/get');
  return res.data;
};

export const getJobs = async () => {
  const res = await api.get('/api/job/get');
  return res.data;
};

export const getCompanies = async () => {
  const res = await api.get('/api/company/get');
  return res.data;
};

// POST endpoints 

export const registerUser = async (userData) => {
  const res = await api.post(
    '/api/job_seeker/register',
    toFormData(userData),
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return res.data;
};

// Fields phone, otp

export const verifyPhone = async ({ phone, otp }) => {
  const res = await api.post(
    '/api/job_seeker/phone_verify',
    toFormData({ phone, otp }),
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return res.data;
};


export const loginUser = async ({ phone, password }) => {
  const res = await api.post(
    '/api/job_seeker/login',
    toFormData({ phone, password }),
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return res.data;
};