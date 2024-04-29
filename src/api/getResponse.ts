import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";

export type QuestionRes = {
  success: boolean;
  data: {
    response: string;
  };
};

export const getRes = (data?: object) => {
  return http.request<QuestionRes>("post", baseUrlApi("getRes"), { data });
};
