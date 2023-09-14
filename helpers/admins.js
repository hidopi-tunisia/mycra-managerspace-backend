import admin from "firebase-admin";

const createAdmin = async (payload) => {
  const record = admin.auth().createUser(payload);
  return record;
};

const setRole = async (id, role) => {
  const record = admin.auth().setCustomUserClaims(id, { role });
  return record;
};

export { createAdmin, setRole };
