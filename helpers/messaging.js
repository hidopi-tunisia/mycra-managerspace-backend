import admin from "firebase-admin";

const send = async (payload) => {
  return admin.messaging().send(JSON.stringify(payload));
};

export { send };
