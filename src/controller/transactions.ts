import { Request, Response } from 'express';
import { customErrorCode, InvalidInput, statusCode } from '../exception';
import { categoryModel, transactionsModel } from '../models';
import { getTransactions } from '../types';

export const transactionsController = {
  create: async (req: Request, res: Response) => {
    const { amount, categoryID, type, date } = req.body;
    const { id: userID } = req.users;
    const existCategory = await categoryModel.findByID(+categoryID, userID);
    if (!existCategory) {
      throw new InvalidInput(customErrorCode.NoDataFound, 'Category not found');
    }
    await transactionsModel.create({
      userID,
      amount,
      type,
      categoryID,
      date
    });
    res.status(statusCode.Created).json({ status: 'success' });
  },
  get: async (req: Request, res: Response) => {
    const { id: userID } = req.users;
    const { type, date, page, perPage, categoryID }: getTransactions =
      req.query;
    const transactions = await transactionsModel.findTransactions({
      type,
      date,
      userID,
      categoryID,
      page,
      perPage
    });
    res.status(statusCode.OK).json({
      data: transactions.data,
      count: transactions.count,
      status: 'success'
    });
  },
  getDaily: async (req: Request, res: Response) => {
    const { id: userID } = req.users;
    const { type, date, page, perPage, categoryID }: getTransactions =
      req.query;
    const transactions = await transactionsModel.findTransactionsDaily({
      type,
      date,
      userID,
      categoryID,
      page,
      perPage
    });
    res.status(statusCode.OK).json({
      data: transactions.data,
      count: transactions.count,
      status: 'success'
    });
  },
  getMonthly: async (req: Request, res: Response) => {
    const { id: userID } = req.users;
    const { type, date, page, perPage, categoryID }: getTransactions =
      req.query;
    const transactions = await transactionsModel.findTransactionsMonthly({
      type,
      date,
      userID,
      categoryID,
      page,
      perPage
    });
    res.status(statusCode.OK).json({
      data: transactions.data,
      count: transactions.count,
      status: 'success'
    });
  },
  delete: async (req: Request, res: Response) => {
    const { id } = req.params;
    const { id: userID } = req.users;
    const idInt = +id;
    const findTransactionsByID = await transactionsModel.findTransactionsByID(
      idInt,
      userID
    );
    if (!findTransactionsByID) {
      throw new InvalidInput(customErrorCode.NoDataFound, null);
    }
    const amount = +findTransactionsByID.amount;
    const transactions = await transactionsModel.delete(
      findTransactionsByID.id,
      findTransactionsByID.userID,
      findTransactionsByID.date,
      amount,
      findTransactionsByID.categoryID,
      findTransactionsByID.type
    );
    res.status(statusCode.OK).json({
      data: transactions,
      status: 'success'
    });
  },
  update: async (req: Request, res: Response) => {
    const { id } = req.params;
    const { id: userID } = req.users;
    const { amount, categoryID, type, date } = req.body;
    const existTransactions = await transactionsModel.findTransactionsByID(
      parseInt(id),
      userID
    );
    if (!existTransactions) {
      throw new InvalidInput(customErrorCode.NoDataFound, null);
    }
    const transactions = await transactionsModel.update(parseInt(id), {
      categoryID,
      amount,
      type,
      date,
      userID
    });

    res.status(statusCode.OK).json({
      data: transactions,
      status: 'success'
    });
  }
};
