import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import config from "../../config";
import SSLCommerzPayment from "sslcommerz-lts";
import { IPaymentData } from "./ssl.interface";

const store_id = config.ssl.store_id;
const store_passwd = config.ssl.store_password;
const is_live = false;

const initPayment = async (paymentData: IPaymentData) => {
  const data = {
    store_id: config.ssl.store_id,
    store_passwd: config.ssl.store_password,
    total_amount: paymentData.amount,
    currency: "BDT",
    tran_id: paymentData.transactionId,
    success_url: `${config.ssl.validation_api}?tran_id=${paymentData.transactionId}`,
    fail_url: config.ssl.failed_url,
    cancel_url: config.ssl.cancel_url,
    ipn_url: "http://localhost:5000/api/ipn",
    shipping_method: "N/A",
    product_name: paymentData.productName,
    product_category: paymentData.productCategory,
    product_profile: "general",
    cus_name: paymentData.name,
    cus_email: paymentData.email,
    cus_add1: "Dhaka",
    cus_add2: "N/A",
    cus_city: "Dhaka",
    cus_state: "Dhaka",
    cus_postcode: "1000",
    cus_country: "Bangladesh",
    cus_phone: "01711111111",
    cus_fax: "01711111111",
    ship_name: "N/A",
    ship_add1: "N/A",
    ship_add2: "N/A",
    ship_city: "N/A",
    ship_state: "N/A",
    ship_postcode: 1000,
    ship_country: "N/A",
    userId: paymentData.userId,
    productId: paymentData.productId,
  };

  const sslcz = new SSLCommerzPayment(
    store_id as string,
    store_passwd as string,
    is_live
  );

  try {
    const apiResponse = await sslcz.init(data as any);

    const GatewayPageURL = apiResponse.GatewayPageURL;

    if (GatewayPageURL) {
      return GatewayPageURL;
    } else {
      throw new AppError(
        httpStatus.BAD_GATEWAY,
        "Failed to generate payment gateway URL."
      );
    }
  } catch (error) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "An error occurred while processing payment."
    );
  }
};

export const SSLService = {
  initPayment,
};
