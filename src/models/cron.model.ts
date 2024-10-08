import { prismaClient } from '../';

export const cronModel = {
  removeToken: () => {
    return prismaClient.tokens.deleteMany({
      where: {
        expiresOn: {
          lt: new Date()
        }
      }
    });
  },
  removeForgotPassword: () => {
    return prismaClient.forgotPassword.deleteMany({
      where: {
        expiresOn: {
          lt: new Date()
        },
        isUsed: false
      }
    });
  }
};
