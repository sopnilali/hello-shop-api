

export type IPaymentData = {
  amount: number;
  transactionId: string;
  name: string;
  email: string;
  userId: string;
  productId: string;
  productName: string;
  productCategory: string;
  discountPercentage: number;
};

export type IPaymentResponse = {
  status: string;
  message: string;
  transactionId: string;
};
