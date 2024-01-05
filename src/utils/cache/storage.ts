import { UserInfo } from "@/store/module/user";
import CacheKey from "@/constants/cache-key";

// 用户数据
export const getUserInfo = () => {
  const info = sessionStorage.getItem(CacheKey.USERINFO);
  if (info) {
    return JSON.parse(info);
  } else {
    return {};
  }
};
export const setUserInfo = (userInfo: UserInfo) => {
  sessionStorage.setItem(CacheKey.USERINFO, JSON.stringify(userInfo));
};

// 设置路由参数
export const getRouterParams = (key: string) => {
  const detail = sessionStorage.getItem(key);
  if (detail) {
    return JSON.parse(detail);
  }
};
export const setRouterParams = (key: string, obj: object) => {
  sessionStorage.setItem(key, JSON.stringify(obj));
};
