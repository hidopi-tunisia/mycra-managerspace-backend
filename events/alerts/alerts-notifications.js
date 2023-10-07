import { BaseNotification } from "../base-notification.js";

class AlertCreated extends BaseNotification {
  constructor({ data = {}, notification = {}, topic }) {
    super({ data, notification, topic });
  }
}

export { AlertCreated };

