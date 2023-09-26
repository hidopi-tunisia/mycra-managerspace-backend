import { emitter } from "../../helpers/events";
import { send } from "../../helpers/messaging";
import { Topics } from "../constants";
import {
  ConsultantAssignedToProject,
  ConsultantUnassignedFromProject,
} from "./clients-notifications";

emitter.on("consultant-assigned-to-project", (payload) => {
  try {
    const notification = new ConsultantAssignedToProject({
      data: {
        id: payload._id,
        title: "Assigned to project",
        body: "Project - " + payload.projectName,
      },
      topic: `${Topics.CONSULTANTS}~${payload.consultant}`,
    });
    send(notification);
  } catch (error) {
    console.log(error);
  }
});

emitter.on("consultant-unassigned-from-project", (payload) => {
  try {
    const notification = new ConsultantUnassignedFromProject({
      data: {
        id: payload._id,
        title: "Assigned to project",
        body: "Project - " + payload.projectName,
      },
      topic: `${Topics.CONSULTANTS}~${payload.consultant}`,
    });
    send(notification);
  } catch (error) {
    console.log(error);
  }
});
