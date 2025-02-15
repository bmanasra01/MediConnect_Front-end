//axiosConfig.js

// import axios from 'axios';

// const instance = axios.create({
//   baseURL: 'http://localhost:8080', 
// });

// instance.interceptors.request.use((config) => {
//   const token = localStorage.getItem('access_token'); 
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`; 
//     console.log("Token being sent:", config.headers.Authorization); 
//   } else {
//     console.error("Token not found in localStorage");
//   }
//   return config;
// }, (error) => {
//   return Promise.reject(error);
// });

// export default instance;


// import axios from 'axios';

// const instance = axios.create({
//   baseURL: 'http://localhost:8080', // Replace with your backend base URL
// });

// instance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('access_token'); // Ensure the token is stored under this key
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//       console.log('Authorization Header:', config.headers.Authorization); // Debugging token
//     } else {
//       console.error('Token not found in localStorage');
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// export default instance;

//admin : 

import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8080', // Replace with your backend base URL
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token'); // Ensure the token is stored under this key
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('[DEBUG] Authorization Token:', token); // Debugging token
    } else {
      console.error('[DEBUG] Token not found in localStorage');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;



