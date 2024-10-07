import { prismaClient } from 'src';
import { type getTransactionsQuery, type transactionsType } from 'src/types';
import { commonUtil } from 'src/utils';

export const categoryModel = {
  get: (userID: number) => {
    return prismaClient.categories.findMany({
      where: {
        userID
      }
    });
  },
  find: (categoryName: string, userID: number) => {
    return prismaClient.categories.findFirst({
      where: {
        categoryName,
        userID
      }
    });
  },
  findByID: (id: number, userID: number) => {
    return prismaClient.categories.findUnique({
      where: {
        id,
        userID
      }
    });
  },
  findNotID: (id: number, categoryName: string, userID: number) => {
    return prismaClient.categories.findFirst({
      where: {
        NOT: {
          id
        },
        categoryName,
        userID
      }
    });
  },
  create: (categoryName: string, userID: number) => {
    return prismaClient.categories.create({
      data: {
        categoryName,
        userID
      }
    });
  },
  update: (id: number, categoryName: string) => {
    return prismaClient.categories.update({
      data: {
        categoryName
      },
      where: {
        id
      }
    });
  },
  delete: (id: number) => {
    return prismaClient.categories.delete({
      where: {
        id
      }
    });
  }
};

export const transactionsModel = {
  verify: (id: number) => {
    return prismaClient.categories.findUnique({
      where: {
        id
      },
      include: {
        Transactions: true
      }
    });
  },
  // converted to function since arrow function is not supported this
  create: async function (transactions: transactionsType) {
    const transactionDate = new Date(transactions.date);
    await prismaClient.transactions.create({
      data: {
        amount: transactions.amount,
        categoryID: transactions.categoryID,
        userID: transactions.userID,
        type: transactions.type,
        date: transactionDate
      }
    });
    this.addTransactions(transactions);
  },
  update: async function (id: number, transactions: transactionsType) {
    const { userID, date, amount, categoryID, type } = transactions;
    const existTransactions = await this.findTransactionsByID(id, userID);
    const amountInt = +existTransactions!.amount;
    await this.minusTransactions(userID, date, amountInt, categoryID, type);
    const transactionDate = new Date(transactions.date);
    const transactionsData = await prismaClient.transactions.update({
      data: {
        amount: transactions.amount,
        categoryID: transactions.categoryID,
        userID: transactions.userID,
        type: transactions.type,
        date: transactionDate
      },
      where: {
        id
      }
    });
    await this.addTransactions(transactions);
    return transactionsData;
  },
  delete: async function (
    id: number,
    userID: number,
    date: Date,
    amount: number,
    categoryID: number,
    type: transactionsType['type']
  ) {
    await this.minusTransactions(userID, date, amount, categoryID, type);
    return prismaClient.transactions.delete({
      where: {
        id
      }
    });
  },
  findTransactionsByID: async (id: number, userID: number) => {
    return prismaClient.transactions.findUnique({
      where: {
        id,
        userID
      }
    });
  },
  addTransactions: async function (transactions: transactionsType) {
    console.log('test', transactions);
    const transactionDate = new Date(transactions.date);
    const dailyDate = commonUtil.getMidNightTimeStart(transactionDate);
    const existDaily = await this.findDailyTransactions(
      dailyDate,
      transactions.userID,
      transactions.type
    );
    console.log(existDaily, 'Testing');
    if (existDaily) {
      await prismaClient.dailyTransactions.update({
        where: {
          id: existDaily.id
        },
        data: {
          amount: +existDaily.amount + +transactions.amount
        }
      });
    } else {
      await prismaClient.dailyTransactions.create({
        data: {
          categoryID: transactions.categoryID,
          amount: transactions.amount,
          userID: transactions.userID,
          type: transactions.type,
          date: dailyDate
        }
      });
    }

    let monthYear = dailyDate;
    monthYear.setDate(1);

    const existMonth = await this.findMonthlyTransactions(
      monthYear,
      transactions.userID,
      transactions.type
    );
    if (existMonth) {
      await prismaClient.monthlyTransactions.update({
        where: {
          id: existMonth.id
        },
        data: {
          amount: +existMonth.amount + +transactions.amount
        }
      });
    } else {
      await prismaClient.monthlyTransactions.create({
        data: {
          categoryID: transactions.categoryID,
          amount: transactions.amount,
          userID: transactions.userID,
          type: transactions.type,
          monthYear
        }
      });
    }
  },
  minusTransactions: async function (
    userID: number,
    date: Date,
    amount: number,
    categoryID: number,
    type: transactionsType['type']
  ) {
    const dailyDate = commonUtil.getMidNightTimeStart(new Date(date));
    const monthYear = new Date(dailyDate);
    monthYear.setDate(1);
    const getDaily = await prismaClient.dailyTransactions.findFirst({
      where: {
        date: dailyDate,
        type,
        userID,
        categoryID
      }
    });
    console.log(getDaily);
    if (getDaily) {
      const updatedAmount = Math.max(+getDaily.amount - amount, 0);
      console.log('get', getDaily);
      await prismaClient.dailyTransactions.update({
        where: {
          id: getDaily.id
        },
        data: {
          amount: updatedAmount
        }
      });
    }
    const getMonthly = await prismaClient.monthlyTransactions.findFirst({
      where: {
        monthYear,
        type,
        userID,
        categoryID
      }
    });

    if (getMonthly) {
      const updatedMonthlyAmount = Math.max(+getMonthly.amount - amount, 0);
      await prismaClient.monthlyTransactions.update({
        where: {
          id: getMonthly.id
        },
        data: {
          amount: updatedMonthlyAmount
        }
      });
    }
  },
  findTransactions: async ({
    type,
    date,
    userID,
    categoryID,
    page = 1,
    perPage: take = 10
  }: getTransactionsQuery) => {
    const skip = (page - 1) * take;
    const query = [];
    if (type) {
      query.push({
        type
      });
    }
    if (userID) {
      query.push({
        userID
      });
    }
    if (categoryID) {
      categoryID = +categoryID;
      query.push({
        categoryID
      });
    }
    if (date) {
      const startDate = commonUtil.getMidNightTimeStart(new Date(date));
      const endDate = commonUtil.getMidNightTimeEnd(new Date(date));
      query.push({
        date: {
          gte: startDate,
          lte: endDate
        }
      });
    }
    const data = await prismaClient.transactions.findMany({
      where: query.length > 0 ? { AND: query } : undefined,
      take: +take,
      skip,
      orderBy: {
        date: 'desc'
      }
    });
    const count = await prismaClient.transactions.count({
      where: query.length > 0 ? { AND: query } : undefined
    });
    return { data, count };
  },
  findTransactionsDaily: async ({
    type,
    date,
    userID,
    categoryID,
    page = 1,
    perPage: take = 10
  }: getTransactionsQuery) => {
    const skip = (page - 1) * take;
    const query = [];
    if (type) {
      query.push({
        type
      });
    }
    if (userID) {
      query.push({
        userID
      });
    }
    if (categoryID) {
      categoryID = +categoryID;
      query.push({
        categoryID
      });
    }
    if (date) {
      const startDate = commonUtil.getMidNightTimeStart(new Date(date));
      query.push({
        date: startDate
      });
    }
    const data = await prismaClient.dailyTransactions.findMany({
      where: query.length > 0 ? { AND: query } : undefined,
      take: +take,
      skip,
      orderBy: {
        date: 'desc'
      }
    });
    const count = await prismaClient.dailyTransactions.count({
      where: query.length > 0 ? { AND: query } : undefined
    });
    return { data, count };
  },
  findTransactionsMonthly: async ({
    type,
    date,
    userID,
    categoryID,
    page = 1,
    perPage: take = 10
  }: getTransactionsQuery) => {
    const skip = (page - 1) * take;
    const query = [];
    if (type) {
      query.push({
        type
      });
    }
    if (userID) {
      query.push({
        userID
      });
    }
    if (categoryID) {
      categoryID = +categoryID;
      query.push({
        categoryID
      });
    }
    if (date) {
      const monthYear = new Date(date);
      monthYear.setDate(1);
      query.push({
        monthYear: monthYear
      });
    }
    const data = await prismaClient.monthlyTransactions.findMany({
      where: query.length > 0 ? { AND: query } : undefined,
      take: +take,
      skip,
      orderBy: {
        monthYear: 'desc'
      }
    });
    const count = await prismaClient.monthlyTransactions.count({
      where: query.length > 0 ? { AND: query } : undefined
    });
    return { data, count };
  },
  findDailyTransactions: async function (
    date: Date,
    userID: number,
    type: transactionsType['type']
  ) {
    return prismaClient.dailyTransactions.findFirst({
      where: {
        date,
        type,
        userID
      }
    });
  },
  findMonthlyTransactions: async function (
    date: Date,
    userID: number,
    type: transactionsType['type']
  ) {
    return prismaClient.monthlyTransactions.findFirst({
      where: {
        monthYear: date,
        type,
        userID
      }
    });
  }
};
