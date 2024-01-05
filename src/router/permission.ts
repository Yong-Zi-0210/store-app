import router from "@/router";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style
import getPageTitle from "@/utils/getSysTitle";
import useSettingStore from "@/store/module/setting";
import useRouterStore from "@/store/module/router";
import "nprogress/nprogress.css";

NProgress.configure({ showSpinner: false }); // NProgress Configuration

router.beforeEach(async (to, _from, next) => {
  /** 重置footer背景色 */
  const settingStore = useSettingStore();
  settingStore.setFooterBgColor();

  /** 记录上一次的路由 */
  const routerStore = useRouterStore();
  if (to.path !== "/login") {
    routerStore.setLastRouter(to);
  }
  NProgress.start();
  document.title = getPageTitle((to as any).meta.title);
  return next();
});

router.afterEach(() => {
  NProgress.done();
});
