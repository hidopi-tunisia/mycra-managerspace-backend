import { updateConsultant } from "../../helpers/consultants.js";
import { emitter } from "../../helpers/events.js";
import { send } from "../../helpers/messaging.js";
import { Topics } from "../constants.js";
import {
  CRAApprovedNotification,
  CRARejectedNotification,
  CRARequiredNotification,
} from "./cras-notifications.js";

emitter.on("cra-rejected", (payload) => {
  try {
    let body = "-";
    if (payload.motive) {
      body = payload.motive;
    }
    const notification = new CRARejectedNotification({
      data: {
        title: "CRA rejected",
        body,
        action: {
          type: "cra-rejected",
          meta: {
            id: payload.id,
          },
        },
      },
      topic: `${Topics.CONSULTANTS}~${payload.consultantId}`,
    });
    send(notification);
  } catch (error) {
    console.log(error);
  }
});

emitter.on("cra-approved", (payload) => {
  try {
    let body = "-";
    if (payload.motive) {
      body = payload.motive;
    }
    const notification = new CRAApprovedNotification({
      data: {
        title: "CRA approved",
        body,
        action: {
          type: "cra-approved",
          meta: {
            id: payload.id,
          },
        },
      },
      topic: `${Topics.CONSULTANTS}~${payload.consultantId}`,
    });
    send(notification);
  } catch (error) {
    console.log(error);
  }
});

emitter.on("cra-required", () => {
  try {
    const message = new CRARequiredNotification({
      data: {
        title: "CRA requis",
        body: "Vous devez remplir et soumettre le CRA avant la fin du mois.",
      },
      topic: `${Topics.CONSULTANTS_ALL}`,
    });
    send(message);
  } catch (error) {
    console.log(error);
  }
});
emitter.on("cra-created", async (payload) => {
  try {
    const { id, consultantId } = payload;
    await updateConsultant(consultantId, {
      lastSubmittedCRA: { id, date: new Date().toISOString() },
    });
  } catch (error) {
    console.log(error);
  }
});
