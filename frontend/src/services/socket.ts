import { io, type Socket } from "socket.io-client"
import { store } from "../store"
import { updateTicketRealtime } from "../store/slices/ticketSlice"

class SocketService {
  private socket: Socket | null = null

  connect() {
    const token = localStorage.getItem("token")
    if (!token) return

    this.socket = io(process.env.REACT_APP_API_BASE_URL || "http://localhost:3001", {
      auth: { token },
    })

    this.socket.on("ticketUpdated", (ticket) => {
      store.dispatch(updateTicketRealtime(ticket))
    })

    this.socket.on("connect", () => {
      console.log("Connected to server")
    })

    this.socket.on("disconnect", () => {
      console.log("Disconnected from server")
    })
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  joinTicketRoom(ticketId: string) {
    if (this.socket) {
      this.socket.emit("joinTicket", ticketId)
    }
  }

  leaveTicketRoom(ticketId: string) {
    if (this.socket) {
      this.socket.emit("leaveTicket", ticketId)
    }
  }
}

export const socketService = new SocketService()
