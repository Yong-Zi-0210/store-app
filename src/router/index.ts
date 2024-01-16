import {
  type RouteRecordRaw,
  createRouter,
  createWebHashHistory,
} from "vue-router";

const Layout = () => import("@/layout/index.vue");

// 固定路由
const routers: RouteRecordRaw[] = [
  {
    path: "/login",
    component: () => import("@/views/login/index.vue"),
    meta: {
      hidden: true,
    },
  },
  {
    path: "/",
    component: Layout,
    redirect: "/home",
    children: [
      {
        path: "home",
        component: () => import("@/views/home/index.vue"),
        name: "Home",
        meta: {
          title: "首页",
        },
      },
      {
        path: "hotel",
        component: () => import("@/views/hotel/index.vue"),
        name: "Hotel",
        meta: {
          title: "酒店",
        },
      },
      {
        path: "usedcar",
        component: () => import("@/views/usedCar/index.vue"),
        name: "usedCar",
        redirect: "/usedcar/rec",
        meta: {
          title: "二手车",
        },
        children: [
          {
            path: "rec",
            component: () => import("@/views/usedCar/rec/index.vue"),
            name: "Rec",
            meta: {
              title: "推荐",
            },
          },
          {
            path: "search",
            component: () => import("@/views/usedCar/search/index.vue"),
            name: "Search",
            meta: {
              title: "搜索",
            },
          },
          {
            path: "detail",
            component: () => import("@/views/usedCar/detail/index.vue"),
            name: "Detail",
            meta: {
              title: "详情",
            },
          },
        ],
      },
      {
        path: "goods",
        component: () => import("@/components/RouterView/index.vue"),
        name: "Goods",
        redirect: "goods/goodsSearch",
        meta: {
          title: "商品",
        },
        children: [
          {
            path: "goodsSearch",
            component: () => import("@/views/goods/index.vue"),
            name: "GoodsSearch",
            meta: {
              title: "商品列表",
            },
          },
          {
            path: "goodsDetail",
            component: () => import("@/views/goods/goodsDetail/index.vue"),
            name: "GoodsDetail",
            meta: {
              title: "商品详情",
            },
          },
        ],
      },
      {
        path: "recruitment",
        component: () => import("@/components/RouterView/index.vue"),
        name: "Recruitment",
        redirect: "recruitment/recruitmentRec",
        meta: {
          title: "招聘",
        },
        children: [
          {
            path: "recruitmentRec",
            component: () => import("@/views/recruitment/index.vue"),
            name: "RecruitmentRec",
            meta: {
              title: "招聘推荐",
            },
          },
          {
            path: "recruitmentSearch",
            component: () => import("@/views/recruitment/search.vue"),
            name: "RecruitmentSearch",
            meta: {
              title: "招聘搜索",
            },
          },
          {
            path: "job",
            component: () => import("@/views/recruitment/job.vue"),
            name: "Job",
            meta: {
              title: "职位详情",
            },
          },
          {
            path: "company",
            component: () => import("@/views/recruitment/company/index.vue"),
            name: "Company",
            meta: {
              title: "公司详情",
            },
          },
        ],
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes: routers,
});
/** 重置路由 */
export function resetRouter() {
  // 注意：所有动态路由路由必须带有 Name 属性，否则可能会不能完全重置干净
  try {
    // 删除动态添加的路由
    // router.getRoutes().forEach((route) => {
    //   const { name } = route;
    //   if (name && !whiteList.includes(name as string)) {
    //     router.hasRoute(name) && router.removeRoute(name);
    //   }
    // });
    router.push("/login");
  } catch {
    // 强制刷新浏览器也行，只是交互体验不是很好
    window.location.reload();
  }
}

export default router;
