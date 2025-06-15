import type React from "react"
import { Box, Stepper, Step, StepLabel, StepConnector } from "@mui/material"
import { styled } from "@mui/material/styles"

const CustomConnector = styled(StepConnector)(({ theme }) => ({
  "&.Mui-active": {
    "& .MuiStepConnector-line": {
      borderColor: theme.palette.primary.main,
    },
  },
  "&.Mui-completed": {
    "& .MuiStepConnector-line": {
      borderColor: theme.palette.success.main,
    },
  },
}))

interface StatusProgressProps {
  currentStatus: "TODO" | "IN_PROGRESS" | "DONE"
}

const StatusProgress: React.FC<StatusProgressProps> = ({ currentStatus }) => {
  const steps = ["TODO", "IN_PROGRESS", "DONE"]
  const activeStep = steps.indexOf(currentStatus)

  const getStepLabel = (step: string) => {
    switch (step) {
      case "TODO":
        return "To Do"
      case "IN_PROGRESS":
        return "In Progress"
      case "DONE":
        return "Done"
      default:
        return step
    }
  }

  return (
    <Box sx={{ width: "100%", mt: 2 }}>
      <Stepper activeStep={activeStep} connector={<CustomConnector />}>
        {steps.map((step) => (
          <Step key={step}>
            <StepLabel>{getStepLabel(step)}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  )
}

export default StatusProgress
