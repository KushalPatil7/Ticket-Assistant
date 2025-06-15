import axios from "axios"
import type { LoginRequest, SignupRequest, CreateTicketRequest, UpdateTicketRequest } from "../types"

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:3001/api"

const api = axios.create({
  baseURL: API_BASE_URL,
})

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

export const authAPI = {
  login: async (credentials: LoginRequest) => {
    const response = await api.post("/auth/login", credentials)
    return response.data
  },
  signup: async (userData: SignupRequest) => {
    const response = await api.post("/auth/signup", userData)
    return response.data
  },
  getCurrentUser: async () => {
    const response = await api.get("/auth/me")
    return response.data
  },
}

export const ticketAPI = {
  getTickets: async () => {
    const response = await api.get("/tickets")
    return response.data
  },
  getTicketById: async (id: string) => {
    const response = await api.get(`/tickets/${id}`)
    return response.data
  },
  createTicket: async (data: CreateTicketRequest) => {
    const response = await api.post("/tickets", data)
    return response.data
  },
  updateTicket: async (id: string, data: UpdateTicketRequest) => {
    const response = await api.put(`/tickets/${id}`, data)
    return response.data
  },
}

export const adminAPI = {
  getUsers: async () => {
    const response = await api.get("/admin/users")
    return response.data
  },
  updateUserRole: async (userId: string, role: string) => {
    const response = await api.put(`/admin/users/${userId}/role`, { role })
    return response.data
  },
  getMetrics: async () => {
    const response = await api.get("/admin/metrics")
    return response.data
  },
}

export default api
