import axios from 'axios';

const prod = process.env.REACT_APP_PROD === "1"
const prodLink = 'https://api.tramitespronto.com.ar/api/'
const testLink = 'http://localhost:5000/api/'

const instance = axios.create({
    baseURL: prod ? prodLink : testLink,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    maxContentLength: Infinity,
    maxBodyLength: Infinity
});

instance.interceptors.request.use(config => {
    config.headers["x-access-token"] = localStorage.getItem('token')
    return config;
});

const CancelToken = axios.CancelToken;

export const source = CancelToken.source();

export const GenerateToken = () => CancelToken.source();

export default instance;