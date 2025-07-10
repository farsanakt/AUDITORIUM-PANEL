  import axios from 'axios';
import { store } from '../redux/store';
import { refreshToken } from '../redux/slices/authSlice';

  const API_URL = import.meta.env.VITE_USER_API_URL;

  const instance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
  });


// add access token to headers
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});





  export default instance;
