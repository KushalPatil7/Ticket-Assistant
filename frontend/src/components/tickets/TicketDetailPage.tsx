"use client"

import type React from "react"
import { useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Avatar,
} from "@mui/material"
import { ArrowBack, Person, Schedule } from "@mui/icons-material"
import type { RootState, AppDispatch } from "../../store"
import { fetchTicketById, updateTicket } from "../../store/slices/ticketSlice"
import { socketService } from "../../services/socket"
import PriorityBadge from "../common/PriorityBadge"
import SkillChip from "../common/SkillChip"
import AISuggestionsCard from "../common/AISuggestionsCard"
import StatusProgress from "../common/StatusProgress"

const TicketDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { currentTicket } = useSelector((state: RootState) => state.tickets)
  const { user } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    if (id) {
      dispatch(fetchTicketById(id))
      socketService.joinTicketRoom(id)
    }

    return () => {
      if (id) {
        socketService.leaveTicketRoom(id)
      }
    }
  }, [dispatch, id])

  const handleStatusChange = async (newStatus: string) => {
    if (id && currentTicket) {
      await dispatch(
        updateTicket({
          id,
          data: { status: newStatus as "TODO" | "IN_PROGRESS" | "DONE" },
        }),
      )
    }
  }

  const canModifyTicket = user?.role === "moderator" || user?.role === "admin"

  if (!currentTicket) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" alignItems="center" mb={3}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate("/dashboard")}
          sx={{ mr: 2 }}
          aria-label="Back to dashboard"
        >
          Back to Dashboard
        </Button>
        <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
          Ticket Details
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
              <Typography variant="h5" component="h2" sx={{ flexGrow: 1, mr: 2 }}>
                {currentTicket.title}
              </Typography>
              <PriorityBadge priority={currentTicket.priority} size="medium" />
            </Box>

            <StatusProgress currentStatus={currentTicket.status} />

            <Box mt={3} mb={3}>
              <Typography variant="h6" gutterBottom>
                Description
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                {currentTicket.description}
              </Typography>
            </Box>

            <Box mb={3}>
              <Typography variant="h6" gutterBottom>
                Required Skills
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {currentTicket.requiredSkills.map((skill) => (
                  <SkillChip key={skill} skill={skill} variant="filled" />
                ))}
              </Box>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Schedule color="action" />
                  <Typography variant="body2" color="text.secondary">
                    Created: {formatDate(currentTicket.createdAt)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Schedule color="action" />
                  <Typography variant="body2" color="text.secondary">
                    Updated: {formatDate(currentTicket.updatedAt)}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          <AISuggestionsCard insights={currentTicket.aiInsights} />
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Status & Assignment
            </Typography>

            {canModifyTicket && (
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={currentTicket.status}
                  label="Status"
                  onChange={(e) => handleStatusChange(e.target.value)}
                  aria-label="Change ticket status"
                >
                  <MenuItem value="TODO">To Do</MenuItem>
                  <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                  <MenuItem value="DONE">Done</MenuItem>
                </Select>
              </FormControl>
            )}

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Current Status
              </Typography>
              <Chip
                label={currentTicket.status.replace("_", " ")}
                color={
                  currentTicket.status === "DONE"
                    ? "success"
                    : currentTicket.status === "IN_PROGRESS"
                      ? "warning"
                      : "default"
                }
                sx={{ mb: 2 }}
              />
            </Box>

            {currentTicket.assignedModerator && (
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Assigned Moderator
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <Avatar sx={{ width: 32, height: 32 }}>
                    <Person />
                  </Avatar>
                  <Typography variant="body2">{currentTicket.assignedModerator.email}</Typography>
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

export default TicketDetailPage
