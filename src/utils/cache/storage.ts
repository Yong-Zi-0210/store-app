import { UserInfo } from "@/store/module/user";
import CacheKey from "@/constants/cache-key";

// 用户数据
export const getUserInfo = () => {
  const info = localStorage.getItem(CacheKey.USERINFO);
  if (info) {
    return JSON.parse(info);
  } else {
    return null;
  }
};
export const setUserInfo = (userInfo: UserInfo) => {
  localStorage.setItem(CacheKey.USERINFO, JSON.stringify(userInfo));
};

// 用户简历
export const getResumeInfo = () => {
  const info = localStorage.getItem(CacheKey.RESUMEINFO);
  if (info) {
    return JSON.parse(info);
  } else {
    return null;
  }
};
export const setResumeInfo = (resumeInfo: any) => {
  localStorage.setItem(CacheKey.RESUMEINFO, JSON.stringify(resumeInfo));
};

// 设置路由参数
export const getRouterParams = (key: string) => {
  const detail = localStorage.getItem(key);
  if (detail) {
    return JSON.parse(detail);
  }
};
export const setRouterParams = (key: string, obj: object) => {
  localStorage.setItem(key, JSON.stringify(obj));
};
