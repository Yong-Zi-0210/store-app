<template>
  <!-- 搜索 -->
  <SearchBar placeholder="请输入车辆名称" @handleSearch="toSearchCar" />
  <div class="main" v-loading="loading">
    <div class="rec-container min-width">
      <div class="banner">
        <el-carousel :interval="3000" height="427px" indicator-position="none">
          <el-carousel-item v-for="item in coreRecData" :key="item.id">
            <div class="images">
              <div class="main-image" @click="jumpDetail(item.main)">
                <el-image fit="cover" :src="item.main.displayImage"></el-image>
                <div class="name">{{ item.main.secondaryName }}</div>
              </div>
              <div class="other-image">
                <ul class="other-list">
                  <li
                    class="other-item"
                    v-for="other in item.other"
                    :key="other.id"
                    @click="jumpDetail(other)"
                  >
                    <el-image fit="cover" :src="other.displayImage"></el-image>
                    <div class="name">{{ other.secondaryName }}</div>
                  </li>
                </ul>
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
      <div class="first-rec">
        <ul class="first-rec-list">
          <li
            class="rec-item"
            v-for="item in firstRecData"
            :key="item.id"
            @click="jumpDetail(item)"
          >
            <div class="title">{{ item.secondaryName }}</div>
            <el-image class="image" fit="cover" :src="item.displayImage" lazy />
          </li>
        </ul>
      </div>
      <div class="rec">
        <div class="title">好车推荐</div>
        <ul class="rec-list">
          <li
            class="rec-item"
            v-for="item in recData"
            :key="item.id"
            @click="jumpDetail(item)"
          >
            <el-image class="image" fit="cover" :src="item.displayImage" lazy />
            <div class="name">{{ item.secondaryName }}</div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { coreRec } from "@/api";
import { useRouter } from "vue-router";
import useRouterStore from "@/store/module/router";
import { useJump } from "@/hooks/jump";

const jumpDetail = useJump();
const loading = ref(false);
const router = useRouter();
const paramsStore = useRouterStore();
const coreRecData = ref<any>([]); // 主推
const firstRecData = ref<any>([]); // 首推
const recData = ref<any>([]); // 推荐

/** 获取推荐数据 */
const getCoreRec = async (type: string) => {
  loading.value = true;
  try {
    const res = await coreRec({
      pageSize: 10,
      currentPage: 1,
      condition: {
        web: "001",
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
  const requestList = [getCoreRec("001"), getCoreRec("002"), getCoreRec("003")];
  const res = await Promise.all(requestList);
  const [coreRec, firstRec, rec] = res;
  coreRecData.value = setBannerData(coreRec);
  firstRecData.value = firstRec;
  recData.value = rec;
};
getRecData();

/** 设置轮播图数据 */
const setBannerData = (list: Array<any>) => {
  const length = 5;
  const newArr: any[] = [];
  for (let i = 0; i < list.length; i += length) {
    newArr.push({
      main: list[i],
      other: list.slice(i + 1, i + length),
    });
  }
  return newArr;
};

/** 跳转搜索页 */
const toSearchCar = (value: string) => {
  paramsStore.setSearchValue(value);
  router.push({
    name: "Search",
  });
};
</script>
<style lang="scss" scoped>
.main {
  display: flex;
  align-items: center;
  height: 100%;
  width: 100%;
  margin-top: 13px;
  flex-direction: column;
  background: #fff;
}
.banner {
  margin-top: 80px;
  height: 427px;
  :deep(.el-carousel__arrow) {
    background-color: rgba(31, 45, 61, 0.5);
    &:hover {
      background-color: rgba(31, 45, 61, 0.8);
    }
  }
  .images {
    display: flex;
    .main-image {
      position: relative;
      width: 602px;
      height: 427px;
      border-radius: 8px;
      overflow: hidden;
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
      cursor: pointer;
      :deep(.el-image) {
        height: 100%;
        width: 100%;
      }
      .name {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 54px;
        line-height: 54px;
        text-align: center;
        color: #fff;
        font-size: 18px;
        background: rgba(0, 0, 0, 0.5);
        border-radius: 0px 0px 8px 8px;
      }
    }
    .other-image {
      display: flex;
      flex: 1;
    }
    .other-list {
      display: flex;
      flex-wrap: wrap;
      .other-item {
        position: relative;
        width: 289px;
        height: 208px;
        margin: 0 0 11px 10px;
        border-radius: 8px;
        overflow: hidden;
        background-size: cover;
        cursor: pointer;
        :deep(.el-image) {
          height: 100%;
          width: 100%;
        }
        .name {
          position: absolute;
          bottom: 0;
          width: 100%;
          height: 30px;
          line-height: 30px;
          text-align: center;
          background: rgba(0, 0, 0, 0.5);
          border-radius: 0px 0px 8px 8px;
          font-size: 12px;
          color: #ffffff;
        }
      }
    }
  }
}
.first-rec {
  margin-top: 121px;
  .first-rec-list {
    display: flex;
    .rec-item {
      margin-right: 12px;
      .title {
        margin-bottom: 15px;
        font-size: 24px;
        color: #000000;
      }
    }
    .image {
      width: 394px;
      height: 143px;
      background: #d9d9d9;
      border-radius: 4px;
      overflow: hidden;
      background-position: center;
      background-size: cover;
      background-repeat: no-repeat;
      cursor: pointer;
    }
  }
}
.rec {
  margin-top: 73px;
  .title {
    margin-bottom: 24px;
    font-size: 28px;
    font-weight: 600;
    color: #333333;
  }
  .rec-list {
    display: flex;
    flex-wrap: wrap;
    margin-right: -20px;
    .rec-item {
      margin: 0 18px 46px 0;
      .image {
        width: 287px;
        height: 191px;
        margin-bottom: 12px;
        border-radius: 4px;
        overflow: hidden;
        background-position: center;
        background-size: cover;
        background-repeat: no-repeat;
        cursor: pointer;
      }
      .name {
        font-size: 16px;
        font-weight: 500;
        color: #535353;
      }
    }
  }
}
</style>
