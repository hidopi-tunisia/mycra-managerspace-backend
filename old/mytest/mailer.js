"use strict";
const nodemailer = require("nodemailer");
const user = "lou.batz1@ethereal.email";
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "lou.batz1@ethereal.email",
    pass: "bz1XGxA4XDnyRCTrrV",
  },
});
const sendEmail = (payload) => {
  return transporter.sendMail({
    from: user, // sender address
    ...payload,
  });
};
const getTestMessageUrl = (info) => {
  return nodemailer.getTestMessageUrl(info);
};

module.exports = {
  sendEmail,
  getTestMessageUrl
};
