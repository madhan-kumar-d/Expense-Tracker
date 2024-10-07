import { Prisma, PrismaClient } from '@prisma/client';
import { prismaClient } from '..';
import { CreateToken, CreateUser, createActivation } from '../types';

export const authModel = {
  getUserByEmailRegister: (Email: string) => {
    return prismaClient.users.findFirst({
      where: {
        Email
      }
    });
  },
  getUserByEmail: (Email: string) => {
    return prismaClient.users.findFirst({
      where: {
        Email,
        isActive: true
      }
    });
  },
  createUser: async (formDate: CreateUser) => {
    const { userName, Email, password, dob } = formDate;
    return prismaClient.users.create({
      data: {
        Email,
        userName,
        password,
        dob
      }
    });
  },

  getUserByID: (id: number) => {
    return prismaClient.users.findUnique({
      where: {
        id,
        isActive: true
      }
    });
  },

  getUserByUserID: (UUID: string, fields?: Array<keyof Prisma.UsersSelect>) => {
    const field: Partial<Prisma.UsersSelect> = {};

    if (fields && fields.length > 0) {
      fields.forEach((key) => {
        field[key] = true;
      });
    }
    return prismaClient.users.findUnique({
      where: {
        UUID,
        isActive: true
      },
      select: Object.keys(field).length > 0 ? field : undefined
    });
  },

  // updateUser: (userData) => {}
  updatePassword: (password: string, id: number) => {
    return prismaClient.users.update({
      where: {
        id
      },
      data: {
        password
      }
    });
  },
  activateUser: (id: number) => {
    return prismaClient.users.update({
      where: {
        id
      },
      data: {
        isVerified: true,
        isActive: true
      }
    });
  }
};

export const tokenModel = {
  CreateToken: ({ userID, UUID, Token, expiresOn, isActive }: CreateToken) => {
    return prismaClient.tokens.create({
      data: {
        userID,
        UUID,
        Token,
        expiresOn,
        isActive
      }
    });
  },

  findToken: (Token: string, UUID: string) => {
    return prismaClient.tokens.findFirst({
      where: {
        Token,
        UUID
      }
    });
  },

  inActiveToken: (id: number) => {
    return prismaClient.tokens.update({
      data: {
        isActive: false
      },
      where: {
        id
      },
      select: {
        id: true
      }
    });
  },
  deleteTokenById: (id: number) => {
    return prismaClient.tokens.delete({
      where: {
        id
      }
    });
  },

  deleteToken: (UUID: string) => {
    return prismaClient.tokens.deleteMany({
      where: {
        UUID
      }
    });
  },

  deleteUserToken: (userID: number) => {
    return prismaClient.tokens.deleteMany({
      where: {
        userID
      }
    });
  }
};

export const activationModel = {
  createCode: ({ userID, expiresOn, activationCode }: createActivation) => {
    return prismaClient.activation.create({
      data: {
        userID,
        expiresOn,
        activationCode
      }
    });
  },
  findVerificationCode: (activationCode: string) => {
    return prismaClient.activation.findUnique({
      where: {
        activationCode
      }
    });
  },
  verifyCode: (id: number) => {
    return prismaClient.activation.findUnique({
      where: {
        id,
        expiresOn: {
          gte: new Date().toISOString()
        },
        isUsed: false
      }
    });
  },
  getCode: (userID: number) => {
    return prismaClient.activation.findUnique({
      where: {
        userID
      }
    });
  },
  updateCode: ({ userID, expiresOn, activationCode }: createActivation) => {
    return prismaClient.activation.update({
      where: {
        userID
      },
      data: {
        expiresOn,
        activationCode
      }
    });
  },
  activateCode: (id: number) => {
    return prismaClient.activation.update({
      where: {
        id
      },
      data: {
        isUsed: true
      }
    });
  }
};
export const resetPasswordModel = {
  create: (code: string, userID: number) => {
    const expiresOn = new Date();
    expiresOn.setMinutes(expiresOn.getMinutes() + 15);

    return prismaClient.forgotPassword.create({
      data: {
        code,
        expiresOn: expiresOn,
        userID
      }
    });
  },
  getAgainstCode: (code: string, userID: number) => {
    return prismaClient.forgotPassword.findFirst({
      where: {
        code,
        userID,
        isUsed: false,
        expiresOn: {
          gte: new Date()
        }
      }
    });
  },
  updateUsed: (id: number) => {
    return prismaClient.forgotPassword.update({
      where: {
        id
      },
      data: {
        isUsed: true
      }
    });
  }
};
