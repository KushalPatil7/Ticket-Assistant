"use client"

import type React from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardActions, Typography, Box, Button, Avatar } from "@mui/material"
import { Visibility, Person } from "@mui/icons-material"
import type { Ticket } from "../../types"
import PriorityBadge from "../common/PriorityBadge"
import SkillChip from "../common/SkillChip"

interface TicketCardProps {
  ticket: Ticket
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket }) => {
  const navigate = useNavigate()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "TODO":
        return "text.secondary"
      case "IN_PROGRESS":
        return "warning.main"
      case "DONE":
        return "success.main"
      default:
        return "text.secondary"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
          <Typography variant="h6" component="h2" sx={{ flexGrow: 1, mr: 1 }}>
            {ticket.title}
          </Typography>
          <PriorityBadge priority={ticket.priority} />
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            mb: 2,
          }}
        >
          {ticket.description}
        </Typography>

        <Box display="flex" flexWrap="wrap" gap={0.5} mb={2}>
          {ticket.requiredSkills.slice(0, 3).map((skill) => (
            <SkillChip key={skill} skill={skill} />
          ))}
          {ticket.requiredSkills.length > 3 && (
            <Typography variant="caption" color="text.secondary">
              +{ticket.requiredSkills.length - 3} more
            </Typography>
          )}
        </Box>

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="caption" color="text.secondary">
            Created: {formatDate(ticket.createdAt)}
          </Typography>
          <Typography variant="caption" sx={{ color: getStatusColor(ticket.status), fontWeight: "medium" }}>
            {ticket.status.replace("_", " ")}
          </Typography>
        </Box>

        {ticket.assignedModerator && (
          <Box display="flex" alignItems="center" gap={1}>
            <Avatar sx={{ width: 20, height: 20 }}>
              <Person fontSize="small" />
            </Avatar>
            <Typography variant="caption" color="text.secondary">
              Assigned to {ticket.assignedModerator.email}
            </Typography>
          </Box>
        )}
      </CardContent>

      <CardActions>
        <Button
          size="small"
          startIcon={<Visibility />}
          onClick={() => navigate(`/tickets/${ticket.id}`)}
          aria-label={`View ticket ${ticket.title}`}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  )
}

export default TicketCard
