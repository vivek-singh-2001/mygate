// utils/sendSms.js
const twilio = require('twilio');
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Validate phone number format
// function validatePhoneNumber(phoneNumber) {
//   return /^\+\d{10,15}$/.test(phoneNumber);
// }

async function sendSms(phoneNumber, message) {
  // // Validate phone numbers
  // if (!validatePhoneNumber(phoneNumber)) {
  //   throw new Error('Invalid phone number format');
  // }

  try {
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER, // This must be a Twilio number
      to: `+91${phoneNumber}`, // Recipient's phone number
    });
  } catch (error) {
    console.error('Error sending SMS:', error.message);
    throw error;
  }
}

module.exports = sendSms;
