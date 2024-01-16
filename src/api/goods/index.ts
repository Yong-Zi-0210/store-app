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
