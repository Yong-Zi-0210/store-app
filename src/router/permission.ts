import router from "@/router";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style
import { getToken } from "@/utils/cache/cookies"; // get token from cookie
import getPageTitle from "@/utils/getSysTitle";
import "nprogress/nprogress.css";
NProgress.configure({ showSpinner: false }); // NProgress Configuration

const whiteList = ["/login"]; // no redirect whitelist

router.beforeEach(async (to, _from, next) => {
  // start progress bar
  NProgress.start();
  const token = getToken();
  // set page title
  document.title = getPageTitle((to as any).meta.title);
  if (!token) {
    // 如果在免登录的白名单中，则直接进入
    if (whiteList.includes(to.path)) {
      next();
    } else {
      // 其他没有访问权限的页面将被重定向到登录页面
      NProgress.done();
      next("/login");
    }
    return;
  }

  // 如果已经登录，并准备进入 Login 页面，则重定向到主页
  if (to.path === "/login") {
    NProgress.done();
    return next({ path: "/" });
  }
  return next();
});

router.afterEach(() => {
  // setTitle(to.meta.title)
  NProgress.done();
});
