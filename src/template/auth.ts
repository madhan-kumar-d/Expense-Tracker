export const verifyEmail = ({
  username,
  activationLink,
  companyName
}: {
  username: string;
  activationLink: string;
  companyName: string;
}) => {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Activation Email</title>
  </head>
  <body style="font-family: Arial, sans-serif; color: #333; margin: 0; padding: 0; background-color: #f4f4f4;">
      <div style="max-width: 600px; margin: 20px auto; padding: 20px; background: #ffffff; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; padding-bottom: 20px;">
              <h1 style="margin: 0; color: #4CAF50;">Activate Your Account</h1>
          </div>
          <div style="font-size: 16px; line-height: 1.5;">
              <p>Hi ${username},</p>
              <p>Thank you for signing up! To complete your registration, please activate your account by clicking the button below:</p>
              <a href="${activationLink}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #ffffff; background-color: #4CAF50; text-decoration: none; border-radius: 5px; margin: 20px 0;">Activate Account</a>
              <p>If you did not create an account, please ignore this email.</p>
              <p>Best regards,<br>The ${companyName} Team</p>
          </div>
          <div style="font-size: 12px; color: #888; text-align: center; padding-top: 20px;">
              <p>&copy; ${new Date().getFullYear()} ${companyName}. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
  `;
};

export const resetPassword = ({
  resetCode,
  companyName
}: {
  resetCode: string;
  companyName: string;
}) => {
  return `<!DOCTYPE html>
    <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
      </head>
      <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 0; padding: 20px;">

          <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
              <h2 style="color: #333;">Forgot Your Password?</h2>
              <p style="color: #555;">No worries! Click the link below to reset your password:</p>
              
              <div style="background-color: #f1f1f1; padding: 10px; border-radius: 5px; font-family: monospace; color: #333; margin: 20px 0; text-align: center;">
                ${resetCode}
              </div>
              <p style="color: #555;">If you didn't request a password reset, please ignore this email.</p>
              <p style="color: #777; font-size: 12px;">Thank you,<br>Your Company Team</p>
              <p style="color: #777; font-size: 12px; margin-top: 20px;text-align:center">&copy; ${new Date().getFullYear()} ${companyName}. All rights reserved.</p>
          </div>

      </body>
    </html>`;
};
