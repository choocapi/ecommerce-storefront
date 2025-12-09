import { IUser } from './user';

export interface IUserAddress {
  id: number;
  userId?: string; // UUID
  user?: IUser;
  recipientName?: string;
  phoneNumber?: string;
  addressLine?: string;
  ward?: string;
  district?: string;
  city?: string;
  isDefault?: boolean;
}
