import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";
export type changeOrderStatusRes = {
  success: boolean;
};
export type deleteOrderRes = {
  success: boolean;
};

export const changeStatus = (data?: object) => {
  return http.request<changeOrderStatusRes>(
    "post",
    baseUrlApi("changeStatus"),
    { data }
  );
};
export const deleteOrder = (data?: object) => {
  return http.request<deleteOrderRes>("post", baseUrlApi("deleteOrder"), {
    data
  });
};
