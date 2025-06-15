import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./slices/authSlice"
import ticketReducer from "./slices/ticketSlice"
import adminReducer from "./slices/adminSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tickets: ticketReducer,
    admin: adminReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
