import { BaseNotification } from "../base-notification";

class AlertCreated extends BaseNotification {
  constructor({ data = {}, notification = {}, topic }) {
    super({ data, notification, topic });
  }
}

export { AlertCreated };

