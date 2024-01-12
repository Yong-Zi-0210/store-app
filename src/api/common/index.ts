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
