import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import type { TicketState, CreateTicketRequest, UpdateTicketRequest } from "../../types"
import { ticketAPI } from "../../services/api"

const initialState: TicketState = {
  tickets: [],
  currentTicket: null,
  loading: false,
  filters: {
    status: "all",
    search: "",
    sortBy: "date",
    sortOrder: "desc",
  },
}

export const fetchTickets = createAsyncThunk("tickets/fetchTickets", async () => {
  const response = await ticketAPI.getTickets()
  return response
})

export const fetchTicketById = createAsyncThunk("tickets/fetchTicketById", async (id: string) => {
  const response = await ticketAPI.getTicketById(id)
  return response
})

export const createTicket = createAsyncThunk("tickets/createTicket", async (ticketData: CreateTicketRequest) => {
  const response = await ticketAPI.createTicket(ticketData)
  return response
})

export const updateTicket = createAsyncThunk(
  "tickets/updateTicket",
  async ({ id, data }: { id: string; data: UpdateTicketRequest }) => {
    const response = await ticketAPI.updateTicket(id, data)
    return response
  },
)

const ticketSlice = createSlice({
  name: "tickets",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    updateTicketRealtime: (state, action) => {
      const index = state.tickets.findIndex((t) => t.id === action.payload.id)
      if (index !== -1) {
        state.tickets[index] = action.payload
      }
      if (state.currentTicket?.id === action.payload.id) {
        state.currentTicket = action.payload
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTickets.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.loading = false
        state.tickets = action.payload
      })
      .addCase(fetchTicketById.fulfilled, (state, action) => {
        state.currentTicket = action.payload
      })
      .addCase(createTicket.fulfilled, (state, action) => {
        state.tickets.unshift(action.payload)
      })
      .addCase(updateTicket.fulfilled, (state, action) => {
        const index = state.tickets.findIndex((t) => t.id === action.payload.id)
        if (index !== -1) {
          state.tickets[index] = action.payload
        }
        if (state.currentTicket?.id === action.payload.id) {
          state.currentTicket = action.payload
        }
      })
  },
})

export const { setFilters, updateTicketRealtime } = ticketSlice.actions
export default ticketSlice.reducer
