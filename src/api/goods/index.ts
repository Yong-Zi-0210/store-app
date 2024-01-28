import { request } from "@/utils/request";
import { ApiResponseData } from "@/utils/request/types";

// 商品分类
export function goodsCategories() {
  return request<ApiResponseData<any>>({
    url: "goods/getGoodsCategories",
    method: "post",
  });
}

// 商品品牌分类
export function goodsBrands(data: object) {
  return request<ApiResponseData<any>>({
    url: "goods/getGoodsBrands",
    method: "post",
    data,
  });
}

// 搜索商品
export function goodsList(data: object) {
  return request<ApiResponseData<any>>({
    url: "goods/getGoods",
    method: "post",
    data,
  });
}

// 商品详情
export function getGoodsDetail(data: object) {
  return request<ApiResponseData<any>>({
    url: "goods/getGoodsDetail",
    method: "post",
    data,
  });
}

// 兑换商品
export function goodsExchange(data: object) {
  return request<ApiResponseData<any>>({
    url: "goods/operate/createGoodsOrder",
    method: "post",
    data,
  });
}
