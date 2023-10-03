import { emitter } from "../../helpers/events";
import { send } from "../../helpers/messaging";
import { Severity, Topics } from "../constants";
import {
  ConsultantAssignedToProject,
  ConsultantUnassignedFromProject,
} from "./clients-notifications";

emitter.on("consultant-assigned-to-project", (payload) => {
  try {
    const notification = new ConsultantAssignedToProject({
      data: {
        title: "Assigned to project",
        body: "Project - " + payload.projectName,
        severity: Severity.SUCCESS,
        action: {
          type: "consultant-assigned-to-project",
          meta: {
            projectId: payload.projectId,
            consultantId: payload.consultantId,
            clientId: payload.clientId,
            projectName: payload.projectName,
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

emitter.on("consultant-unassigned-from-project", (payload) => {
  try {
    const notification = new ConsultantUnassignedFromProject({
      data: {
        title: "Unassigned from project",
        body: "Project - " + payload.projectName,
        severity: Severity.SUCCESS,
        action: {
          type: "consultant-unassigned-from-project",
          meta: {
            projectId: payload.projectId,
            consultantId: payload.consultantId,
            clientId: payload.clientId,
            projectName: payload.projectName,
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
