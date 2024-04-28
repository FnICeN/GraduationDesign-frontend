import { http } from "@/utils/http";

export type QuestionRes = {
  success: boolean;
  data: {
    response: string;
  };
};

export const getRes = (data?: object) => {
  return http.request<QuestionRes>("post", "/getRes", { data });
};
