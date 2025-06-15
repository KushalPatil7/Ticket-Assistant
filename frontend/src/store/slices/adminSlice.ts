import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import type { AdminState } from "../../types"
import { adminAPI } from "../../services/api"

const initialState: AdminState = {
  users: [],
  metrics: {
    ticketsByStatus: {},
    averageResolutionTime: 0,
  },
  loading: false,
}

export const fetchUsers = createAsyncThunk("admin/fetchUsers", async () => {
  const response = await adminAPI.getUsers()
  return response
})

export const updateUserRole = createAsyncThunk(
  "admin/updateUserRole",
  async ({ userId, role }: { userId: string; role: string }) => {
    const response = await adminAPI.updateUserRole(userId, role)
    return response
  },
)

export const fetchMetrics = createAsyncThunk("admin/fetchMetrics", async () => {
  const response = await adminAPI.getMetrics()
  return response
})

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false
        state.users = action.payload
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        const index = state.users.findIndex((u) => u.id === action.payload.id)
        if (index !== -1) {
          state.users[index] = action.payload
        }
      })
      .addCase(fetchMetrics.fulfilled, (state, action) => {
        state.metrics = action.payload
      })
  },
})

export default adminSlice.reducer
