import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";
export type allProductsRes = {
  success: boolean;
  data: [
    {
      productid: number;
      productname: string;
      price: number;
    }
  ];
};
export type userOrdersRes = {
  success: boolean;
  data: [
    {
      orderid: number;
      productname: string;
      price: number;
      sta: string;
    }
  ];
};
export const getAllProducts = () => {
  return http.request<allProductsRes>("get", baseUrlApi("getAllProducts"));
};
export const getCurUserOrders = (data?: object) => {
  return http.request<userOrdersRes>("get", baseUrlApi("getCurUserOrders"), {
    data
  });
};
