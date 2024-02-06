<template>
  <div class="rec" v-loading="loading">
    <div class="sider">
      <div class="title">精选商品</div>
      <ul class="sider-list" v-if="siderList">
        <li
          class="sider-item"
          v-for="item in siderList"
          :key="item.productId"
          @click="jumpDetail(item)"
        >
          <el-image :src="item.displayImage" fit="cover"></el-image>
          <div class="name">{{ item.name }}</div>
          <div class="points">
            <span>{{ item.description }}</span
            >积分
          </div>
          <div class="price">¥{{ item.secondaryName }}</div>
        </li>
      </ul>
    </div>
    <GoodsList :goods-list="goods" />
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { useJump } from "@/hooks/jump";
import { coreRec } from "@/api";

const jumpDetail = useJump();
const loading = ref(false);
const siderList = ref();
const goods = ref();
const getCoreRec = async (type: string) => {
  loading.value = true;
  try {
    const res = await coreRec({
      pageSize: 10,
      currentPage: 1,
      condition: {
        web: "003",
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
    getCoreRec("001"), // 侧边精选商品
    getCoreRec("002"), // 右边列表
  ];
  const res = await Promise.all(requestList);
  const [sider, good] = res;
  siderList.value = sider;
  goods.value = good;
};
getRecData();
</script>
<style lang="scss" scoped>
.rec {
  overflow: hidden;
  padding-top: 13px;
}
.sider {
  float: left;
  width: 178px;
  padding: 12px;
  box-sizing: border-box;
  font-size: 12px;
  color: #666;
  border: 1px solid #e9e9e9;
  .title {
    margin-bottom: 7px;
  }
  .sider-item {
    margin-bottom: 32px;
    cursor: pointer;
    :deep(.el-image) {
      height: 100%;
      width: 100%;
    }
    .name {
      line-height: 14px;
      display: inline-block;
    }
    .points {
      font-size: 12px;
      font-weight: 400;
      color: #e20755;
      span {
        font-size: 16px;
      }
    }
  }
}
</style>
