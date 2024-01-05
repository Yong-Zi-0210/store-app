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
  const car = getRouterParams(CacheKey.CAR_DETAIL) || {};
  const product = getRouterParams(CacheKey.PRODUCT_DETAIL) || {};
  const hotel = getRouterParams(CacheKey.HOTEL_DETAIL) || {};
  const carDetail = ref(car);
  const productDetail = ref(product);
  const hotelDetail = ref(hotel);

  /** 记住当前路由 */
  const lastRouter = ref<RouteLocationNormalized>();

  const setCarDetail = (detail: object) => {
    setRouterParams(CacheKey.CAR_DETAIL, detail);
    carDetail.value = detail;
  };
  const setProductDetail = (detail: object) => {
    setRouterParams(CacheKey.PRODUCT_DETAIL, detail);
    productDetail.value = detail;
  };
  const setHotelDetail = (detail: object) => {
    setRouterParams(CacheKey.HOTEL_DETAIL, detail);
    hotelDetail.value = detail;
  };
  const setLastRouter = (router: RouteLocationNormalized) =>
    (lastRouter.value = router);

  return {
    searchValue,
    carDetail,
    productDetail,
    hotelDetail,
    lastRouter,
    setSearchValue,
    setCarDetail,
    setProductDetail,
    setHotelDetail,
    setLastRouter,
  };
});

export default useRouterStore;
