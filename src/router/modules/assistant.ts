export default {
  path: "/assistant",
  redirect: "/assistant/index",
  meta: {
    icon: "ri:robot-2-line",
    title: "智能助手",
    rank: 2
  },
  children: [
    {
      path: "/assistant/index",
      name: "Assistant",
      component: () => import("@/views/assistant/index.vue"),
      meta: {
        title: "智能助手"
      }
    }
  ]
} satisfies RouteConfigsTable;
