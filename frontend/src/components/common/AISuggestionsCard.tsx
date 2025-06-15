"use client"

import type React from "react"
import { useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Box,
  CircularProgress,
} from "@mui/material"
import { ExpandMore, Psychology, Lightbulb } from "@mui/icons-material"
import type { AIInsights } from "../../types"

interface AISuggestionsCardProps {
  insights?: AIInsights
}

const AISuggestionsCard: React.FC<AISuggestionsCardProps> = ({ insights }) => {
  const [expanded, setExpanded] = useState(false)

  if (!insights) return null

  return (
    <Card>
      <CardHeader
        avatar={<Psychology color="primary" />}
        title="AI Insights"
        action={
          <IconButton
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
            aria-label="show AI suggestions"
            sx={{
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.3s",
            }}
          >
            <ExpandMore />
          </IconButton>
        }
      />
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          {insights.isProcessing ? (
            <Box display="flex" alignItems="center" gap={2}>
              <CircularProgress size={20} />
              <Typography variant="body2" color="text.secondary">
                AI is analyzing this ticket...
              </Typography>
            </Box>
          ) : (
            <>
              <Typography variant="h6" gutterBottom>
                <Lightbulb sx={{ mr: 1, verticalAlign: "middle" }} />
                Suggestions
              </Typography>
              <List dense>
                {insights.suggestions.map((suggestion, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={suggestion} primaryTypographyProps={{ variant: "body2" }} />
                  </ListItem>
                ))}
              </List>
              <Typography variant="body2" color="text.secondary" mt={2}>
                Estimated resolution time: {insights.estimatedResolutionTime} hours
              </Typography>
            </>
          )}
        </CardContent>
      </Collapse>
    </Card>
  )
}

export default AISuggestionsCard
