import { Request, response, Response } from 'express';
import {
  ConflictException,
  customErrorCode,
  InvalidInput,
  statusCode
} from '../exception';
import { categoryModel } from '../models';

export const categoryController = {
  get: async (req: Request, res: Response) => {
    const { id: userID } = req.users;
    const category = await categoryModel.get(userID);
    console.log(category);
    res.json({ category });
  },
  create: async (req: Request, res: Response) => {
    const { name } = req.body;
    const { id: userID } = req.users;
    const existCategory = await categoryModel.find(name, userID);
    if (existCategory) {
      throw new ConflictException(customErrorCode.DataExist, null);
    }
    const category = await categoryModel.create(name, userID);
    res.json({ data: category, status: 'success' }).status(statusCode.Created);
  },
  update: async (req: Request, res: Response) => {
    const { name } = req.body;
    const { id: userID } = req.users;
    const { categoryID } = req.params;

    const existCategory = await categoryModel.findByID(+categoryID, userID);
    if (!existCategory) {
      throw new InvalidInput(customErrorCode.NoDataFound, null);
    }
    const existCategoryWithID = await categoryModel.findNotID(
      +categoryID,
      name,
      userID
    );
    if (existCategoryWithID) {
      throw new ConflictException(customErrorCode.DataExist, null);
    }
    const category = await categoryModel.update(+categoryID, name);
    res.json({ data: category, status: 'success' }).status(statusCode.OK);
  },
  delete: async (req: Request, res: Response) => {
    const { id: userID } = req.users;
    const { categoryID } = req.params;

    const existCategory = await categoryModel.findByID(+categoryID, userID);
    if (!existCategory) {
      throw new InvalidInput(customErrorCode.NoDataFound, null);
    }
    const category = await categoryModel.delete(existCategory.id);
    res
      .json({ data: category, status: 'Deleted Successfully' })
      .status(statusCode.OK);
  }
};
