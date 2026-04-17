import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  logger: true,
  connectionTimeout: 5000,
  debug: true,
})

transporter.verify((error, success) => {
  if (error) {
    console.log("Email verification error:\n\n")
    console.error(error);
  } else {
    console.log("Email Server is ready to take our messages");
  }
})

export async function forgotPasswordEmail (
  to: string,
  token: string,
  baseUrl: string
) {
  const resetLink = `${baseUrl}/reset-password?token=${token}`

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: 'Password Reset Request',
    html: `
            <p>You requested a password reset. Click the link below to reset your password:</p>
            <a href="${resetLink}">Reset Password</a>
        `
  })
}

export async function sendVerificationEmail(
  to: string,
  code: string
) {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: 'Email Verification Code',
    html: `
      <p>Your verification code is:</p>
      <h2>${code}</h2>
      <p>This code will expire in 10 minutes.</p>
    `
  })
}
