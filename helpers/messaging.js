import admin from "firebase-admin";

const send = async (payload) => {
  return admin.messaging().send(payload);
};

export { send };
