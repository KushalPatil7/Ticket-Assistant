import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";
import ticketRoutes from "./routes/ticket.routes.js";
import { serve } from "inngest/express";
import { inngest } from "./inngest/client.js";
import { onUserSignUp } from "./inngest/func/on-user-signup.js";
import { onTicketCreated } from "./inngest/func/on-ticket-create.js";
const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());
app.use("/api/auth", userRoutes);
app.use("/api/ticket", ticketRoutes);
app.use(
  "/api/inngest",
  serve({
    client: inngest,
    functions: [onUserSignUp, onTicketCreated],
  })
);

const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
