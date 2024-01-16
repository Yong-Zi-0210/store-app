import { request } from "@/utils/request";
import { ApiResponseData } from "@/utils/request/types";

export function hotelDetail(data: object) {
  return request<ApiResponseData<any>>({
    url: "hotel/getHotelDetail",
    method: "post",
    data,
  });
}
