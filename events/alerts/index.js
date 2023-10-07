import { emitter } from "../../helpers/events.js";
import { sendEmail } from "../../helpers/mailer.js";
import { send } from "../../helpers/messaging.js";
import { getSupervisor } from "../../helpers/supervisors.js";
import { Severity, Topics } from "../constants.js";
import { AlertCreated } from "./alerts-notifications.js";

emitter.on("alert-created", async (payload) => {
  try {
    const notification = new AlertCreated({
      data: {
        title: "Alert created",
        body: "New alert",
        severity: Severity.SUCCESS,
        action: {
          type: "alert-created",
          meta: {
            supervisorId: payload.supervisorId,
            consultantId: payload.consultantId,
            content: payload.content,
          },
        },
      },
      topic: `${Topics.SUPERVISORS}~${payload.supervisorId}`,
    });
    send(notification);
    const supervisor = await getSupervisor(payload.supervisorId);
    const mail = {
      to: supervisor.email,
      subject: "Alert created",
      text: payload.content,
    };
    sendEmail(mail);
  } catch (error) {
    console.log(error);
  }
});
