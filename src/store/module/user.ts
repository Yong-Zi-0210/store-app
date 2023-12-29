import { defineStore } from "pinia";
import { loginApi, logoutApi } from "@/api/user";
import store from "@/store";
import { type LoginRequestData } from "@/api/user/types";
import { removeToken, setToken } from "@/utils/cache/cookies";
import { setUserInfo, getUserInfo } from "@/utils/cache/local-storage";
import { ref } from "vue";
import { resetRouter } from "@/router";

export interface UserInfo {
  account: string;
  createTime: number;
  id: number | string;
  modifyTime: number;
  name: string;
  phone: string;
  status: string;
  systemUserId: number;
  dealerId: number;
}

const useUserStore = defineStore("user", () => {
  const avatar = ref("");
  const token = ref("");
  const info = getUserInfo();
  const userInfo = ref<UserInfo>(info); // 用户信息
  const roles = ref<string[]>([]);

  /** 登录 */
  const login = async (loginData: LoginRequestData) => {
    const { body } = await loginApi({ ...loginData });
    userInfo.value = body.operator;
    setUserInfo(body.operator);
    console.log(userInfo);
    const loginToken = body.loginToken;
    token && setToken(loginToken);
    token.value = loginToken;
    return true;
  };
  /** 登出 */
  const logout = async () => {
    await logoutApi();
    removeToken();
    token.value = "";
    roles.value = [];
    resetRouter();
  };
  return { avatar, userInfo, token, login, logout };
});

/** 在 setup 外使用 */
export function useUserStoreHook() {
  return useUserStore(store);
}
export default useUserStore;
