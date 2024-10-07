import { type Tokens, type Activation } from '@prisma/client';

export interface CreateUser {
  userName: string;
  Email: string;
  password: string;
  dob: Date;
}

export type CreateToken = Pick<
  Tokens,
  'userID' | 'UUID' | 'Token' | 'expiresOn' | 'isActive'
>;

export type createActivation = Pick<
  Activation,
  'userID' | 'expiresOn' | 'activationCode'
>;

// export type userSession = Pick<
//   Users,
//   'id' | 'userID' | 'Email' | 'dob' | 'createdAt' | 'isVerified'
// >;
