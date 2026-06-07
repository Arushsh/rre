const https = require('https');

const sendEmail = (options) => {
  return new Promise((resolve, reject) => {
    // We use the SMTP_PASS variable because that is where the Resend API key is saved
    const apiKey = process.env.SMTP_PASS; 
    
    if (!apiKey) {
      console.warn("SMTP_PASS (Resend API Key) is missing. Skipping email.");
      return resolve();
    }

    const postData = JSON.stringify({
      from: `${process.env.FROM_NAME || 'RRE'} <${process.env.FROM_EMAIL}>`,
      to: [options.email],
      subject: options.subject,
      text: options.message
    });

    const reqOptions = {
      hostname: 'api.resend.com',
      path: '/emails',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(reqOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log('Message sent via Resend API instantly!');
          resolve(data);
        } else {
          console.error('Resend API error:', data);
          reject(new Error(`Resend API failed with status ${res.statusCode}`));
        }
      });
    });

    req.on('error', (e) => reject(e));
    req.write(postData);
    req.end();
  });
};

module.exports = sendEmail;
