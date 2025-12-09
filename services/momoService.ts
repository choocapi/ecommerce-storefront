import api from "@/lib/axios";

interface CreatePaymentRequest {
  orderId: string;
  amount: number;
}

interface CreatePaymentResponse {
  code: string;
  message: string;
  paymentUrl: string;
}

const createPayment = async (
  data: CreatePaymentRequest,
): Promise<CreatePaymentResponse> => {
  const response = await api.post("/momo/create", data);
  return response.data;
};

export const momoService = {
  createPayment,
};
