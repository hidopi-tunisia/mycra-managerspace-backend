import { IMAGE_URL, Severity } from "./constants";

class BaseNotification {
  data = {
    content_available: "true",
    image: IMAGE_URL,
    body: "",
    title: "",
    severity: Severity.DEFAULT,
    action: null,
  };
  notification = {
    title: "",
    body: "",
    image: IMAGE_URL,
  };
  topic;
  /**
   * @param {Object} payload payload
   * @param {Object} payload.data data
   * @param {string} payload.data.title data title
   * @param {string} payload.data.body data body
   * @param {string} payload.notification.body notification body
   * @param {string} payload.topic topic
   */
  constructor({ data = {}, notification = {}, topic }) {
    this.data.title = data.title;
    this.data.body = data.body;
    if (data.action && JSON.stringify(data.action)) {
      this.data.action = JSON.stringify(data.action);
    }
    if (!notification.title) {
      this.notification.title = data.title;
    } else {
      this.notification.title = notification.title;
    }
    if (!notification.body) {
      this.notification.body = data.body;
    } else {
      this.notification.body = notification.body;
    }
    this.topic = topic;
  }
}

export { BaseNotification };
