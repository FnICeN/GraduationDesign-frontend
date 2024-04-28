export default {
  path: "/dataset",
  redirect: "/dataset/index",
  meta: {
    icon: "ri:database-2-line",
    title: "数据集管理",
    rank: 3
  },
  children: [
    {
      path: "/dataset/index",
      name: "Dataset",
      component: () => import("@/views/dataset/index.vue"),
      meta: {
        title: "数据集管理",
        roles: ["admin"]
      }
    }
  ]
} satisfies RouteConfigsTable;
