import nodemailer from "nodemailer";

const { EMAIL_USER, EMAIL_PASSWORD, EMAIL_HOST, EMAIL_PORT } = process.env;

const user = EMAIL_USER;

const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
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

export { sendEmail, getTestMessageUrl };
