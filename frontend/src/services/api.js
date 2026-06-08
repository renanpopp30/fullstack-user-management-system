import axios from "axios";

const api = axios.create({
    baseURL: 'https://fullstack-user-management-system-production.up.railway.app'
})

export default api