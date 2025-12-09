import { IProduct } from './products';

export interface ICartItem {
  id: number;
  userId?: string;
  productId: number;
  product?: IProduct;
  quantity: number;
}

export interface ICartSummary {
  totalItems: number;
  totalProducts: number;
  totalAmount: number;
}
