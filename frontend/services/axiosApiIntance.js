import axios from 'axios';

const axiosApiInstance = axios.create({
  baseURL: import.meta.env.VITE_API_ENDPOINT || 'http://localhost:3001/'
});

const URL = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:3001/'

// Request interceptor for API calls
axiosApiInstance.interceptors.request.use(
  (config) => {
    console.log("ENVOI DE LA REQUETE")

    const local_token = localStorage.getItem('token');

    // if (local_token) {
    // }
    // else {
    //   return Promise.reject({'no_token': true});
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosApiInstance;