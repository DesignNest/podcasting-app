import nodemailer from 'nodemailer'

export default async function sendVerificationEmail(email: string, username: string) {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const verificationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/verify-email?email=${email}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verify Your Email',
    html: `
      <h2>Hi ${username},</h2>
      <p>Please verify your email by clicking the link below:</p>
      <a href="${verificationLink}">Verify Email</a>
      <p>This link will redirect you to the app after verifying.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
}
