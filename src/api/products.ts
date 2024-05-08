import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";
export type buyProdRes = {
  success: boolean;
};
export const buyProduct = (data?: object) => {
  return http.request<buyProdRes>("post", baseUrlApi("buyProduct"), { data });
};

export const addProduct = (data?: object) => {
  return http.request<boolean>("post", baseUrlApi("addProduct"), { data });
};

export const updateProduct = (data?: object) => {
  return http.request<boolean>("post", baseUrlApi("updateProduct"), { data });
};

export const deleteProduct = (data?: object) => {
  return http.request<boolean>("post", baseUrlApi("deleteProduct"), { data });
};
