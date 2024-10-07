const secrets = {
  PORT: process.env.PORT || 3001,
  JWT_SECRET: process.env.JWT_SECRET!,
  JWT_EXPIRY: process.env.JWT_EXPIRY!,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET!,
  REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY!,
  APP_NAME: process.env.APP_NAME!,
  MAILER_HOST: process.env.MAILER_HOST!,
  MAILER_PORT: process.env.MAILER_PORT!,
  MAILER_SECURE: process.env.MAILER_SECURE!,
  MAILER_USER: process.env.MAILER_USER!,
  MAILER_PASSWORD: process.env.MAILER_PASSWORD!,
  MAILER_FROM: process.env.MAILER_FROM!,
  MAILER_FROM_NAME: process.env.MAILER_FROM_NAME!,
  ACTIVATION_EMAIL: process.env.ACTIVATION_EMAIL!,
  FORGOT_PASSWORD_EMAIL: process.env.FORGOT_PASSWORD_EMAIL!
};
export default secrets;
