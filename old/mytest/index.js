var express = require("express");
var admin = require("firebase-admin");
const app = express();
app.use(express.json());
const { sendEmail } = require("./mailer");
const { generateHTML } = require("./template");
const port = 9999;

const credentials = require("../mycra-dev-firebase-adminsdk-yd5qy-156c051fb2.json");
const { getTestMessageUrl } = require("nodemailer");

admin.initializeApp({
  credential: admin.credential.cert(credentials),
  databaseURL: "https://jnfdjvnojnf.firebaseio.com",
});

app.route("/").get((req, res) => {});

app.route("/users").post((req, res) => {
  admin
    .auth()
    .createUser(req.body)
    .then(async (user) => {
      await admin.auth().setCustomUserClaims(user.uid, { role: "consultant", manager: "" });

      admin
        .auth()
        .generatePasswordResetLink(req.body.email)
        .then((link) => {
          const payload = {
            to: req.body.email, // list of receivers
            subject: "Reset your password", // Subject line
            html: generateHTML({ email: req.body.email, link }), // html body
          };
          sendEmail(payload)
            .then((info) => {
              const url = getTestMessageUrl(info);
              res.status(200).send({ ...info, previewUrl: url });
            })
            .catch((error) => {
              console.log(error);
              res.status(500).send(error);
            });
        })
        .catch((error) => {
          res.status(500).send({ error });
        });
    })
    .catch((error) => {
      res.status(500).send({ error });
    });
});

app.route("/notifications").post((req, res) => {
  admin
    .messaging()
    .send(req.body)
    .then((response) => {
      // Response is a message ID string.
      res.status(200).send({ response });
    })
    .catch((error) => {
      res.status(500).send({ error });
    });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
