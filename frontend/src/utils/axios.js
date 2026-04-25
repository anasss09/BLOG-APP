import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://blog-app-i7i1.onrender.com/api',
    withCredentials: true
})

export default instance;