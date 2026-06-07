const twilio = require('twilio');

const sendSMS = async (options) => {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;

    // Since SMS might not be fully configured, add a check
    if (!accountSid || !authToken || !process.env.TWILIO_PHONE_NUMBER || accountSid === 'your_account_sid') {
      console.warn('Twilio credentials not fully configured, skipping SMS');
      return;
    }

    const client = twilio(accountSid, authToken);

    const message = await client.messages.create({
      body: options.message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: options.phone
    });

    console.log('SMS sent: %s', message.sid);
  } catch (error) {
    console.warn('Twilio SMS failed (but email will still send):', error.message);
  }
};

module.exports = sendSMS;
