import type React from "react"
import { Card, CardContent, Skeleton, Box } from "@mui/material"

const TicketSkeleton: React.FC = () => {
  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
          <Skeleton variant="text" width="60%" height={32} />
          <Skeleton variant="rectangular" width={80} height={24} />
        </Box>
        <Skeleton variant="text" width="100%" height={20} />
        <Skeleton variant="text" width="80%" height={20} />
        <Box display="flex" gap={1} mt={2}>
          <Skeleton variant="rectangular" width={60} height={24} />
          <Skeleton variant="rectangular" width={80} height={24} />
          <Skeleton variant="rectangular" width={70} height={24} />
        </Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
          <Skeleton variant="text" width="30%" height={20} />
          <Skeleton variant="rectangular" width={100} height={32} />
        </Box>
      </CardContent>
    </Card>
  )
}

export default TicketSkeleton
