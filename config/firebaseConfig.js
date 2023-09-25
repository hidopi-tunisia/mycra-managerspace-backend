const admin = require("firebase-admin");
const credentials = require("../mycra-dev-firebase-adminsdk-yd5qy-156c051fb2.json");

admin.initializeApp({
  credential: admin.credential.cert(credentials),
});
module.exports = admin;
