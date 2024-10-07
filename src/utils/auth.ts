import jwt, { JwtPayload } from 'jsonwebtoken';
import secrets from '../secrets';
import { type Users } from '@prisma/client';
import { activationModel, tokenModel } from '../models/auth.model';
import { sendMail } from '.';
import { verifyEmail } from 'src/template';
import { Request } from 'express';
import { v7 as uuid } from 'uuid';

export const authUtils = {
  genToken: (userID: String) => {
    const JWT_SECRET = secrets.JWT_SECRET;
    const JWT_EXPIRY = secrets.JWT_EXPIRY;
    return jwt.sign({ userID }, JWT_SECRET!, {
      expiresIn: JWT_EXPIRY
    });
  },
  genRefreshToken: async (user: Users) => {
    const REFRESH_TOKEN_SECRET = secrets.REFRESH_TOKEN_SECRET;
    const REFRESH_TOKEN_EXPIRY = secrets.REFRESH_TOKEN_EXPIRY;
    const refreshToken = jwt.sign(
      { userID: user.UUID },
      REFRESH_TOKEN_SECRET!,
      {
        expiresIn: REFRESH_TOKEN_EXPIRY
      }
    );
    // To get Expiry Date and Time
    const decode = jwt.decode(refreshToken) as JwtPayload;
    const expiresOn = new Date((decode.exp as number) * 1000);
    const createTokenObject = {
      userID: user.id,
      UUID: user.UUID,
      Token: refreshToken,
      expiresOn,
      isActive: true
    };
    await tokenModel.CreateToken(createTokenObject);
    return refreshToken;
  },
  verifyToken: (token: string, secrets: string): JwtPayload => {
    return jwt.verify(token, secrets) as JwtPayload;
  },
  // decodeToken: (token: string, secrets: string) => {
  //   return jwt.decode(token);
  // }
  verifyEmailUtils: async (req: Request, users: Users) => {
    const expiresOn = new Date();
    expiresOn.setDate(expiresOn.getDate() + 1);
    const userID = users.id;
    const activationCode = uuid();
    let activationData = await activationModel.getCode(userID);
    if (!activationData) {
      activationData = await activationModel.createCode({
        userID,
        activationCode,
        expiresOn
      });
    } else if (activationData!.expiresOn < new Date()) {
      activationData = await activationModel.updateCode({
        userID,
        activationCode,
        expiresOn
      });
    }

    const activationLink = `${req.protocol}://${req.headers.host}/auth/activate/${encodeURI(btoa(activationData!.activationCode))}`;
    const verifyTemplate = verifyEmail({
      username: users.userName,
      activationLink,
      companyName: secrets.APP_NAME
    });
    const emailData = {
      fromName: secrets.APP_NAME,
      toEmail: users.Email,
      subject: secrets.ACTIVATION_EMAIL,
      html: verifyTemplate
    };
    return sendMail(emailData);
  }
};
