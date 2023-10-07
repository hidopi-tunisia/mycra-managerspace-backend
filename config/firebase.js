import admin from "firebase-admin";
import credentials from "./firebase-credentials.js";

admin.initializeApp({
  credential: admin.credential.cert(credentials),
});

export default admin;
