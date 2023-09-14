import admin from "firebase-admin";

const createUser = async (payload) => {
  return admin.auth().createUser(payload);
};

const generatePasswordResetLink = async (email) => {
  return admin.auth().generatePasswordResetLink(email);
};

const setRole = async (id, role) => {
  return admin.auth().setCustomUserClaims(id, { role });
};

export { createUser, generatePasswordResetLink, setRole };
