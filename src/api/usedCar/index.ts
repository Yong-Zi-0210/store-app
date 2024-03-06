import { request } from "@/utils/request";
import { ApiResponseData } from "@/utils/request/types";

// 品牌列表
export function brand(data: object) {
  return request<ApiResponseData<any>>({
    url: "/usedCar/getCarBrands",
    method: "post",
    data,
  });
}

// 搜索
export function carList(data: object) {
  return request<ApiResponseData<any>>({
    url: "/usedCar/getUsedCars",
    method: "post",
    data,
  });
}

// 车辆详情
export function detail(data: object) {
  return request<ApiResponseData<any>>({
    url: "/usedCar/getUsedCarDetail",
    method: "post",
    data,
  });
}

// 预约沟通
export function communicate(data: object) {
  return request<ApiResponseData<any>>({
    url: "/usedCar/operate/addUserCommunicate",
    method: "post",
    data,
  });
}

// 卖车列表查询
export function sellCarList(data: object) {
  return request<ApiResponseData<any>>({
    url: "/usedCar/operate/getUserSaleCars",
    method: "post",
    data,
  });
}

// 申请卖车
export function sellCar(data: object) {
  return request<ApiResponseData<any>>({
    url: "/usedCar/operate/saleCar",
    method: "post",
    data,
  });
}
