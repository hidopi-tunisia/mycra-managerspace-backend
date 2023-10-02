import { Severity } from "./constants";

class BaseNotification {
  data = {
    content_available: "true",
    image: "https://i.ytimg.com/vi/iosNuIdQoy8/maxresdefault.jpg",
    body: "",
    title: "",
    severity: Severity.DEFAULT,
    action: null,
  };
  notification = {
    title: "",
    body: "",
    image: "https://i.ytimg.com/vi/iosNuIdQoy8/maxresdefault.jpg",
  };
  topic;
  /**
   * @param {Object} payload payload
   * @param {Object} payload.data data
   * @param {string} payload.data.title data title
   * @param {string} payload.data.body data body
   * @param {string} payload.notification.body notification body
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
