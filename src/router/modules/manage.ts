export default {
  path: "/manage",
  redirect: "/error/403",
  meta: {
    icon: "ri:handbag-line",
    // showLink: false,
    title: "商品管理",
    rank: 1
  },
  children: [
    {
      path: "/manage/buy",
      name: "Buy",
      component: () => import("@/views/manage/buy.vue"),
      meta: {
        title: "购买商品"
      }
    },
    {
      path: "/manage/receive",
      name: "Receive",
      component: () => import("@/views/manage/receive.vue"),
      meta: {
        title: "商品收货"
      }
    },
    {
      path: "/manage/reject",
      name: "Reject",
      component: () => import("@/views/manage/reject.vue"),
      meta: {
        title: "商品退货"
      }
    }
  ]
} satisfies RouteConfigsTable;
