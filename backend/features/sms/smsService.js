const smsRepository = require("./smsRepository");
const { User } = require("../../config/connection").db;
const CustomError = require("../../utils/CustomError");
const signToken = require("../../utils/signToken");
const validator = require("validator");
const twilio = require("twilio");
const mailgun = require("mailgun-js");
const nodemailer = require("nodemailer");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const mg = mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
});

const transporter = nodemailer.createTransport({
  service: "gmail", // Use 'gmail' for Gmail
  auth: {
    user: "dhruvilmodi0325@gmail.com", // Your Gmail address
    pass: "vdtd ftfy slsz hgjs", // Your Gmail password or App password
  },
});

const getContactType = (contact) => {
  if (validator.isMobilePhone(contact, "en-IN")) {
    return "number";
  } else if (validator.isEmail(contact)) {
    return "email";
  } else {
    throw new CustomError("Enter a valid phone number or email id", 404);
  }
};

exports.sendOtp = async (contact) => {
  const contactType = getContactType(contact);
  const user = await smsRepository.findUserByContact(contact, contactType);
  if (!user) {
    throw new CustomError(
      "Phone number or Email is not linked with any mygate account",
      404
    );
  }
  const otp = Math.floor(100000 + Math.random() * 900000);
  await smsRepository.saveOtp(contact, contactType, otp);

  if (contactType === "number") {
    // Send OTP via Twilio (SMS)
    await client.messages.create({
      body: `Your OTP is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+91${contact}`,
    });
  } else {
    // Send OTP via Mailgun (Email)

    // const data = {
    //   from: "YourApp <no-reply@sandboxa97e32b88e644890aef1770a472d6cf0.mailgun.org>",
    //   to: contact,
    //   subject: "Your OTP Code",
    //   text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
    // };
    // await mg.messages().send(data);

    const mailOptions = {
      from: `"Mygate" <${process.env.GMAIL_USER}>`, // sender address
      to: contact,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);
  }
};

exports.verifyOtp = async (contact, otp) => {
  const contactType = getContactType(contact);
  const user = await smsRepository.verifyOtp(contact, contactType, otp);

  if (!user) {
    throw new CustomError("Invalid or expired OTP", 400);
  }

  const token = signToken(user.id, user.email);

  return token;
};
