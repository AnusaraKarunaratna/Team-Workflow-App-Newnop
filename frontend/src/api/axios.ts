import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use((res) => res,  (err) => {
    const message = err?.response?.data?.message || "Something went wrong";
    toast.error(message);
    return Promise.reject(err);
});

export default api;