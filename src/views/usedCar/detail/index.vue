<template>
  <!-- 搜索 -->
  <SearchBar placeholder="请输入" />
  <div class="detail min-width">
    <Breadcrumb />
    <div class="detail-info" v-loading="loading">
      <!-- 基本信息 -->
      <div class="info-item base">
        <div class="base-main">
          <div class="left">
            <div
              class="show-image"
              :style="{
                backgroundImage: `url(${showImage})`,
              }"
            />
            <div class="banner">
              <detail-swiper
                :bannerList="bannerList"
                @change="handleCheckImg"
              />
            </div>
          </div>
          <div class="right">
            <div class="name">
              {{ title }}
            </div>
            <ul class="attrs">
              <li class="attr-item" v-for="item in baseAttr" :key="item.value">
                <div class="item-value">{{ item.value }}</div>
                <div class="item-name">{{ item.name }}</div>
              </li>
            </ul>
            <div class="price">
              <span>¥</span>
              <span class="price-num">{{ formatPrice }}</span>
              <span>万</span>
            </div>
            <div class="communication">
              <el-button type="primary" @click="communication"
                >预约看车</el-button
              >
              <div class="phone">
                <span>电话咨询</span>
                <span>400-050-0000</span>
              </div>
            </div>
          </div>
        </div>
        <div class="base-check">
          <img v-for="url in checkImage" :src="url" alt="" />
        </div>
      </div>
      <!-- 车辆详情 -->
      <div class="info-item in-detail">
        <div class="title">车辆详情</div>
        <div class="content">
          <div class="icon">
            <SvgIcon name="in-detail-icon" style="width: 100%; height: 85px" />
          </div>
          <div class="description">
            <div class="description-title">资深顾问推荐</div>
            <div class="description-content">{{ descValue }}</div>
          </div>
        </div>
      </div>
      <!-- 外观 -->
      <div class="info-item outside">
        <div class="title">车辆外观</div>
        <ul class="image-content">
          <li
            class="image-item"
            v-for="(url, index) in outsideImage"
            :class="index > 3 ? 'small' : ''"
            :key="index"
          >
            <img :src="url" />
          </li>
        </ul>
      </div>
      <!-- 内饰 -->
      <div class="info-item inside">
        <div class="title">车辆内饰</div>
        <ul class="image-content">
          <li
            class="image-item"
            v-for="(url, index) in insideImage"
            :class="index > 3 ? 'small' : ''"
            :key="index"
          >
            <img :src="url" />
          </li>
        </ul>
      </div>
      <!-- 发动机 -->
      <div class="info-item engine">
        <div class="title">发动机底盘</div>
        <ul class="image-content">
          <li
            class="image-item"
            v-for="(url, index) in engineImage"
            :class="index > 3 ? 'small' : ''"
            :key="index"
          >
            <img :src="url" />
          </li>
        </ul>
      </div>
      <!-- 参数配置 -->
      <div class="info-item params">
        <div class="title">配置参数</div>
        <div class="params-content">
          <ul class="params-sidebar">
            <li
              class="sidebar-item"
              v-for="(item, index) in paramsData"
              :class="currentIndex === index ? 'active' : ''"
              :key="index"
              @click="handleSelect(index)"
            >
              {{ item.name }}
            </li>
          </ul>
          <div class="params-table">
            <div class="header">{{ paramsTable?.name }}</div>
            <ul
              class="table-item"
              v-for="(item, index) in tableData"
              :key="index"
            >
              <li class="item" v-for="config in item">
                <span class="label" :title="config.label">{{
                  config.label
                }}</span>
                <span class="value" :title="config.value">{{
                  config.value
                }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <!-- 预约看车弹出窗 -->
    <Communicate v-model="communicateDialog" :info="carInfo" />
  </div>
</template>
<script setup lang="ts">
import { onMounted, watch, ref, computed, reactive } from "vue";
import { useRouter } from "vue-router";
import { detail } from "@/api/usedCar";
import useSettingStore from "@/store/module/setting";
import useRouterStore from "@/store/module/router";
import { setMileage, setPrice, formatDateTime } from "@/utils";
import { getToken } from "@/utils/cache/cookies";

const settingStore = useSettingStore();
const { carDetail } = useRouterStore();
const router = useRouter();
const loading = ref(false);
const communicateDialog = ref(false);
const showImage = ref(""); // 显示的图片
const bannerList = ref([]); // 小轮播图
const title = ref(""); // 详情车名
const carPrice = ref(0); // 车价
const baseAttr = ref<any>([]); // 右侧展示的属性
const checkImage = ref([]); // 车检图片
const descValue = ref(""); // 车辆详情描述
const outsideImage = ref([]); // 外观图片
const insideImage = ref([]); // 内饰图片
const engineImage = ref([]); // 发动机图片
const paramsData = ref<any>([]); // 参数配置
const currentIndex = ref(0); // 当前选中的参数
const tableData = ref<any>([]);
const carInfo = reactive({
  dealerId: "",
  carId: "",
  carTitle: "",
});

// 设置footer颜色
watch(
  () => router.currentRoute.value.path,
  () => {
    settingStore.setFooterBgColor("#f4f4f4");
  },
  { immediate: true, deep: true }
);
// 参数表格数据
const paramsTable = computed(() => paramsData.value[currentIndex.value]);
// 初始化
onMounted(async () => {
  await getDetail();
  tableData.value = setTableData();
});

const formatPrice = computed(() => {
  const price = setPrice(carPrice.value);
  if (typeof price === "string") {
    return price?.replace("万", "");
  } else {
    return price;
  }
});

/** 获取详情数据 */
const getDetail = async () => {
  loading.value = true;
  try {
    const res = await detail({
      id: carDetail.productId || carDetail.id,
    });
    loading.value = false;
    const {
      id,
      dealerId,
      images,
      name,
      price,
      checkReports,
      description,
      appearances,
      interiors,
      chassises,
      params,
    } = res.body;
    showImage.value = images[0];
    bannerList.value = images;
    title.value = name;
    carPrice.value = price;
    descValue.value = description;
    checkImage.value = checkReports;
    outsideImage.value = appearances;
    insideImage.value = interiors;
    engineImage.value = chassises;
    paramsData.value = params ? JSON.parse(params)?.data?.vehicleConfig : [];
    setAttr(res.body);
    carInfo.carId = id;
    carInfo.carTitle = name;
    carInfo.dealerId = dealerId;
  } catch (error) {
    loading.value = false;
  }
};

/** 设置基础信息 */
const setAttr = (data: any) => {
  const {
    mileage,
    firstPlateTime,
    city,
    emissionStandard,
    transmission,
    transferNum,
  } = data;
  baseAttr.value = [
    { name: "表公里数", value: setMileage(mileage) },
    { name: "上牌时间", value: formatDateTime(firstPlateTime, "YYYY-MM-DD") },
    { name: "车辆所在地", value: city },
    { name: "排放标准", value: emissionStandard },
    { name: "变速器", value: transmission },
    { name: "过户次数", value: transferNum },
  ];
};

/** 切换图片 */
const handleCheckImg = (url: string) => {
  showImage.value = url;
};

/** 切换参数 */
const handleSelect = (index: number) => {
  currentIndex.value = index;
  tableData.value = setTableData();
};

/** 预约看车 */
const communication = () => {
  const token = getToken();
  if (!token) {
    return router.push("/login");
  }
  communicateDialog.value = true;
};

/** 重置参数成表格需要的格式 */
const setTableData = () => {
  let tableData = [];
  for (const key in paramsTable.value.config) {
    tableData.push({
      label: key,
      value: paramsTable.value.config[key],
    });
  }
  const group = 3;
  const newArr = [];
  for (let i = 0; i < tableData.length; i += group) {
    newArr.push(tableData.slice(i, i + group));
  }
  return newArr;
};
</script>
<style lang="scss" scoped>
.detail {
  display: flex;
  flex-direction: column;
  margin-top: 14px;
  height: 100%;
  .app-breadcrumb {
    height: 20px;
    line-height: 20px;
    margin-bottom: 8px;
    :deep(.el-breadcrumb__item) {
      .el-breadcrumb__inner {
        color: #e20755;
        a {
          color: #e20755;
        }
      }
      &:last-of-type {
        .el-breadcrumb__inner {
          color: #333;
        }
      }
    }
  }
  .detail-info {
    display: flex;
    flex: 1;
    flex-direction: column;
    margin-bottom: 59px;
    .info-item {
      padding: 16px 20px;
      background-color: #fff;
      margin-bottom: 10px;
    }
    .base {
      .base-main {
        display: flex;
        .left {
          width: 563px;
          margin-right: 42px;
          flex-shrink: 0;
          .show-image {
            height: 372px;
            background-position: center;
            background-repeat: no-repeat;
            background-size: cover;
          }
          .banner {
            height: 70px;
            margin-top: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
        .right {
          .name {
            margin-bottom: 20px;
            font-size: 20px;
            font-weight: 500;
            color: #000000;
          }
          .attrs {
            display: flex;
            flex-wrap: wrap;
            margin-right: -16px;
            .attr-item {
              position: relative;
              display: flex;
              flex-direction: column;
              justify-content: center;
              padding-right: 40px;
              margin: 0 40px 29px 0;
              .item-value {
                height: 22px;
                margin-bottom: 6px;
                font-size: 16px;
                color: #333333;
              }
              .item-name {
                font-size: 12px;
                color: #999999;
              }
              &::after {
                position: absolute;
                right: 0;
                top: 6px;
                content: "";
                height: 33px;
                width: 2px;
                background-color: #dedede;
              }
              &:nth-of-type(4) {
                &::after {
                  content: "";
                  width: 0;
                }
              }
              &:last-of-type {
                &::after {
                  content: "";
                  width: 0;
                }
              }
            }
          }
          .price {
            margin-top: 23px;
            color: #e20755;
            .price-num {
              font-size: 22px;
              font-weight: 500;
            }
          }
          .communication {
            margin-top: 158px;
            padding-top: 16px;
            display: flex;
            :deep(.el-button) {
              width: 197px;
              height: 54px;
              margin-right: 20px;
              border-radius: 4px 4px 4px 4px;
            }
            .phone {
              display: flex;
              flex-direction: column;
              justify-content: flex-end;
              font-size: 14px;
              color: #999999;
            }
          }
        }
      }
      .base-check {
        margin-top: 33px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        overflow: hidden;
        img {
          width: 1122px;
          height: 100%;
        }
      }
    }
    .in-detail {
      padding: 23px 29px 23px 44px;
      .title {
        margin-bottom: 29px;
        padding-bottom: 18px;
        font-size: 20px;
        color: #333333;
        border-bottom: 1px solid #dedede;
      }
      .content {
        display: flex;
        .icon {
          width: 85px;
          margin-right: 26px;
          flex-shrink: 0;
        }
        .description {
          display: flex;
          flex-direction: column;
          .description-title {
            font-size: 18px;
            color: #000000;
          }
          .description-content {
            margin-top: 18px;
            padding: 15px;
            color: #666666;
            background-color: #fbfbfc;
          }
        }
      }
    }
    .outside,
    .inside,
    .engine {
      padding: 23px 40px;
      .title {
        margin-bottom: 29px;
        font-size: 20px;
        color: #333333;
      }
      .image-content {
        display: flex;
        flex-wrap: wrap;
        margin-right: -18px;
        .image-item {
          width: 550px;
          height: 356px;
          margin: 0 18px 18px 0;
          overflow: hidden;
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          &.small {
            width: 266px;
            height: 172px;
          }
        }
      }
    }
    .params {
      padding: 23px 40px;
      .title {
        margin-bottom: 29px;
        font-size: 20px;
        color: #333333;
      }
      .params-content {
        display: flex;
      }
      .params-sidebar {
        margin-right: 39px;
        .sidebar-item {
          width: 100px;
          height: 32px;
          line-height: 32px;
          font-size: 14px;
          color: #666666;
          text-align: center;
          cursor: pointer;
          &.active {
            color: #ffffff;
            background: #e20755;
          }
        }
      }
      .params-table {
        display: flex;
        flex: 1;
        flex-direction: column;
        .header {
          width: 100%;
          height: 36px;
          padding-left: 17px;
          line-height: 36px;
          background: #f9f9f9;
          color: #e20755;
          border: 1px solid #ebebeb;
          box-sizing: border-box;
        }
        .table-item {
          display: flex;
          height: 36px;
          line-height: 36px;
          border: 1px solid #ebebeb;
          font-size: 13px;
          &:nth-of-type(even) {
            background-color: #f9f9f9;
          }
          .item {
            display: flex;
            width: 33%;
          }
          .label {
            width: 180px;
            margin-right: 15px;
            flex-shrink: 0;
            text-align: right;
            color: #999999;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .value {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            color: #333333;
          }
        }
      }
    }
  }
}
</style>
@/store/module/router
