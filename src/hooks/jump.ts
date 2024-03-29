import useRouterStore from "@/store/module/router";
import { useRouter } from "vue-router";

// 推荐位公共跳转详情的方法，职位和企业的详情以及所有的搜索结果页不能使用该方法
export function useJump() {
  const paramsStore = useRouterStore();
  const router = useRouter();
  const jumpDetail = (item: any) => {
    const { productType } = item;
    switch (productType) {
      //车辆详情
      case "001": {
        paramsStore.setCarDetail({ id: item.productId });
        router.push("/usedCar/detail");
        break;
      }
      // 招聘企业详情
      case "002": {
        paramsStore.setCompanyDetail({ companyId: item.productId });
        router.push("company");
        break;
      }
      // 精品、商品详情
      case "003": {
        paramsStore.setGoodsDetail({ id: item.productId });
        router.push("/goods/goodsDetail");
        break;
      }
      // 酒店详情
      case "004": {
        paramsStore.setHotelDetail({ id: item.productId });
        router.push("hotelDetail");
        break;
      }
      // 招聘职位详情
      case "005": {
        paramsStore.setJobDetail({ positionId: item.productId });
        router.push("position");
        break;
      }
      default: {
        throw new Error("商品类型不存在");
      }
    }
  };
  return jumpDetail;
}
