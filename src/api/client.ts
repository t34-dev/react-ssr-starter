import axios, { AxiosInstance } from 'axios';

const axiosClient: AxiosInstance = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  headers: {
    'Content-Type': 'application/json',
    // You can add other global headers here, for example, for authorization:
    // 'Authorization': 'Bearer yourTokenHere'
  },
  // You can configure other default settings here
});

// Global request and response interceptors (optional)
axiosClient.interceptors.request.use(
  (config) => {
    // Perform actions before sending the request (for example, add an authorization token)
    return config;
  },
  (error) => {
    // Handle the request error
    return Promise.reject(error);
  },
);

axiosClient.interceptors.response.use(
  (response) => {
    // Perform actions with the response data
    return response;
  },
  (error) => {
    // Handle the response error
    return Promise.reject(error);
  },
);

export { axiosClient };
