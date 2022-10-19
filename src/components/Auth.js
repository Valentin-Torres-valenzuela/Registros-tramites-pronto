import axios from './axios'

export const isAuth = async () => {
    const token = localStorage.getItem('token')
    if(!token) return false
    try {
        await axios.get(`auth`)
        return true
    } catch (error) {
        return false
    }
}