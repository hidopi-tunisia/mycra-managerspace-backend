import { generateString } from "../utils/generate-string";

class BaseNotification {
  data = {
    content_available: "true",
    image: "https://i.ytimg.com/vi/iosNuIdQoy8/maxresdefault.jpg",
    body: "",
    title: "",
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
