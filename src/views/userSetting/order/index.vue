<template>
  <div class="filter">
    <el-form :model="condition" inline>
      <el-form-item label="商品名称">
        <el-input
          v-model="condition.goodsName"
          placeholder="商品名称"
          clearable
        />
      </el-form-item>
      <el-form-item label="订单状态">
        <el-select v-model="condition.status">
          <el-option label="全部" value="" />
          <el-option label="已支付" value="001" />
          <el-option label="已发货" value="002" />
          <el-option label="已完成" value="003" />
          <el-option label="已关闭" value="004" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">搜索</el-button>
      </el-form-item>
    </el-form>
  </div>
  <ul
    v-if="orderData && orderData.length"
    class="order-list"
    v-loading="loading"
  >
    <li class="order-item" v-for="(item, index) in orderData" :key="index">
      <el-image class="image" :src="item.image" />
      <div class="info-content" @click="openDetail(item)">
        <div class="title">
          <div class="goods-name">{{ item.goodsName }}</div>
          <div class="create-time">{{ formatDateTime(item.createTime) }}</div>
        </div>
        <div class="points">
          <div class="status">
            <el-text :type="statusMap[item.status]">{{
              statusText[item.status]
            }}</el-text>
          </div>
          <div class="status">
            <div>
              <span class="label">积分：</span>
              <span class="value">{{ item.totalPoints }}</span>
            </div>
            <div>
              <span class="label">共：</span>
              <span class="value">{{ item.quantity }}件</span>
            </div>
          </div>
        </div>
      </div>
    </li>
  </ul>
  <div v-else class="not-data">暂无数据</div>
  <div class="pagination">
    <el-pagination
      v-model:current-page="pageParams.currentPage"
      v-model:page-size="pageParams.pageSize"
      :page-sizes="[10, 20, 30, 45]"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
  <OrderDetail v-model="detailDialog" :detail="detailData" />
</template>
<script setup lang="ts">
import { reactive, ref } from "vue";
import { orderList } from "@/api";
import { formatDateTime } from "@/utils";

const loading = ref(false);
const detailDialog = ref(false);
const detailData = ref();
const orderData = ref<any>();
const total = ref(0);
const pageParams = reactive({
  pageSize: 10,
  currentPage: 1,
});
const condition = reactive({
  goodsName: "", // 商品名称
  status: "", // 订单状态
});
const statusText = {
  "001": "已支付",
  "002": "已发货",
  "003": "已完成",
  "004": "已关闭",
} as any;
const statusMap = {
  "001": "success",
  "002": "success",
  "003": "success",
  "004": "info",
} as any;

/** 搜索 */
const search = () => {
  pageParams.pageSize = 10;
  pageParams.currentPage = 1;
  getList();
};

const getList = async () => {
  loading.value = true;
  try {
    const res = await orderList({
      ...pageParams,
      condition: {
        ...condition,
      },
    });
    loading.value = false;
    total.value = res.body.totalCount;
    orderData.value = res.body.pageItems;
    console.log(res);
  } catch (error) {
    loading.value = false;
  }
};
getList();

// 修改每页数量
const handleSizeChange = (value: number) => {
  pageParams.pageSize = value;
  getList();
};

// 改变当前页
const handleCurrentChange = (value: number) => {
  pageParams.currentPage = value;
  getList();
};

/** 详情 */
const openDetail = (detail: any) => {
  detailData.value = detail;
  detailDialog.value = true;
};
</script>
<style lang="scss" scoped>
.order-list {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 15px;
  .order-item {
    display: flex;
    width: 100%;
    padding: 12px;
    border-bottom: 1px solid #ebebeb;
    .image {
      width: 65px;
      height: 65px;
      margin-right: 20px;
      border-radius: 5px;
    }
    .info-content {
      flex: 1;
      cursor: pointer;
    }
  }
  .title {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
    color: #666;
    .goods-name {
      font-size: 14px;
    }
    .create-time {
      font-size: 13px;
    }
  }
  .points {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    .status {
      font-size: 16px;
      .label {
        font-size: 14px;
        color: #666;
      }
      .value {
        color: #e20755;
      }
    }
  }
}
.not-data {
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #999;
}
</style>
