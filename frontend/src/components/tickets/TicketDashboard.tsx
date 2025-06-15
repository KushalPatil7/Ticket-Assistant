"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material"
import { Add, Search } from "@mui/icons-material"
import type { RootState, AppDispatch } from "../../store"
import { fetchTickets, setFilters } from "../../store/slices/ticketSlice"
import TicketCard from "./TicketCard"
import TicketSkeleton from "../common/TicketSkeleton"
import CreateTicketDialog from "./CreateTicketDialog"

const TicketDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { tickets, loading, filters } = useSelector((state: RootState) => state.tickets)
  const { user } = useSelector((state: RootState) => state.auth)

  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  useEffect(() => {
    dispatch(fetchTickets())
  }, [dispatch])

  const handleFilterChange = (field: string, value: string) => {
    dispatch(setFilters({ [field]: value }))
  }

  const filteredTickets = tickets
    .filter((ticket) => {
      const matchesStatus = filters.status === "all" || ticket.status === filters.status
      const matchesSearch =
        ticket.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        ticket.description.toLowerCase().includes(filters.search.toLowerCase())
      return matchesStatus && matchesSearch
    })
    .sort((a, b) => {
      if (filters.sortBy === "priority") {
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        const aValue = priorityOrder[a.priority]
        const bValue = priorityOrder[b.priority]
        return filters.sortOrder === "desc" ? bValue - aValue : aValue - bValue
      } else {
        const aDate = new Date(a.createdAt).getTime()
        const bDate = new Date(b.createdAt).getTime()
        return filters.sortOrder === "desc" ? bDate - aDate : aDate - bDate
      }
    })

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Ticket Dashboard
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setCreateDialogOpen(true)}
          aria-label="Create new ticket"
        >
          New Ticket
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              placeholder="Search tickets..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: "text.secondary" }} />,
              }}
              aria-label="Search tickets"
            />
          </Grid>
          <Grid item xs={12} sm={3} md={2}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status}
                label="Status"
                onChange={(e) => handleFilterChange("status", e.target.value)}
                aria-label="Filter by status"
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="TODO">To Do</MenuItem>
                <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                <MenuItem value="DONE">Done</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3} md={2}>
            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={filters.sortBy}
                label="Sort By"
                onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                aria-label="Sort tickets by"
              >
                <MenuItem value="date">Date</MenuItem>
                <MenuItem value="priority">Priority</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        {loading
          ? Array.from({ length: 6 }).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <TicketSkeleton />
              </Grid>
            ))
          : filteredTickets.map((ticket) => (
              <Grid item xs={12} sm={6} md={4} key={ticket.id}>
                <TicketCard ticket={ticket} />
              </Grid>
            ))}
      </Grid>

      {!loading && filteredTickets.length === 0 && (
        <Box textAlign="center" mt={4}>
          <Typography variant="h6" color="text.secondary">
            No tickets found
          </Typography>
        </Box>
      )}

      <CreateTicketDialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} />
    </Container>
  )
}

export default TicketDashboard
