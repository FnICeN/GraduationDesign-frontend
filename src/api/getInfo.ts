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
export type userInfoRes = {
  success: boolean;
  data: {
    userid: number;
    username: string;
    orderCount: number;
    sendOrReceiveCount: number;
    completeCount: number;
  };
};
export const getAllProducts = () => {
  return http.request<allProductsRes>("get", baseUrlApi("getAllProducts"));
};
export const getCurUserSendOrReceive = () => {
  return http.request<userOrdersRes>(
    "get",
    baseUrlApi("getCurUserSendOrReceive")
  );
};
export const getCurUserAllOrders = () => {
  return http.request<userOrdersRes>("get", baseUrlApi("getCurUserAllOrders"));
};
export const getCurUserInfo = () => {
  return http.request<userInfoRes>("get", baseUrlApi("getCurUserInfo"));
};
