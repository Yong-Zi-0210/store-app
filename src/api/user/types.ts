import { ApiResponseData } from "@/utils/request/types";
export interface LoginRequestData {
  /** 用户名 */
  account?: string;
  /** 密码 */
  password?: string;
  /** 手机 */
  phone?: string;
  /** 验证码 */
  verifyCode?: string;
}

interface BodyData {
  [key: string]: any;
}

/** 所有 api 接口的响应数据都应该准守该格式 */

export type LoginCodeResponseData = ApiResponseData<BodyData>;

export type LoginResponseData = ApiResponseData<BodyData>;

export type LogoutReaponseData = ApiResponseData<BodyData>;
