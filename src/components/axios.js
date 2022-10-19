import axios from 'axios';

const prod = process.env.REACT_APP_PROD === "1"
const prodLink = 'https://tramitespronto.com.ar/api/'
const testLink = 'http://localhost:5000/api/'

const instance = axios.create({
    baseURL: prod ? prodLink : testLink,
    withCredentials:true,
});

instance.interceptors.request.use(config => {
    config.headers["x-access-token"] = localStorage.getItem('token')
    return config;
})

const CancelToken = axios.CancelToken;

export const source = CancelToken.source();

export const GenerateToken = () => CancelToken.source();

export default instance;