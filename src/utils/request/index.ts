import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";
import { useUserStoreHook } from "@/store/module/user";
import { ElMessage } from "element-plus";
import { get, merge } from "lodash-es";
import { getToken } from "../cache/cookies";
import { getRandomString } from "@/utils";

/** 退出登录并强制刷新页面（会重定向到登录页） */
function logout() {
  useUserStoreHook().logout();
}

/** 创建请求实例 */
function createService() {
  // 创建一个 axios 实例命名为 service
  const service = axios.create();
  // 请求拦截
  service.interceptors.request.use(
    (config) => config,
    // 发送失败
    (error) => Promise.reject(error)
  );
  // 响应拦截（可根据具体业务作出相应的调整）
  service.interceptors.response.use(
    (response) => {
      // res 是 api 返回的数据
      const res = response.data;
      // 二进制数据则直接返回
      const responseType = response.request?.responseType;
      if (responseType === "blob" || responseType === "arraybuffer") return res;
      // 这个 code 是和后端约定的业务 code
      const errorCode = res.errorCode;
      // 如果没有 errorCode, 表示请求正确返回
      if (!errorCode) {
        return res;
      }
      switch (errorCode) {
        case "999403":
          // Token 过期时
          ElMessage.error("登录状态已过期");
          logout();
          return Promise.reject(new Error("登录状态已过期"));
        default:
          // 其他错误类型
          ElMessage.error(res.errorMessage || "Error");
          return Promise.reject(new Error("Error"));
      }
    },
    (error) => {
      // status 是 HTTP 状态码
      const status = get(error, "response.status");
      switch (status) {
        case 400:
          error.message = "请求错误";
          break;
        case 401:
          // Token 过期时
          logout();
          break;
        case 403:
          error.message = "拒绝访问";
          break;
        case 404:
          error.message = "请求地址出错";
          break;
        case 408:
          error.message = "请求超时";
          break;
        case 500:
          error.message = "服务器内部错误";
          break;
        case 501:
          error.message = "服务未实现";
          break;
        case 502:
          error.message = "网关错误";
          break;
        case 503:
          error.message = "服务不可用";
          break;
        case 504:
          error.message = "网关超时";
          break;
        case 505:
          error.message = "HTTP 版本不受支持";
          break;
        default:
          break;
      }
      ElMessage.error(error.message);
      return Promise.reject(error);
    }
  );
  return service;
}

/** 创建请求方法 */
function createRequest(service: AxiosInstance) {
  return function <T>(config: AxiosRequestConfig): Promise<T> {
    const token = getToken();
    const defaultConfig = {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 5000,
      baseURL: import.meta.env.VITE_BASE_API,
    };
    // 将默认配置 defaultConfig 和传入的自定义配置 config 进行合并成为 mergeConfig
    const data = {
      loginToken: token ? token : "", // 用户登录后的token
      deviceType: "Web", // 设备类型
      deviceId: "", // 设备id
      deviceInfo: window.navigator.userAgent, // 设备信息
      appChannel: "", // 渠道
      appVersion: "1.0", // app版本
      requestToken: getRandomString(24), // 防重提交令牌24位随机数
      timestamp: new Date().getTime(), // 时间戳
      version: "1.0", // 调用方法版本默认1.0
      nonce: getRandomString(12), // 安全随机串，12位随机串用于加密
      sign: getRandomString(40), // 签名，SHA-1，40位字符串，暂未使用，可填写16进制40位随机串
      body: {},
    };
    if (config.url?.indexOf("/file/upload") === -1) {
      data.body = Object.assign({}, config.data);
      config.data = data;
    }
    const mergeConfig = merge(defaultConfig, config);
    return service(mergeConfig);
  };
}

/** 用于网络请求的实例 */
const service = createService();
/** 用于网络请求的方法 */
export const request = createRequest(service);
