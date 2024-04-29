import { defineFakeRoute } from "vite-plugin-fake-server/client";

export default defineFakeRoute([
  {
    url: "/getRes",
    method: "post",
    response: ({ body }) => {
      if (body.mode === 1) {
        return {
          success: true,
          data: {
            response: "BoW回复内容"
          }
        };
      } else if (body.mode === 2) {
        return {
          success: true,
          data: {
            response: "BM25回复内容"
          }
        };
      } else if (body.mode === 3) {
        return {
          success: true,
          data: {
            response: "VSM-tfidf回复内容"
          }
        };
      } else if (body.mode === 4) {
        return {
          success: true,
          data: {
            response: "VSM-Word2Vec回复内容"
          }
        };
      } else if (body.mode === 5) {
        return {
          success: true,
          data: {
            response: body.usellm
              ? "LSTM回复内容，启用大模型辅助"
              : "LSTM回复内容，不启用大模型辅助"
          }
        };
      }
    }
  }
]);
