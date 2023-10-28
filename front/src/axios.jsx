import Axios from 'axios';
import Toast from './components/Toast';

const createAxiosInstance = (authContext = null) => {
  const axios = Axios.create({
    baseURL: "http://localhost:8000",
    withCredentials: 'include',
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
  });

  axios.interceptors.response.use(
    response => response,
    error => {
      if (error.response && error.response.status === 403) {
        authContext.fetchUser(); 
      }
      if (error.response && error.response.status === 401) {
        authContext && authContext.fetchUser(); 
      }
      return Promise.reject(error);
    }
  );

  return axios;
};

export default createAxiosInstance;
