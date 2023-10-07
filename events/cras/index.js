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
    const notification = new CRARequiredNotification({
      data: {
        title: "CRA required",
        body: "You need to fill submit the CRA before the end of the month.",
      },
      topic: `${Topics.CONSULTANTS_ALL}`,
    });
    send(notification);
  } catch (error) {
    console.log(error);
  }
});
