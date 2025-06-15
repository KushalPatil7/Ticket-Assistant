import type React from "react"
import { Chip } from "@mui/material"
import { PriorityHigh, PriorityMedium, PriorityLow } from "@mui/icons-material"

interface PriorityBadgeProps {
  priority: "low" | "medium" | "high"
  size?: "small" | "medium"
}

const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, size = "small" }) => {
  const getConfig = () => {
    switch (priority) {
      case "high":
        return {
          label: "High Priority",
          color: "error" as const,
          icon: <PriorityHigh />,
        }
      case "medium":
        return {
          label: "Medium Priority",
          color: "warning" as const,
          icon: <PriorityMedium />,
        }
      case "low":
        return {
          label: "Low Priority",
          color: "success" as const,
          icon: <PriorityLow />,
        }
    }
  }

  const config = getConfig()

  return (
    <Chip
      label={config.label}
      color={config.color}
      size={size}
      icon={config.icon}
      variant="filled"
      aria-label={`Priority level: ${priority}`}
    />
  )
}

export default PriorityBadge
