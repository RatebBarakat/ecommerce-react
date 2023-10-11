import Axios from 'axios';
import { createContext, useContext } from 'react';
import { AuthContext } from './contexts/auth';
import Toast from './components/Toast';


const axios = Axios.create({
	baseURL: "http://localhost:8000",
	withCredentials: 'include',
	headers: {
		"Content-Type": "application/json",
		"Accept": "application/json",
	},
});

// const auth = useContext(AuthContext);

axios.interceptors.response.use(
	response => response,
	error => {
	  if (error.response && error.response.status === 403) {
		Toast.notifyMessage('error',error.response.data?.message ?? 'unauthorized');
	  }
	  return Promise.reject(error);
	}
  );


export default axios;