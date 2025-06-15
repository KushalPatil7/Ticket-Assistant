"use client"

import { useState } from "react"

interface ToastState {
  open: boolean
  message: string
  severity: "success" | "error" | "warning" | "info"
}

export const useToast = () => {
  const [toast, setToast] = useState<ToastState>({
    open: false,
    message: "",
    severity: "info",
  })

  const showToast = (message: string, severity: ToastState["severity"] = "info") => {
    setToast({
      open: true,
      message,
      severity,
    })
  }

  const hideToast = () => {
    setToast((prev) => ({ ...prev, open: false }))
  }

  return {
    toast,
    showToast,
    hideToast,
  }
}
