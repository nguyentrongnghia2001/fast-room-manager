// plugins/axios.ts
import axios, { type AxiosResponse } from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL

const instance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
  },
})

instance.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
)

instance.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error) => Promise.reject(error.response?.data)
)

export default instance
