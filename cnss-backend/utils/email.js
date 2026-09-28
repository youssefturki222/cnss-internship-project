const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendAccountCreatedEmail = async (toEmail) => {
  if (!toEmail) {
    return;
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: 'CNSS Account Created Successfully',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #0b5fff;">Welcome to CNSS Mobile</h2>
        <p>Hi,</p>
        <p>Your CNSS account has been successfully created.</p>
        <p>You can now sign in using the same email address you registered with and your password.</p>
        <p>Thank you for joining the CNSS Mobile application.</p>
        <p style="margin-top: 24px; font-size: 12px; color: #777;">This is an automated email. Please do not reply.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendAccountCreatedEmail,
};
