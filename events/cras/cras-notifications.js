import { BaseNotification } from "../base-notification.js";
import { Severity } from "../constants.js";

class CRARejectedNotification extends BaseNotification {
  constructor({ data = {}, notification = {}, topic }) {
    super({ data, notification, topic });
    this.data.severity = Severity.DANGER;
  }
}

class CRAApprovedNotification extends BaseNotification {
  constructor({ data = {}, notification = {}, topic }) {
    super({ data, notification, topic });
    this.data.severity = Severity.SUCCESS;
  }
}

class CRARequiredNotification extends BaseNotification {
  constructor({ data = {}, notification = {}, topic }) {
    super({ data, notification, topic });
    this.data.severity = Severity.WARNING;
  }
}

export {
  CRARejectedNotification,
  CRAApprovedNotification,
  CRARequiredNotification,
};
