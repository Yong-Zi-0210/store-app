import router from "@/router";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style
import getPageTitle from "@/utils/getSysTitle";
import useSettingStore from "@/store/module/setting";
import useUserStore from "@/store/module/user";
import useRouterStore from "@/store/module/router";
import { getToken } from "@/utils/cache/cookies"; // get token from cookie
import { getCity } from "@/utils/cache/storage";
import "nprogress/nprogress.css";

NProgress.configure({ showSpinner: false }); // NProgress Configuration
const token = getToken();
router.beforeEach(async (to, _from, next) => {
  NProgress.start();
  document.title = getPageTitle((to as any).meta.title);
  /** 重置footer背景色 */
  const settingStore = useSettingStore();
  settingStore.setFooterBgColor();

  /** 获取当前城市 */
  const userStore = useUserStore();
  const city = getCity();
  if (!city) {
    userStore.getCurrentCity();
  }

  /** 记录上一次的路由 */
  const routerStore = useRouterStore();
  if (to.path !== "/login") {
    routerStore.setLastRouter(to);
  }
  if (!token) {
    console.log(to);
    // 如果在免登录的白名单中，则直接进入
    if (to.meta && to.meta.noLogin) {
      next();
    } else {
      // 其他没有访问权限的页面将被重定向到登录页面
      NProgress.done();
      next("/login");
    }
    return;
  }
  return next();
});

router.afterEach(() => {
  NProgress.done();
});
