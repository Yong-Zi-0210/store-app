import { request } from "@/utils/request";
import type * as Login from "./types";

/** 获取登录验证码 */
export function getLoginCodeApi(data: object) {
  return request<Login.LoginCodeResponseData>({
    url: "getVerifyCode",
    method: "post",
    data,
  });
}

/** 登录并返回 Token */
export function loginApi(data: Login.LoginRequestData) {
  return request<Login.LoginResponseData>({
    url: "login",
    method: "post",
    data,
  });
}

/** 登出 */
export function logoutApi() {
  return request<Login.LogoutReaponseData>({
    url: "logout",
    method: "post",
  });
}
