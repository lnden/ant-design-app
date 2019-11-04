import axios from 'axios';

const service = axios.create({
    timeout: 6000,
});

service.interceptors.request.use(
    config => {
        return config;
    },
    error => {
        Promise.reject(error);
    },
);

service.interceptors.response.use(
    response => {
        return response;
    },
    error => Promise.reject(error),
);

export default service;
