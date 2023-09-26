import { BaseNotification } from "../base-notification";
import { Severity } from "../constants";

class ConsultantAssignedToProject extends BaseNotification {
  constructor({ data = {}, notification = {}, topic }) {
    super({ data, notification, topic });
    this.data.severity = Severity.INFO;
  }
}

class ConsultantUnassignedFromProject extends BaseNotification {
  constructor({ data = {}, notification = {}, topic }) {
    super({ data, notification, topic });
    this.data.severity = Severity.INFO;
  }
}

export { ConsultantAssignedToProject, ConsultantUnassignedFromProject };
