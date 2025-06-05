import { inngest } from "../client.js";
import User from "../../models/user.js";
import { sendMail } from "../../utils/mailer.js";
export const onUserSignup = inngest.createFunction(
  { id: "on-user-signup", retries: 2 },
  { event: "user/signup" },
  async ({ event, step }) => {
    try {
      const { email } = event.data;
      const user = await step.run("get-user-email", async () => {
        const userObject = await User.findOne({ email });
        if (!userObject) {
          throw new NonRetriableError("User no longer exists in our database");
        }
        return userObject;
      });
      await step.run("send-welcome-email", async () => {
        const subject = "Welcome to the app";
        const message = `Hi ${user.name},
        \n\n
         Thanks for signing up`
         await sendMail(user.email,subject,message)
        const text = `Hello ${user.name},\n\nThank you for signing up for our ticket system. We are excited to have you on board! If you have any questions, feel free to reach out.\n\nBest regards,\nInngest Team`;
        await sendMail(user.email, subject, text);
      });
      return {success:true}
    } catch (error) {
        console.error("Error running step", error.message);
        return {success:false};
    }
  }
);
