import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";

export type qaRes = {
  page: number;
  data: [
    {
      question: string;
      answer: string;
    }
  ];
};
export type qaChangeRes = {
  success: boolean;
};

export const getQaLength = () => {
  return http.request<number>("get", baseUrlApi("getQaLength"));
};
export const getQa = (data?: number) => {
  return http.request<qaRes>("post", baseUrlApi("getQa"), { data });
};
export const addQa = (data?: object) => {
  return http.request<qaChangeRes>("post", baseUrlApi("addQa"), { data });
};
export const delQa = (data?: object) => {
  return http.request<qaChangeRes>("post", baseUrlApi("delQa"), { data });
};
export const updateQa = (data?: object) => {
  return http.request<qaChangeRes>("post", baseUrlApi("updateQa"), { data });
};
