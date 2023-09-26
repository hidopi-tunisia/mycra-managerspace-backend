import { emitter } from "../../helpers/events";
import { send } from "../../helpers/messaging";
import { Topics } from "../constants";
import {
    CRAApprovedNotification,
    CRARejectedNotification,
    CRARequiredNotification,
} from "./cras-notifications";

emitter.on("cra-rejected", (payload) => {
  try {
    let body = "-";
    if (payload.motive) {
      body = payload.motive;
    }
    const notification = new CRARejectedNotification({
      data: {
        id: payload._id,
        title: "CRA rejected",
        body,
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
        id: payload._id,
        title: "CRA approved",
        body,
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
