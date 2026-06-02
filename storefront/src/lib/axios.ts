import axios from 'axios';

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (!axios.isAxiosError(error)) return fallback;

  if (!error.response) {
    return 'تعذر الاتصال بالسيرفر — تأكد أنه يعمل على المنفذ 5000';
  }

  const data = error.response.data as {
    message?: string;
    errors?: { message: string }[];
  };

  if (data.message) return data.message;
  if (data.errors?.length) return data.errors.map((e) => e.message).join(' · ');

  return fallback;
}

const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  withCredentials: true,
});

// إرسال التوكن تلقائياً مع كل طلب
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// لو التوكن انتهى، امسحه
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('userToken');
      localStorage.removeItem('userData');
    }
    return Promise.reject(error);
  }
);

export default api;