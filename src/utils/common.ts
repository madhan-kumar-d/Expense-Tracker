import { randomInt } from 'crypto';

export const commonUtil = {
  generateRandomInt: () => {
    return randomInt(100000, 999999);
  },
  getMidNightTimeStart: (date: Date) => {
    date.setUTCHours(0, 0, 0, 0);
    return date;
  },
  getMidNightTimeEnd: (date: Date) => {
    date.setUTCHours(23, 59, 59, 999);
    return date;
  }
};
