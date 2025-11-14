import axios from 'axios'


const apiClient = axios.create({
    baseURL: process.env.NEST_PUBLIC_API_URL || 'http://localhost:3000',
    headers:{
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// Interceptor para agregar el token de JWT 
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if(token){
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Interceptor para manejar errores globalmente
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if(error.response?.status === 401){
            // token expirado o invalido
            localStorage.removeItem('token');
            window.location.href = '/auth/login';
        }
        return Promise.reject(error);
    }
);

export default apiClient