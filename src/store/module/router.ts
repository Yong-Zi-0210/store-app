import { defineStore } from "pinia";
import { ref } from "vue";
import { type RouteLocationNormalized } from "vue-router";
import CacheKey from "@/constants/cache-key";
import { getRouterParams, setRouterParams } from "@/utils/cache/storage";

const useRouterStore = defineStore("router", () => {
  /** 跳转搜索路由 */
  const searchValue = ref("");
  const setSearchValue = (value: string) => {
    searchValue.value = value;
  };

  /** 跳转详情路由 */
  const carDetail = ref(getRouterParams(CacheKey.CAR_DETAIL) || {});
  const productDetail = ref(getRouterParams(CacheKey.PRODUCT_DETAIL) || {});
  const hotelDetail = ref(getRouterParams(CacheKey.HOTEL_DETAIL) || {});
  const jobDetail = ref(getRouterParams(CacheKey.JOB_DETAIL) || {});
  const companyDetail = ref(getRouterParams(CacheKey.COMPANY_DETAIL) || {});

  /** 记住当前路由 */
  const lastRouter = ref<RouteLocationNormalized>();

  // 设置二手车
  const setCarDetail = (detail: object) => {
    setRouterParams(CacheKey.CAR_DETAIL, detail);
    carDetail.value = detail;
  };
  // 设置精品、商品
  const setProductDetail = (detail: object) => {
    setRouterParams(CacheKey.PRODUCT_DETAIL, detail);
    productDetail.value = detail;
  };
  // 设置职位
  const setJobDetail = (detail: object) => {
    setRouterParams(CacheKey.JOB_DETAIL, detail);
    jobDetail.value = detail;
  };
  // 设置公司
  const setCompanyDetail = (detail: object) => {
    setRouterParams(CacheKey.COMPANY_DETAIL, detail);
    companyDetail.value = detail;
  };
  // 设置酒店
  const setHotelDetail = (detail: object) => {
    setRouterParams(CacheKey.HOTEL_DETAIL, detail);
    hotelDetail.value = detail;
  };

  // 记住最后的路由
  const setLastRouter = (router: RouteLocationNormalized) =>
    (lastRouter.value = router);

  return {
    searchValue,
    carDetail,
    productDetail,
    jobDetail,
    companyDetail,
    hotelDetail,
    lastRouter,
    setSearchValue,
    setCarDetail,
    setProductDetail,
    setJobDetail,
    setCompanyDetail,
    setHotelDetail,
    setLastRouter,
  };
});

export default useRouterStore;
