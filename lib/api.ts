import axios from 'axios'
const API = axios.create({ baseURL: 'http://localhost:5000/llm' })

export const generateLLM = (data: any) => API.post('/generate', data)
export const getExperiments = () => API.get('/')
export const getExperiment = (id: number) => API.get(`/${id}`)
export const generateRange = (data: any) => API.post('/generate-range', data)

