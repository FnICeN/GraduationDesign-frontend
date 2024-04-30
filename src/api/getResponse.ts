import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";

export type QuestionRes = {
  success: boolean;
  data: {
    response: string;
  };
};
export type ChangeModeRes = {
  success: boolean;
};
export type clearRes = {
  success: boolean;
};

export const getRes = (data?: object) => {
  return http.request<QuestionRes>("post", baseUrlApi("getRes"), { data });
};
export const changeMode = (data?: number) => {
  return http.request<ChangeModeRes>("post", baseUrlApi("changeMode"), {
    data
  });
};
export const clear = () => {
  return http.request<clearRes>("get", baseUrlApi("clear"));
};
