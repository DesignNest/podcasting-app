import nodemailer from 'nodemailer';

export async function sendOtpToEmail(email: string, otp: string) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Verify Your Login" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: 'Your OTP for Login',
    html: `<p>Your OTP is <strong>${otp}</strong>. It will expire in 5 minutes.</p>`,
  });
}
