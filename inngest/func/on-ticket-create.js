import { inngest } from "../client.js";
import User from "../../models/user.js";
import { NonRetriableError } from "inngest";
import { sendMail } from "../../utils/mailer.js";
import Ticket from "../../models/ticket.js";
import analyzeTicket from "../../utils/agent.js";

export const onTicketCreated = inngest.createFunction(
  {
    id: "on-ticket-created",
    retries: 2,
  },
  {
    event: "ticket/created",
  },
  async ({ event, step }) => {
    try {
      const { ticketId } = event.data;
      const ticket = await step.run("get-ticket", async () => {
        const ticketObject = await Ticket.findById(ticketId);
        if (!ticketObject) {
          throw new NonRetriableError(
            "Ticket no longer exists in our database"
          );
        }
        return ticketObject;
      });
      await step.run("update-ticket-status", async () => {
        await Ticket.findByIdAndUpdate(ticketId, { status: "TODO" });
      });
      const aiResponse = await analyzeTicket(ticket);
      const relatedskills = await step.run("ai-processing", async () => {
        let skills = [];
        if (aiResponse) {
          await Ticket.findByIdAndUpdate(ticket._id, {
            priority: ["low", "medium", "high"].includes(aiResponse.priority)
              ? "medium"
              : aiResponse.priority,
            helpfulNotes: aiResponse.helpfulNotes,
            status: "IN_PROGRESS",
            relatedskills: aiResponse.relatedskills,
          });
          skills = aiResponse.relatedskills;
        }
        return skills;
      });
      return { success: true };

      const moderator = await step.run("assign-moderator", async () => {
        let user = await User.findOne({
          role: "moderator",
          skills: {
            $elemMatch: {
              $regex: relatedskills.join("|"),
              $options: "i",
            },
          },
        });
        if (!user) {
          user = await User.findOne({
            role: "admin",
          });
        }
        await Ticket.findByIdAndUpdate(ticket._id, {
          assignedTo: user._id || null,
        });
        return user;
      });

      await step.run("send-email-notification", async () => {
        if (moderator) {
          const finalTicket = await Ticket.findById(ticket._id);
          await sendMail(
            moderator.email,
            "Ticket Assigned",
            `A new ticket is assigned to you ${finalTicket.title}`
          );
        }
      });

      return { success: true };
    } catch (error) {
      console.error("Error running step", error.message);
      return { success: false };
    }
  }
);
