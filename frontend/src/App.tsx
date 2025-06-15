"use client"

import type React from "react"
import { useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { Provider, useDispatch, useSelector } from "react-redux"
import { ThemeProvider } from "@mui/material/styles"
import { CssBaseline, Snackbar, Alert } from "@mui/material"
import { store, type RootState, type AppDispatch } from "./store"
import { theme } from "./theme"
import { getCurrentUser } from "./store/slices/authSlice"
import { socketService } from "./services/socket"
import { useToast } from "./hooks/useToast"

// Components
import Layout from "./components/layout/Layout"
import ProtectedRoute from "./components/common/ProtectedRoute"
import LoginPage from "./components/auth/LoginPage"
import SignupPage from "./components/auth/SignupPage"
import TicketDashboard from "./components/tickets/TicketDashboard"
import TicketDetailPage from "./components/tickets/TicketDetailPage"
import UserManagementPage from "./components/admin/UserManagementPage"
import AdminInsightsPage from "./components/admin/AdminInsightsPage"

const AppContent: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { isAuthenticated, token } = useSelector((state: RootState) => state.auth)
  const { toast, hideToast } = useToast()

  useEffect(() => {
    if (token) {
      dispatch(getCurrentUser())
    }
  }, [dispatch, token])

  useEffect(() => {
    if (isAuthenticated) {
      socketService.connect()
    } else {
      socketService.disconnect()
    }

    return () => {
      socketService.disconnect()
    }
  }, [isAuthenticated])

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <TicketDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tickets/:id"
            element={
              <ProtectedRoute>
                <TicketDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute requiredRole="admin">
                <UserManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/insights"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminInsightsPage />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Layout>

      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={hideToast}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert onClose={hideToast} severity={toast.severity} sx={{ width: "100%" }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Router>
  )
}

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppContent />
      </ThemeProvider>
    </Provider>
  )
}

export default App
