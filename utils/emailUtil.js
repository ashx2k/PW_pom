const nodemailer = require('nodemailer');
const constants = require('../constants/frameworkConstants');

async function sendEmail(subject, bodyText) {
  if (!constants.EMAIL_USER || !constants.EMAIL_APP_PASSWORD || !constants.EMAIL_TO) {
    console.log('Email config is incomplete. Skipping email notification.');
    return;
  }

  const transporter = nodemailer.createTransport({
    host: constants.EMAIL_HOST,
    port: constants.EMAIL_PORT,
    secure: constants.EMAIL_PORT === 465,
    auth: {
      user: constants.EMAIL_USER,
      pass: constants.EMAIL_APP_PASSWORD
    }
  });

  await transporter.sendMail({
    from: constants.EMAIL_USER,
    to: constants.EMAIL_TO,
    subject,
    text: bodyText
  });

  console.log(`Email sent to ${constants.EMAIL_TO}`);
}

module.exports = { sendEmail };
