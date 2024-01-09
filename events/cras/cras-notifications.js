import { BaseNotification } from "../base-notification.js";
import { Severity } from "../constants.js";

class CRARejectedNotification extends BaseNotification {
  constructor({ data = {}, notification = {}, topic }) {
    super({ data, notification, topic });
    this.data.severity = Severity.DANGER;
    this.data.action = JSON.stringify({
      type: "cra-rejected"
    })
  }
}

class CRAApprovedNotification extends BaseNotification {
  constructor({ data = {}, notification = {}, topic }) {
    super({ data, notification, topic });
    this.data.severity = Severity.SUCCESS;
    this.data.action = JSON.stringify({
      type: "cra-approved"
    })
  }
}

class CRARequiredNotification extends BaseNotification {
  constructor({ data = {}, notification = {}, topic }) {
    super({ data, notification, topic });
    this.data.severity = Severity.WARNING;
    this.data.action = JSON.stringify({
      type: "cra-required"
    })
  }
}

export {
  CRARejectedNotification,
  CRAApprovedNotification,
  CRARequiredNotification,
};
