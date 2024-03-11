import { request } from "@/utils/request";
import { ApiResponseData } from "@/utils/request/types";
// 主推荐位
export function coreRec(data: object) {
  return request<ApiResponseData<any>>({
    url: "recommends/getRecommends",
    method: "post",
    data,
  });
}

// 收货地址列表
export function addressList() {
  return request<ApiResponseData<any>>({
    url: "user/getAllReceiveAddresses",
    method: "post",
  });
}

// 获取当前城市
export function getCurrentAddress() {
  return request<ApiResponseData<any>>({
    url: "city/getCityByIp",
    method: "post",
  });
}

// 可选城市列表
export function positionCities() {
  return request<ApiResponseData<any>>({
    url: "city/getPositionCities",
    method: "post",
  });
}
