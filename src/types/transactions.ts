import { DailyTransactions } from '@prisma/client';
export type transactionsType = Pick<
  DailyTransactions,
  'categoryID' | 'amount' | 'type' | 'date' | 'userID'
>;
export interface getTransactions {
  type?: transactionsType['type'];
  date?: Date;
  page?: number;
  perPage?: number;
  categoryID?: number;
}
export interface getTransactionsQuery extends getTransactions {
  userID: number;
}
