export interface User {
  id: string
  email: string
  role: "user" | "moderator" | "admin"
  skills: string[]
  createdAt: string
}

export interface Ticket {
  id: string
  title: string
  description: string
  status: "TODO" | "IN_PROGRESS" | "DONE"
  priority: "low" | "medium" | "high"
  createdBy: string
  assignedTo?: string
  assignedModerator?: User
  requiredSkills: string[]
  aiInsights?: AIInsights
  createdAt: string
  updatedAt: string
}

export interface AIInsights {
  priority: "low" | "medium" | "high"
  requiredSkills: string[]
  suggestions: string[]
  estimatedResolutionTime: number
  isProcessing: boolean
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
}

export interface TicketState {
  tickets: Ticket[]
  currentTicket: Ticket | null
  loading: boolean
  filters: {
    status: string
    search: string
    sortBy: "priority" | "date"
    sortOrder: "asc" | "desc"
  }
}

export interface AdminState {
  users: User[]
  metrics: {
    ticketsByStatus: { [key: string]: number }
    averageResolutionTime: number
  }
  loading: boolean
}

export interface LoginRequest {
  email: string
  password: string
}

export interface SignupRequest {
  email: string
  password: string
  skills: string[]
}

export interface CreateTicketRequest {
  title: string
  description: string
}

export interface UpdateTicketRequest {
  status?: "TODO" | "IN_PROGRESS" | "DONE"
  assignedTo?: string
}
