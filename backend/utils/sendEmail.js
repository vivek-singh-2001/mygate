const nodemailer = require("nodemailer");
const { google } = require("google-auth-library");
const CustomError = require('./CustomError')

// const sendEmail = async (option) => {
//   // CREATE A TRANSPORTER
//   const transporter = nodemailer.createTransport({
//     host: process.env.EMAIL_HOST,
//     port: process.env.EMAIL_PORT,
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASSWORD,
//     },
//   });

//   // DEFINE EMAIL OPTIONS
//   const emailOptions = {  
//     from: "MY GATE  support<support@mygate.com>",
//     to: option.email,
//     subject: option.subject,
//     text: option.message,
//   };
//   await transporter.sendMail(emailOptions);
// };


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "kaal4study@gmail.com",
    pass: process.env.GMAILPASS, 
  },
});


async function sendEmail(to, subject, text) {
  try {
    const mailOptions = {
      from: "MY_GATE <support@mygate.com>",
      to,
      subject,
      text,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Email sent:", result);
    return result;
  } catch (error) {
    throw new CustomError("Error sending email" + error,404);
  }
}

module.exports = sendEmail;
