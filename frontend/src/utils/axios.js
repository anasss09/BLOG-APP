import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://blog-app-i7i1.onrender.com/api',
    withCredentials: true
})

// const baseURL =
//   import.meta.env.MODE === "development"
//     ? "http://localhost:4000/api"
//     : "https://blog-app-i7i1.onrender.com/api";

// const instance = axios.create({
//   baseURL,
//   withCredentials: true,
// });

// export default instance;

export default instance;