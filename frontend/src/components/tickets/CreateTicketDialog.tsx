"use client"

import type React from "react"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Alert } from "@mui/material"
import type { AppDispatch } from "../../store"
import { createTicket } from "../../store/slices/ticketSlice"

interface CreateTicketDialogProps {
  open: boolean
  onClose: () => void
}

const CreateTicketDialog: React.FC<CreateTicketDialogProps> = ({ open, onClose }) => {
  const dispatch = useDispatch<AppDispatch>()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim() || !formData.description.trim()) {
      setError("Please fill in all fields")
      return
    }

    setLoading(true)
    try {
      await dispatch(createTicket(formData)).unwrap()
      setFormData({ title: "", description: "" })
      onClose()
    } catch (err: any) {
      setError(err.message || "Failed to create ticket")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({ title: "", description: "" })
    setError("")
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Ticket</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Title"
            fullWidth
            variant="outlined"
            value={formData.title}
            onChange={handleChange}
            required
            aria-label="Ticket title"
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={formData.description}
            onChange={handleChange}
            required
            aria-label="Ticket description"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? "Creating..." : "Create Ticket"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default CreateTicketDialog
