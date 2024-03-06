<template>
  <!-- 搜索 -->
  <SearchBar placeholder="请输入车辆名称" @handleSearch="toSearchCar" />
  <div class="main" v-loading="loading">
    <div class="rec-container min-width">
      <div class="min-header">
        <div class="buy-car">
          <div class="title">我要买车</div>
          <ul class="list price">
            <li class="item" v-for="(item, index) in prices" :key="index">
              {{ item }}
            </li>
          </ul>
          <ul class="list type">
            <li class="item" v-for="(item, index) in types" :key="index">
              {{ item }}
            </li>
          </ul>
          <ul class="list brand">
            <li class="item" v-for="(item, index) in brands" :key="index">
              {{ item }}
            </li>
            <li class="item all-brand">全部品牌</li>
          </ul>
        </div>
        <div class="sell-car">
          <div class="title">我要卖车</div>
          <div class="input-button">
            <el-input class="input" placeholder="请输入您的手机号"></el-input>
            <el-button class="button" type="primary" @click="sellCar"
              >卖车</el-button
            >
          </div>
          <div class="icons">
            <div class="item balance"></div>
            <div class="item rocket"></div>
            <div class="item safety"></div>
          </div>
        </div>
      </div>
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
    <SellCarList v-model="sellCarDialog" />
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { coreRec } from "@/api";
import { useRouter } from "vue-router";
import useRouterStore from "@/store/module/router";
import { useJump } from "@/hooks/jump";
import { getToken } from "@/utils/cache/cookies";
import { prices, types, brands } from "./data";

const jumpDetail = useJump();
const loading = ref(false);
const sellCarDialog = ref(false);
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

/** 卖车 */
const sellCar = () => {
  const token = getToken();
  if (!token) {
    return router.push("/login");
  }
  sellCarDialog.value = true;
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
.min-header {
  display: flex;
  margin-top: 40px;
  padding: 41px 30px 10px 41px;
  background: #ffffff;
  box-shadow: 0px 5px 22px 0px rgba(204, 204, 204, 0.25);
  border-radius: 8px;
  .buy-car {
    flex: 1;
  }
  .sell-car {
    width: 378px;
    margin-left: 42px;
    .input-button {
      display: flex;
      margin-bottom: 29px;
      .input {
        :deep(.el-input__wrapper) {
          width: 253px;
          height: 59px;
          margin-right: 11px;
          background: #f3f3f6;
          border-radius: 4px;
        }
      }
      .button {
        width: 114px;
        height: 59px;
        background: #e20755;
        border-radius: 4px;
      }
    }
    .icons {
      display: flex;
      padding-left: 37px;
      .item {
        position: relative;
        width: 36px;
        height: 37px;
        margin-right: 97px;
        background-repeat: no-repeat;
        background-size: cover;
        &:last-of-type {
          margin-right: 0;
        }
        &::after {
          position: absolute;
          top: 40px;
          right: 4px;
          font-size: 14px;
          color: #666666;
        }
        &.balance {
          background-image: url("@/assets/images/balance.png");
          background-position: 0 -3px;
          &::after {
            content: "透明";
          }
        }
        &.rocket {
          background-image: url("@/assets/images/rocket.png");
          &::after {
            content: "高效";
          }
        }
        &.safety {
          background-image: url("@/assets/images/safety.png");
          background-position: 0 -4px;
          &::after {
            content: "省心";
          }
        }
      }
    }
  }
  .title {
    display: flex;
    width: 88px;
    margin-bottom: 20px;
    font-weight: 600;
    font-size: 22px;
    color: #363636;
    line-height: 26px;
    text-align: left;
  }
  .list {
    display: flex;
    margin-bottom: 36px;
    .item {
      width: 85px;
      font-weight: 400;
      font-size: 14px;
      color: #000000;
      line-height: 16px;
      text-align: left;
      cursor: pointer;
      &.all-brand {
        display: flex;
        align-items: center;
        color: #bfbfbf;
        &::after {
          display: flex;
          content: "";
          width: 4px;
          height: 8px;
          margin-left: 4px;
          background: url("@/assets/images/right.png") no-repeat center;
          background-size: cover;
        }
      }
    }
  }
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
