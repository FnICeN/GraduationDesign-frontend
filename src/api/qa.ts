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

export const getQaLength = () => {
  return http.request<number>("get", baseUrlApi("getQaLength"));
};
export const getQa = (data?: number) => {
  return http.request<qaRes>("post", baseUrlApi("getQa"), { data });
};
