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
