import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import type { AuthState, LoginRequest, SignupRequest } from "../../types"
import { authAPI } from "../../services/api"

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("token"),
  isAuthenticated: false,
  loading: false,
}

export const login = createAsyncThunk("auth/login", async (credentials: LoginRequest) => {
  const response = await authAPI.login(credentials)
  localStorage.setItem("token", response.token)
  return response
})

export const signup = createAsyncThunk("auth/signup", async (userData: SignupRequest) => {
  const response = await authAPI.signup(userData)
  localStorage.setItem("token", response.token)
  return response
})

export const getCurrentUser = createAsyncThunk("auth/getCurrentUser", async () => {
  const response = await authAPI.getCurrentUser()
  return response
})

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      localStorage.removeItem("token")
    },
    clearError: (state) => {
      state.loading = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
      })
      .addCase(login.rejected, (state) => {
        state.loading = false
        state.isAuthenticated = false
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload
        state.isAuthenticated = true
      })
  },
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer
