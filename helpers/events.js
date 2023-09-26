const emitter = {};

emitter.listeners = {};

emitter.on = function (eventName, callback) {
  if (!this.listeners[eventName]) {
    this.listeners[eventName] = [];
  }
  this.listeners[eventName].push(callback);
};

emitter.emit = function (eventName, eventData) {
  const eventListeners = this.listeners[eventName];
  if (eventListeners) {
    eventListeners.forEach((callback) => {
      callback(eventData);
    });
  }
};

export { emitter };
