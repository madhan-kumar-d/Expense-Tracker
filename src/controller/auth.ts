import { NextFunction, Request, Response } from 'express';
import {
  activationModel,
  authModel,
  resetPasswordModel,
  tokenModel
} from '../models';
import { ConflictException, InvalidInput } from '../exception';
import { customErrorCode, statusCode } from '../exception/root';
import { compare, hash } from 'bcrypt';
import { authUtils, commonUtil, sendMail } from '../utils';
import secrets from '../secrets';
import { unauthorizedException } from '../exception/unauthorized';
import { resetPassword } from '../template';

export const authController = {
  register: async (req: Request, res: Response, next: NextFunction) => {
    const { email: Email, userName, password, dob } = req.body;
    const userExist = await authModel.getUserByEmailRegister(Email);
    if (userExist) {
      throw new ConflictException(customErrorCode.UserAlreadyExist, '');
    }
    const salt = 12;
    const hashedPassword = await hash(password, salt);
    const createContent = {
      userName,
      Email,
      password: hashedPassword,
      dob: new Date(dob)
    };
    const user = await authModel.createUser(createContent);
    await authUtils.verifyEmailUtils(req, user);
    res
      .json({
        data: 'Please Activate your Email to Login into your account',
        status: 'Success'
      })
      .status(statusCode.Created);
  },

  login: async (req: Request, res: Response) => {
    const { email: Email, password } = req.body;
    const user = await authModel.getUserByEmail(Email);
    if (!user) {
      // check user is Blocked or Inactive
      const userExist = await authModel.getUserByEmailRegister(Email);
      if (!userExist) {
        throw new InvalidInput(
          customErrorCode.InvalidCredentials,
          'Invalid Credentials'
        );
      }
      if (!userExist.isVerified && !userExist.isActive) {
        await authUtils.verifyEmailUtils(req, userExist);
        return res.status(statusCode.Unauthorized).json({
          data: 'Please Activate your Email to Login into your account',
          status: 'Failure'
        });
      }
      // for inactive users or blocked users
      throw new InvalidInput(
        customErrorCode.InvalidCredentials,
        'Invalid Credentials'
      );
    }

    const userDetails = await authModel.getUserByID(user.id); // Prevent SQL Injection
    if (!userDetails) {
      throw new InvalidInput(
        customErrorCode.InvalidCredentials,
        'Invalid Credentials'
      );
    }

    // validate password
    const match = await compare(password, userDetails!.password);
    if (!match) {
      throw new InvalidInput(
        customErrorCode.InvalidCredentials,
        'Invalid Credentials'
      );
    }
    const accessToken = await authUtils.genToken(userDetails!.UUID);
    const refreshToken = await authUtils.genRefreshToken(userDetails!);
    res
      .json({
        data: { accessToken: accessToken, refreshToken: refreshToken },
        status: 'Success'
      })
      .status(statusCode.OK);
  },

  token: async (req: Request, res: Response) => {
    const { token }: { token: string } = req.body;
    const verifyToken = authUtils.verifyToken(
      token,
      secrets.REFRESH_TOKEN_SECRET!
    );
    if (!verifyToken.userID) {
      throw new unauthorizedException(customErrorCode.InvalidToken);
    }
    // find old Token
    const tokenDetails = await tokenModel.findToken(token, verifyToken.userID);
    if (!tokenDetails) {
      throw new unauthorizedException(customErrorCode.InvalidToken);
    }
    // unusual activity detected
    if (tokenDetails.isActive === false) {
      // Delete All Tokens against the users to prevent data leakage
      await tokenModel.deleteToken(tokenDetails.UUID);
      throw new unauthorizedException(customErrorCode.InvalidCredentials);
    }
    // Inactive Old Token
    await tokenModel.inActiveToken(tokenDetails.id);
    // Generate New Token
    const userDetails = await authModel.getUserByID(tokenDetails.id); // Prevent SQL Injection
    if (!userDetails) {
      throw new InvalidInput(
        customErrorCode.InvalidCredentials,
        'Invalid Credentials'
      );
    }
    const accessToken = await authUtils.genToken(userDetails!.UUID);
    const refreshToken = await authUtils.genRefreshToken(userDetails!);
    res
      .json({
        data: { accessToken: accessToken, refreshToken: refreshToken },
        status: 'Success'
      })
      .status(statusCode.OK);
  },

  me: async (req: Request, res: Response) => {
    const { userID, Email, dob, createdAt, isVerified } = req.users;
    res
      .json({
        data: {
          userID,
          Email,
          dob,
          createdAt,
          isVerified
        },
        status: 'Success'
      })
      .status(statusCode.OK);
  },

  changePassword: async (req: Request, res: Response) => {
    const { oldPassword, password } = req.body;
    const userDetails = await authModel.getUserByUserID(req.users.userID);
    const match = await compare(oldPassword, userDetails!.password);
    if (!match) {
      return res
        .json({
          message: 'Password Mismatch ',
          status: 'Failure'
        })
        .status(statusCode.UnprocessableEntity);
    }
    const salt = 12;
    const hashedPassword = await hash(password, salt);
    const users = await authModel.updatePassword(
      hashedPassword,
      userDetails!.id
    );
    const { UUID: userID, Email, dob, createdAt, isVerified } = users;
    res
      .json({
        data: {
          userID,
          Email,
          dob,
          createdAt,
          isVerified
        },
        status: 'Success'
      })
      .status(statusCode.OK);
  },

  activate: async (req: Request, res: Response) => {
    const { code: activationCode } = req.params;
    const decodeCode = decodeURI(atob(activationCode));
    const findCode = await activationModel.findVerificationCode(decodeCode);
    if (!findCode) {
      throw new InvalidInput(customErrorCode.InvalidInput, 'Invalid Token');
    }
    const isActive = await activationModel.verifyCode(findCode.id);
    console.log(isActive);
    if (!isActive) {
      if (findCode.isUsed) {
        return res.redirect(
          '/login?message=Account is Already Activated, Please Login'
        );
        // res.status(statusCode.OK).json({
        //   message: 'Account is Already Activated, Please Login',
        //   status: 'Failure'
        // });
      }
      throw new InvalidInput(customErrorCode.InvalidInput, 'Token Expired');
    }
    await activationModel.activateCode(isActive.id);
    await authModel.activateUser(isActive.userID);
    res.redirect(
      '/login?message=Account is Activated successfully, Please Login'
    );
    // res.status(statusCode.OK).json({
    //   message: 'Account is Activated successfully, Please Login',
    //   status: 'Success'
    // });
  },
  forgotPassword: async (req: Request, res: Response) => {
    const { email } = req.body;
    const checkUsers = await authModel.getUserByEmail(email);
    if (checkUsers) {
      const resetCode = commonUtil.generateRandomInt().toString();
      await resetPasswordModel.create(resetCode, checkUsers.id);
      const companyName = secrets.APP_NAME;
      const template = resetPassword({ resetCode, companyName });
      const emailData = {
        fromName: secrets.APP_NAME,
        toEmail: checkUsers.Email,
        subject: secrets.FORGOT_PASSWORD_EMAIL,
        html: template
      };
      sendMail(emailData);
    }
    res.status(statusCode.OK).json({
      message: 'Instruction is shared to Email',
      status: 'success'
    });
  },
  updatePasswordFB: async (req: Request, res: Response) => {
    const { email, resetCode, password } = req.body;
    const checkUsers = await authModel.getUserByEmail(email);
    if (checkUsers) {
      const userID = checkUsers.id;
      const checkCode = await resetPasswordModel.getAgainstCode(
        resetCode,
        userID
      );
      if (checkCode) {
        const salt = 12;
        const hashedPassword = await hash(password, salt);
        await resetPasswordModel.updateUsed(checkCode.id);
        await authModel.updatePassword(hashedPassword, userID);
        return res.status(statusCode.OK).json({
          message: 'Password Reset Successfully, Please login',
          status: 'Success'
        });
      }
    }
    res.status(statusCode.OK).json({
      message: 'Invalid Code',
      status: 'Failure'
    });
  },
  logout: async (req: Request, res: Response) => {
    const { token } = req.body;
    const verifyToken = authUtils.verifyToken(
      token,
      secrets.REFRESH_TOKEN_SECRET!
    );
    if (!verifyToken.userID) {
      throw new unauthorizedException(customErrorCode.InvalidToken);
    }
    // find old Token
    const tokenDetails = await tokenModel.findToken(token, verifyToken.userID);
    if (!tokenDetails) {
      throw new unauthorizedException(customErrorCode.InvalidToken);
    }
    await tokenModel.deleteTokenById(tokenDetails.id);
    res.status(statusCode.OK).json({
      message: 'Logged out successfully',
      status: 'Success'
    });
  },
  logoutAll: async (req: Request, res: Response) => {
    const { id } = req.users;
    await tokenModel.deleteUserToken(id);
    res.status(statusCode.OK).json({
      message: 'Logged out successfully',
      status: 'Success'
    });
  }
};
