import { PostData } from '../lib/types'
import axios, { AxiosRequestConfig } from 'axios'

const api = import.meta.env.VITE_API_BASE_URL
const apiUrl = `${api}/login`

export const login = async (email: string, password: string) => {
  const response = await axios.post(apiUrl, { email, password })
  return response.data
}

export const register = async (email: string, password: string) => {
  const response = await axios.post(apiUrl, { email, password })
  return response.data
}
export const getDatas = async (data: string) => {
  const response = await axios.get(`${api}${data}`)
  return response.data
}

export const postDatas = async (url: string, data: PostData) => {
  const response = await axios.post(`${api}/${url}`, data);
  return response.data;
};

export const postDataWithImage = async (url: string, data: FormData | PostData, options: AxiosRequestConfig = {}) => {
  const response = await axios.post(`${api}/${url}`, data, options);
  return response.data;
};

export const putData = async (url: string, data: PostData) => {
  const response = await axios.put(`${api}${url}`, data);
  return response.data;
};