<template>
  <div class="recruitment">
    <!-- 搜索 -->
    <SearchBar placeholder="请输入职位名称" @handleSearch="toSearchCar" />
    <div class="main min-width" v-loading="loading">
      <div class="core-rec">
        <el-image
          class="banner"
          @click="jumpDetail(coreRecImage)"
          fit="cover"
          :src="coreRecImage.displayImage"
          lazy
        ></el-image>
        <div class="hot-goods">
          <div class="title">精选热点</div>
          <ul class="goods-list">
            <li
              class="goods-item"
              v-for="(item, index) in hotQuality"
              :key="index"
              :title="item.name"
              @click="jumpDetail(item)"
            >
              {{ item.name }}
            </li>
          </ul>
        </div>
      </div>
      <div class="hot-job">
        <div class="title">
          <span class="text">热招岗位</span>
          <span class="bg-line"></span>
        </div>
        <el-tabs v-model="activeJob" @tab-change="changeTabs">
          <el-tab-pane
            v-for="(item, index) in hotJOb"
            :label="item.categoryName"
            :name="index"
          >
            <HotJob :data="activeJobData" />
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="hot-company">
        <div class="title">
          <span class="text">热门企业</span>
          <span class="bg-line"></span>
        </div>
        <HotCompany :data="hotCompany" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import useRouterStore from "@/store/module/router";
import { hotJob, hotUnit, coreRec } from "@/api";
import { useJump } from "@/hooks/jump";

const jumpDetail = useJump();
const router = useRouter();
const paramsStore = useRouterStore();
const loading = ref(false);
const coreRecImage = ref<any>({}); // 主推位图片
const hotQuality = ref(); // 精选热门
const hotJOb = ref(); // 热招岗位
const activeJobData = ref([]); // 当前展示的热招岗位
const hotCompany = ref(); // 热门企业
const activeJob = ref(0);

/** 搜索 */
const toSearchCar = (value: string) => {
  paramsStore.setSearchValue(value);
  router.push("recruitmentSearch");
};

/**
 * 获取推荐数据
 * type: 001-主推位；004-精选热点
 *  */
const getCoreRec = async (type: string) => {
  loading.value = true;
  try {
    const res = await coreRec({
      pageSize: 10,
      currentPage: 1,
      condition: {
        web: "002",
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
    getCoreRec("001"),
    getCoreRec("004"),
    getHotJob(),
    getHotUnit(),
  ];
  const res = await Promise.all(requestList);
  const [coreImage, coreQuality, job, company] = res;
  coreRecImage.value = coreImage[0];
  hotQuality.value = coreQuality;
  hotJOb.value = job;
  hotCompany.value = company;
  activeJobData.value = job[0].positions;
};

/** 热招岗位 */
const getHotJob = async () => {
  try {
    const res = await hotJob();
    return res.body;
  } catch (error) {
    return Promise.reject(error);
  }
};

/** 热门企业 */
const getHotUnit = async () => {
  try {
    const res = await hotUnit();
    return res.body;
  } catch (error) {
    return Promise.reject(error);
  }
};

/** 切换tabs */
const changeTabs = (index: number) => {
  activeJob.value = index;
  activeJobData.value = hotJOb.value[index].positions;
};

getRecData();
</script>
<style lang="scss" scoped>
.recruitment {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  .main {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    margin-top: 13px;
  }
  .core-rec {
    display: flex;
    justify-content: space-between;
    .banner {
      width: 896px;
      height: 402px;
      margin-right: 10px;
      background: #34b8ca;
      border-radius: 8px;
      box-sizing: border-box;
      cursor: pointer;
    }
    .hot-goods {
      width: 294px;
      height: 402px;
      box-sizing: border-box;
      background: #ffffff;
      border-radius: 8px;
      .title {
        width: 128px;
        margin: 16px auto;
        height: 34px;
        line-height: 34px;
        background: #e20755;
        color: #ffffff;
        font-size: 18px;
        border-radius: 21px;
        text-align: center;
      }
      .goods-list {
        display: flex;
        flex-wrap: wrap;
        padding: 7px 23px 26px 24px;
        margin-right: -27px;
        box-sizing: border-box;
        .goods-item {
          width: 110px;
          height: 35px;
          overflow: hidden;
          text-wrap: nowrap;
          text-overflow: ellipsis;
          margin: 0 27px 19px 0;
          padding: 0 5px;
          line-height: 35px;
          text-align: center;
          border-radius: 4px;
          border: 1px solid #d3d3d3;
          cursor: pointer;
        }
      }
    }
  }
  .hot-job,
  .hot-company {
    margin-top: 55px;
    :deep(.el-tabs) {
      .el-tabs__nav-wrap {
        &::after {
          background-color: transparent;
        }
      }
      .el-tabs__item {
        padding: 0 34px;
        font-size: 16px;
      }
    }
    .title {
      position: relative;
      display: flex;
      justify-content: center;
      margin-bottom: 19px;
      text-align: center;
      .text {
        position: absolute;
        bottom: 4px;
        font-size: 28px;
        font-weight: 600;
        color: #484545;
      }
      .bg-line {
        width: 154px;
        height: 15px;
        display: inline-block;
        background: #d9d9d9;
      }
    }
  }
}
</style>
