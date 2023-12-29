const SYSTEM_NAME = "tutu-admin";
import { type SidebarOpened, SidebarClosed } from "@/constants/app-key";
import { UserInfo } from "@/store/module/user";
/** 缓存数据时用到的 Key */
class CacheKey {
  static readonly TOKEN = `${SYSTEM_NAME}-token-key`;
  static readonly CONFIG_LAYOUT = `${SYSTEM_NAME}-config-layout-key`;
  static readonly SIDEBAR_STATUS = `${SYSTEM_NAME}-sidebar-status-key`;
  static readonly ACTIVE_THEME_NAME = `${SYSTEM_NAME}-active-theme-name-key`;
  static readonly VISITED_VIEWS = `${SYSTEM_NAME}-visited-views-key`;
  static readonly CACHED_VIEWS = `${SYSTEM_NAME}-cached-views-key`;
  static readonly USERINFO = `${SYSTEM_NAME}-userinfo`;
}
export const getSidebarStatus = () => {
  return localStorage.getItem(CacheKey.SIDEBAR_STATUS);
};
export const setSidebarStatus = (
  sidebarStatus: SidebarOpened | SidebarClosed
) => {
  localStorage.setItem(CacheKey.SIDEBAR_STATUS, sidebarStatus);
};

export const getUserInfo = () => {
  const info = localStorage.getItem(CacheKey.USERINFO);
  if (info) {
    return JSON.parse(info);
  }
};

export const setUserInfo = (userInfo: UserInfo) => {
  return localStorage.setItem(CacheKey.USERINFO, JSON.stringify(userInfo));
};
