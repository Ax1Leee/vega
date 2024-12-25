import axios from 'axios';
import {getToken} from "@/utils/auth";

// 创建 axios 实例
const service = axios.create({
    baseURL: 'https://api.example.com', // 你的 API 基础 URL
    timeout: 5000, // 请求超时时间
});

// 请求拦截器
service.interceptors.request.use(
    config => {
        // 在发送请求之前做些什么
        // 例如：添加 token
        const token = getToken();
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        // 对请求错误做些什么
        return Promise.reject(error);
    }
);

// 响应拦截器
service.interceptors.response.use(
    response => {
        // 对响应数据做些什么
        return response.data;
    },
    error => {
        // 对响应错误做些什么
        return Promise.reject(error);
    }
);

export default service;