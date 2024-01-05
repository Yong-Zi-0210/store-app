import { defineStore } from "pinia";
import { loginApi, logoutApi } from "@/api/user";
import store from "@/store";
import { type LoginRequestData } from "@/api/user/types";
import { removeToken, setToken } from "@/utils/cache/cookies";
import { setUserInfo, getUserInfo } from "@/utils/cache/storage";
import { ref } from "vue";
import { resetRouter } from "@/router";

export interface UserInfo {
  id?: string;
  createTime?: number;
  modifyTime?: number;
  systemUserId?: number;
  account?: string;
  phone?: string;
  username?: string;
  points?: number;
  level?: number;
  levelTitle?: string;
  status?: string;
}

const useUserStore = defineStore("user", () => {
  const avatar = ref("");
  const token = ref("");
  const userInfo = ref<UserInfo>(getUserInfo()); // 用户信息

  /** 登录 */
  const login = async (loginData: LoginRequestData) => {
    const { body } = await loginApi({ ...loginData });

    // 缓存用户信息
    userInfo.value = body.user;
    setUserInfo(body.user);

    // 设置token
    const loginToken = body.loginToken;
    token && setToken(loginToken);
    token.value = loginToken;
    return true;
  };
  /** 登出 */
  const logout = async () => {
    await logoutApi();

    // 删除token信息
    removeToken();
    token.value = "";

    // 删除用户信息
    setUserInfo({});
    userInfo.value = {};

    // 重置路由
    resetRouter();
  };
  return { avatar, userInfo, token, login, logout };
});

/** 在 setup 外使用 */
export function useUserStoreHook() {
  return useUserStore(store);
}
export default useUserStore;
