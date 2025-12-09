import type { EmailTokenType } from './enums';
import { IUser } from './user';

export interface IEmailToken {
  id: number;
  token: string;
  userId?: number;
  user?: IUser;
  type: EmailTokenType;
  expiresAt: string;
}
