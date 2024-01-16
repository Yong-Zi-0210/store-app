<template>
  <div class="hotl">
    <SearchBar placeholder="请输入酒店名称" @handleSearch="toSearchCar" />
    <div class="main">
      <div class="min-width main-content">
        <div class="core-rec">
          <div class="date-picker"></div>
          <el-image
            class="banner"
            @click="jumpDetail(coreRecImage)"
            fit="cover"
            :src="coreRecImage.displayImage"
            lazy
          ></el-image>
        </div>
        <div class="hot-resort">
          <div class="title">热门度假村</div>
          <HotResort :data="hotResort" />
        </div>
        <div class="hot-hotel">
          <div class="title">酒店</div>
          <HotHotel />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import useRouterStore from "@/store/module/router";
import { coreRec } from "@/api";
import { useJump } from "@/hooks/jump";

const jumpDetail = useJump();
const router = useRouter();
const paramsStore = useRouterStore();
const loading = ref(false);
const coreRecImage = ref<any>({}); // 主推位图片
const hotResort = ref(); // 热门度假村
const recHotel = ref(); // 推荐酒店
const activeJob = ref(0);

/** 搜索 */
const toSearchCar = (value: string) => {
  paramsStore.setSearchValue(value);
  router.push("hotelSearch");
};

/**
 * 获取推荐数据
 */
const getCoreRec = async (type: string) => {
  loading.value = true;
  try {
    const res = await coreRec({
      pageSize: 10,
      currentPage: 1,
      condition: {
        web: "004",
        type,
      },
    });
    loading.value = false;
    const { pageItems } = res.body;
    return pageItems;
  } catch (error) {
    loading.value = false;
  }
};
const getRecData = async () => {
  const requestList = [
    getCoreRec("001"), // 热门度假村
    getCoreRec("002"), // 热门酒店
  ];
  const res = await Promise.all(requestList);
  const [resort, hotel] = res;
  hotResort.value = resort;
  recHotel.value = hotel;
};

getRecData();
</script>
<style lang="scss" scoped>
.hotl {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  .main {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    margin-top: 13px;
    background-color: #fff;
    .core-rec {
      display: flex;
      align-items: center;
      padding-top: 45px;
      .date-picker {
        width: 516px;
        height: 320px;
        margin-right: 21px;
        background: #ffffff;
        box-shadow: 0px 0px 20px 0px rgba(226, 7, 85, 0.1);
        border-radius: 8px;
        border: 2px solid #e20755;
      }
      .banner {
        width: 663px;
        height: 320px;
        background: #f4f4f4;
        border-radius: 8px;
      }
    }
    .hot-resort,
    .hot-hotel {
      margin-top: 39px;
      .title {
        margin-bottom: 24px;
        font-size: 28px;
        font-weight: 600;
        color: #333333;
      }
    }
  }
}
</style>
