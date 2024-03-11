import { defineStore } from "pinia";
import { ref } from "vue";
import {
  loginApi,
  logoutApi,
  getResume,
  deleteResume,
  getCurrentAddress,
} from "@/api";
import store from "@/store";
import { type LoginRequestData } from "@/api/user/types";
import { removeToken, setToken } from "@/utils/cache/cookies";
import { ElMessage } from "element-plus";
import {
  setUserInfo,
  getUserInfo,
  getResumeInfo,
  setResumeInfo,
} from "@/utils/cache/storage";
import { resetRouter } from "@/router";
import { getCity, setCity } from "@/utils/cache/storage";

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
  const resume = ref<any>(getResumeInfo()); // 用户简历
  const city = ref(getCity());
  /** 登录 */
  const login = async (loginData: LoginRequestData) => {
    try {
      const { body } = await loginApi(loginData);
      // 缓存用户信息
      userInfo.value = body.user;
      setUserInfo(body.user);
      // 设置token
      const loginToken = body.loginToken;
      token && setToken(loginToken);
      token.value = loginToken;
      return true;
    } catch (error) {}
  };
  /** 登出 */
  const logout = async () => {
    try {
      await logoutApi();
      // 删除token信息
      token.value = "";
      removeToken();
      // 删除用户信息
      userInfo.value = {};
      setUserInfo({});
      // 清空城市
      city.value = null;
      setCity("");
      // 重置路由
      resetRouter();
    } catch (error) {
      console.error(error);
    }
  };

  /** 获取当前城市 */
  const getCurrentCity = async () => {
    try {
      const { body } = await getCurrentAddress();
      city.value = body?.cityName;
      setCity(body?.cityName);
    } catch (error: any) {
      ElMessage.error(error);
    }
  };

  /** 更新积分 */
  const updatePoints = (points: number) => {
    userInfo.value.points = points;
  };

  /** 获取用户简历信息 */
  const getUserResume = async () => {
    try {
      const res = await getResume();
      resume.value = res.body;
      setResumeInfo(res.body);
    } catch (error) {
      console.error(error);
    }
  };

  /** 删除用户简历 */
  const delResume = async () => {
    try {
      await deleteResume({ id: resume.value.id });
      await updateResume();
    } catch (error) {
      console.error(error);
    }
  };

  /** 更新简历 */
  const updateResume = async () => {
    await getUserResume();
  };

  return {
    avatar,
    userInfo,
    token,
    resume,
    city,
    login,
    logout,
    updatePoints,
    updateResume,
    delResume,
    getCurrentCity,
  };
});

/** 在 setup 外使用 */
export function useUserStoreHook() {
  return useUserStore(store);
}
export default useUserStore;
