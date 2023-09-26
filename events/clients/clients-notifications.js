import { BaseNotification } from "../base-notification";
import { Severity } from "../constants";

class ConsultantAssignedToProject extends BaseNotification {
  constructor({ data = {}, notification = {}, topic }) {
    super({ data, notification, topic });
    this.data.severity = Severity.SUCCESS;
  }
}

class ConsultantUnassignedFromProject extends BaseNotification {
  constructor({ data = {}, notification = {}, topic }) {
    super({ data, notification, topic });
    this.data.severity = Severity.SUCCESS;
  }
}

export { ConsultantAssignedToProject, ConsultantUnassignedFromProject };
