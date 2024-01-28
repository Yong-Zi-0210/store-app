import { request } from "@/utils/request";
import { ApiResponseData } from "@/utils/request/types";

// 用户积分消费记录
export function pointsRecord(data: object) {
  return request<ApiResponseData<any>>({
    url: "/user/getPointsDetails",
    method: "post",
    data,
  });
}

// 查询用户当前剩余积分
export function getUserPoints() {
  return request<ApiResponseData<any>>({
    url: "user/getUser",
    method: "post",
  });
}

// 订单列表
export function orderList(data: object) {
  return request<ApiResponseData<any>>({
    url: "user/getGoodsOrders",
    method: "post",
    data,
  });
}

// 修改地址
export function editAddress(data: object) {
  return request<ApiResponseData<any>>({
    url: "user/modifyReceiveAddresses",
    method: "post",
    data,
  });
}

// 收货地址列表
export function address(data: object) {
  return request<ApiResponseData<any>>({
    url: "user/getReceiveAddresses",
    method: "post",
    data,
  });
}

// 新增收货地址
export function addAddress(data: object) {
  return request<ApiResponseData<any>>({
    url: "user/createReceiveAddresses",
    method: "post",
    data,
  });
}

// 获取省市区数据
export function cites() {
  return request<ApiResponseData<any>>({
    url: "city/getCities",
    method: "post",
  });
}
