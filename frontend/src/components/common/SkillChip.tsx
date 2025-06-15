import type React from "react"
import { Chip } from "@mui/material"
import { Code } from "@mui/icons-material"

interface SkillChipProps {
  skill: string
  onDelete?: () => void
  variant?: "filled" | "outlined"
  size?: "small" | "medium"
}

const SkillChip: React.FC<SkillChipProps> = ({ skill, onDelete, variant = "outlined", size = "small" }) => {
  return (
    <Chip
      label={skill}
      onDelete={onDelete}
      variant={variant}
      size={size}
      icon={<Code />}
      color="primary"
      aria-label={`Skill: ${skill}`}
    />
  )
}

export default SkillChip
