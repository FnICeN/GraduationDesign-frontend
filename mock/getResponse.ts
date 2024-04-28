import { defineFakeRoute } from "vite-plugin-fake-server/client";

export default defineFakeRoute([
  {
    url: "/getRes",
    method: "post",
    response: ({ body }) => {
      if (body) {
        return {
          success: true,
          data: {
            response: "回复内容"
          }
        };
      }
    }
  }
]);
