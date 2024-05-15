export default {
  path: "/history",
  redirect: "/history/index",
  meta: {
    icon: "ri:history-fill",
    title: "历史记录",
    rank: 2
  },
  children: [
    {
      path: "/history/index",
      name: "History",
      component: () => import("@/views/history/index.vue"),
      meta: {
        title: "问答历史",
        roles: ["common"]
      }
    }
  ]
} satisfies RouteConfigsTable;
