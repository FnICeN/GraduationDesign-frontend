import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";
export type buyProdRes = {
  success: boolean;
};
export const buyProduct = (data?: object) => {
  return http.request<buyProdRes>("post", baseUrlApi("buyProduct"), { data });
};
