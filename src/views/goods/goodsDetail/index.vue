<template>
  <SearchBar placeholder="请输入" />
  <div class="goods-detail min-width" v-loading="loading">
    <Breadcrumb />
    <div class="base-info">
      <div class="info-left">
        <el-image class="iamge" :src="showImage" fit="cover"></el-image>
        <goods-detail-swiper
          :bannerList="detail.images"
          @change="handleCheckImg"
        />
      </div>
      <div class="info-right">
        <div class="info-right-top">
          <div class="goods-name">{{ detail.goodsName }}</div>
          <div class="price-info">
            <ul class="info-list">
              <li class="info-item">
                <span class="info-label">价格：</span>
                <span class="info-value"
                  >¥<span>{{ detail.price }}</span></span
                >
              </li>
            </ul>
          </div>
          <ul class="specs-list">
            <li class="specs-item" v-if="token">
              <span class="specs-label">配送至：</span>
              <!-- 配送地址 -->
              <AddressSelect
                v-model:deliveryName="exchangeParams.deliveryName"
                v-model:deliveryPhone="exchangeParams.deliveryPhone"
                v-model:deliveryArea="exchangeParams.deliveryArea"
                v-model:deliveryAddress="exchangeParams.deliveryAddress"
              />
              <el-button class="addAddress" type="primary"
                >新增收货地址</el-button
              >
            </li>
            <li
              class="specs-item"
              v-for="(item, index) in specsList"
              :key="index"
            >
              <span class="specs-label">{{ item.label }}：</span>
              <ul class="specs-value">
                <li
                  class="value-item"
                  v-for="(name, valueIndex) in item.value"
                  :key="valueIndex"
                  :class="checkParms[item.label] === name ? 'active' : ''"
                  @click="selectValue(item.label, name)"
                >
                  <div class="stockout-tips" v-if="currentSotck.includes(name)">
                    缺货
                  </div>
                  <span :class="currentSotck.includes(name) ? 'stockout' : ''">
                    {{ name }}
                  </span>
                </li>
              </ul>
            </li>
            <li class="specs-item">
              <span class="specs-label">数量：</span>
              <el-input-number
                v-if="stockQuantity"
                v-model="quantity"
                :min="1"
                :max="maxQuantity"
              />
              <span v-if="stockQuantity" class="stock-quantity"
                >剩余：{{ stockQuantity }}</span
              >
            </li>
          </ul>
        </div>
        <div class="exchange">
          <el-button
            type="primary"
            class="btn"
            @click="exchange"
            :disabled="token && !stockQuantity"
            >兑换</el-button
          >
        </div>
      </div>
    </div>
    <div class="detail-info">
      <div class="title">商品详情</div>
      <div class="detail-content" v-html="detail.description" />
    </div>
    <!-- 兑换弹窗 -->
    <Exchange
      v-model="exchangeDialog"
      :loading="exchangeLoading"
      :points="detail.points"
      @confirm="confirmExchange"
    />
  </div>
</template>
<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";
import useRouterStore from "@/store/module/router";
import useUserStore from "@/store/module/user";
import { getGoodsDetail, goodsExchange, getUserPoints } from "@/api";
import { getToken } from "@/utils/cache/cookies";
import { ElMessage } from "element-plus";

const router = useRouter();
const userStore = useUserStore();
const { goodsDetail } = useRouterStore();
const token = getToken();
const loading = ref(false);
const exchangeLoading = ref(false);
const exchangeDialog = ref(false);
const detail = ref<any>({}); // 详情数据
const showImage = ref(""); // 显示图片
const specsList = ref<any>([]);
const specsStructure = ref<string[]>([]); // 组合排序顺序
const quantity = ref(1); // 兑换数量
const checkParms = reactive<any>({}); // 选择的规格
const exchangeParams = reactive({
  deliveryName: "",
  deliveryPhone: "",
  deliveryArea: "",
  deliveryAddress: "",
});
const skuKeys = ref<string[]>([]); // 所有组合的key
const currentSotck = ref<string[]>([]);
const sotckData = ref<any>({}); // 所有缺货的组合

// 最大数量
const maxQuantity = computed(() => {
  if (stockQuantity.value > 10) {
    return 10;
  } else {
    return stockQuantity.value;
  }
});
// 所选组合的id
const skuId = computed(() => {
  const skuKeyArr: string[] = [];
  specsStructure.value.forEach((key) => {
    checkParms[key] && skuKeyArr.push(checkParms[key]);
  });
  const key = skuKeyArr.length ? skuKeyArr.join(",") : "";
  if (key) {
    return detail.value?.goodsSkus[key]?.skuId;
  } else {
    return "";
  }
});

// 用户所选的商品剩余数量
const stockQuantity = computed(() => {
  const skuKeyArr: string[] = [];
  specsStructure.value.forEach((key) => {
    checkParms[key] && skuKeyArr.push(checkParms[key]);
  });
  const key = skuKeyArr.length ? skuKeyArr.join(",") : "";
  if (key) {
    return detail.value?.goodsSkus[key]?.stockQuantity;
  } else {
    return "";
  }
});

// 当前选择缺货的组合
watch(
  () => Object.values(checkParms),
  () => {
    tipsStock();
  }
);

/** 提示缺货 */
const tipsStock = () => {
  if (detail.value.specType) {
    currentSotck.value.length = 0;
    for (const key in checkParms) {
      const name = checkParms[key];
      if (sotckData.value[name]) {
        console.log(sotckData.value[name]);
        currentSotck.value.push(...sotckData.value[name]);
      }
    }
  } else {
    currentSotck.value = JSON.parse(JSON.stringify(sotckData.value));
  }
};

// 获取缺货的组合的key
const getstockData = (goodsSkus: any) => {
  const stockKey = [];
  for (const key in goodsSkus) {
    skuKeys.value.push(key);
    if (goodsSkus[key].status === "005") {
      stockKey.push(key);
    }
  }
  return stockKey;
};

// 设置缺货组合
const setStockData = (specType: boolean, stockKeys: string[]) => {
  if (specType) {
    const stockMap = {} as any;
    stockKeys.forEach((item) => {
      const keys = item.split(",");
      keys.forEach((key: any, index: number) => {
        const newKeys = JSON.parse(JSON.stringify(keys));
        newKeys.splice(index, 1);
        stockMap[key] = newKeys;
      });
    });
    return stockMap;
  } else {
    return stockKeys;
  }
};

/** 获取详情 */
const getDetail = async () => {
  loading.value = true;
  try {
    const res = await getGoodsDetail({
      id: goodsDetail.productId | goodsDetail.id,
    });
    loading.value = false;
    detail.value = res.body;
    showImage.value = res.body.images[0];
    for (const key in res.body.specs) {
      specsStructure.value.push(key);
      specsList.value.push({
        label: key,
        value: res.body.specs[key].split(","),
      });
    }
    const sotckKeys = getstockData(res.body.goodsSkus);
    sotckData.value = setStockData(res.body.specType, sotckKeys);
    console.log(sotckData.value);
    tipsStock();
    // setDefaultParams(specsList.value);
  } catch (error) {
    loading.value = false;
  }
};
getDetail();

/** 设置默认选择的规格 */
// const setDefaultParams = (specsList: Array<any>) => {
//   specsList.forEach((item: any) => {
//     checkParms[item.label] = item.value[0];
//   });
// };

/** 切换图片 */
const handleCheckImg = (url: string) => {
  showImage.value = url;
};

/** 选择规格参数 */
const selectValue = (type: string, value: string) => {
  if (checkParms[type] === value) {
    delete checkParms[type];
  } else {
    checkParms[type] = value;
    console.log(checkParms);
  }
};

/** 兑换 */
const exchange = () => {
  console.log(exchangeParams);
  if (!token) {
    return router.push("/login");
  }
  if (!exchangeParams.deliveryAddress) {
    return ElMessage.warning("请选择配送地址");
  }
  exchangeDialog.value = true;
};
const confirmExchange = async () => {
  exchangeLoading.value = true;
  try {
    await goodsExchange({
      goodsId: detail.value.id,
      goodsSkuId: skuId.value,
      quantity: quantity.value,
      ...exchangeParams,
    });
    exchangeLoading.value = false;
    exchangeDialog.value = false;
    ElMessage.success("兑换成功");
    const { body } = await getUserPoints();
    userStore.updatePoints(body.points);
    body.points;
  } catch (error) {
    exchangeLoading.value = false;
  }
};
</script>
<style lang="scss" scoped>
.goods-detail {
  margin-top: 14px;
  .base-info {
    display: flex;
    margin-top: 8px;
    padding: 12px 20px;
    background-color: #fff;
    .info-left {
      width: 450px;
      margin-right: 20px;
      flex-shrink: 0;
      .iamge {
        height: 450px;
        width: 100%;
      }
    }
    .info-right {
      display: flex;
      flex-direction: column;
      flex: 1;
      .info-right-top {
        flex: 1;
      }
      .goods-name {
        font-size: 20px;
        font-weight: 500;
        color: #000000;
        line-height: 23px;
      }
      .price-info {
        margin-top: 21px;
        padding: 17px 20px;
        background: #fbfbfc;
        border-radius: 8px;
        .info-item {
          display: flex;
          align-items: center;
          .info-label {
            font-size: 14px;
            color: #999999;
            margin-right: 32px;
          }
          .info-value {
            color: #e20755;
            span {
              font-size: 22px;
            }
          }
        }
      }
      .specs-list {
        margin-top: 19px;
        padding-left: 20px;
        .specs-item {
          display: flex;
          justify-content: flex-start;
          margin-bottom: 8px;
          .stock-quantity {
            line-height: 40px;
            margin-left: 20px;
            font-size: 14px;
          }
          .addAddress {
            height: 40px;
            margin-left: 20px;
          }
          .specs-label {
            padding: 8px 0;
            width: 75px;
            flex-shrink: 0;
            font-size: 14px;
            line-height: 16px;
            color: #666666;
          }
          .specs-value {
            display: flex;
            flex-wrap: wrap;
            align-content: flex-start;
            .value-item {
              position: relative;
              height: 40px;
              margin: 0 8px 8px 0;
              padding: 0 8px;
              line-height: 36px;
              text-align: center;
              font-size: 14px;
              color: #333;
              background: #f0f0f0;
              border: 1px solid #f0f0f0;
              border-radius: 5px;
              cursor: pointer;
              box-sizing: border-box;
              .stockout-tips {
                position: absolute;
                display: flex;
                align-items: center;
                right: -6px;
                top: -8px;
                background-color: #fff;
                border-radius: 10px;
                height: 20px;
                font-size: 12px;
                padding: 5px;
              }
              .stockout {
                color: #999999;
              }
              &.active {
                border: 1px solid #e20755;
                box-sizing: border-box;
              }
            }
          }
        }
      }
      .exchange {
        height: 64px;
        line-height: 64px;
        .btn {
          width: 50%;
          height: 45px;
          margin-left: 98px;
          // line-height: 45px;
          // text-align: center;
          // background: #e20755;
          // border-radius: 2px;
          // color: #fff;
          // cursor: pointer;
        }
      }
    }
  }
  .detail-info {
    margin: 16px 0 72px 0;
    padding: 11px 42px;
    background-color: #fff;
    .title {
      margin-bottom: 11px;
      font-size: 16px;
      color: #e20755;
    }
  }
}
</style>
