import { createTransport } from 'nodemailer';
import secrets from '../secrets';
import { emailDataType } from '../types';

export const mailer = () => {};

const transport = createTransport({
  host: secrets.MAILER_HOST,
  port: +secrets.MAILER_PORT,
  secure: secrets.MAILER_SECURE == 'true' ? true : false,
  auth: {
    user: secrets.MAILER_USER,
    pass: secrets.MAILER_PASSWORD
  }
});

export const sendMail = async ({
  fromName,
  toEmail,
  subject,
  html
}: emailDataType) => {
  const mailInfo = await transport.sendMail({
    from: `${fromName}<${secrets.MAILER_FROM}>`,
    to: toEmail,
    subject: subject,
    html: html
  });
  return mailInfo;
};
