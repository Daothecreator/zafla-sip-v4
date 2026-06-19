import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('zafla_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('zafla_token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (data: any) => api.post('/auth/bica-login', data),
};

export const bicaApi = {
  activate: () => api.post('/bica/activate'),
  influence: (data: any) => api.post('/bica/influence', data),
  queryKnowledge: (data: any) => api.post('/bica/query-knowledge', data),
  verify: (data: any) => api.post('/bica/verify', data),
};

export const intelApi = {
  collect: (data: any) => api.post('/intel/collect', data),
  status: (jobId: string) => api.get(`/intel/status/${jobId}`),
  archive: (params?: any) => api.get('/intel/archive', { params }),
};

export const legalApi = {
  generate: (data: any) => api.post('/legal/generate', data),
  attest: (actId: string) => api.post(`/legal/attest/${actId}`),
  export: (actId: string, format: string = 'docx') => api.get(`/legal/export/${actId}?format=${format}`, { responseType: 'blob' }),
};

export const notifyApi = {
  lark: (data: any) => api.post('/notify/lark', data),
  canva: (data: any) => api.post('/notify/canva', data),
};

export default api;
