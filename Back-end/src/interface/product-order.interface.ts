import { ObjectId } from 'mongodb';

export interface ProductOrder {
  productId: ObjectId;
  urlImage: string;
  quantity: number;
<<<<<<< HEAD
  price: number;
=======
  price: number; // Giá bán tại thời điểm đặt hàng
  importPrice?: number; // Giá vốn tại thời điểm đặt hàng
>>>>>>> origin/back-up
}
