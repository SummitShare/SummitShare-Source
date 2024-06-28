import nodemailer from 'nodemailer';

export const emailServer = process.env.SEMAIL;

const password = process.env.S_APP_PASSWORD;

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: emailServer,
    pass: password,
  },
});
// export const mailOptions = {
//     from: emailServer,
//     to: newemail,
// }
