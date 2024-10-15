import { type Tokens, type Activation, Users } from '@prisma/client';

export interface CreateUser {
  userName: string;
  Email: string;
  password: string;
  dob: Date;
}

export type CreateToken = Omit<Tokens, 'id' | 'createdAt'>;
/* Pick<
  Tokens,
  'userID' | 'UUID' | 'Token' | 'expiresOn' | 'isActive'
>;*/

export type createActivation = Pick<
  Activation,
  'userID' | 'expiresOn' | 'activationCode'
>;
export type userResponse = Omit<Users, 'password' | 'id'>;
// export type userSession = Pick<
//   Users,
//   'id' | 'userID' | 'Email' | 'dob' | 'createdAt' | 'isVerified'
// >;
