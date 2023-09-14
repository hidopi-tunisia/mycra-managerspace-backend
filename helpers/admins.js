import admin from "firebase-admin";

const createAdmin = async (payload) => {
  return admin.auth().createUser(payload);
};

const generatePasswordResetLink = async (email) => {
  return admin.auth().generatePasswordResetLink(email);
};

const setRole = async (id, role) => {
  return admin.auth().setCustomUserClaims(id, { role });
};

export { createAdmin, generatePasswordResetLink, setRole };
