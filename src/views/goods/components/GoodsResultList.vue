<template>
  <div class="search-result">
    <ul class="goods-list" v-if="props.dataList">
      <li class="goods-item" v-for="item in props.dataList" :key="item.id">
        <el-image :src="item.displayImage" fit="cover"></el-image>
        <div class="points">
          <span>{{ item.points }}</span
          >积分
        </div>
        <div class="price">
          ¥<span>{{ item.price }}</span>
        </div>
        <div class="title" :title="item.goodsTitle">
          {{ item.goodsTitle }}
        </div>
        <div class="name">{{ item.goodsName }}</div>
        <div class="btn" @click="jumpDetail(item.id)">兑换</div>
      </li>
    </ul>
    <div v-else class="no-data">暂无商品</div>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from "vue-router";
import useRouterStore from "@/store/module/router";

const paramsStore = useRouterStore();
const router = useRouter();
interface Props {
  dataList: any[];
}
const props = withDefaults(defineProps<Props>(), {
  dataList: () => [],
});

const jumpDetail = (id: string) => {
  paramsStore.setGoodsDetail({ id });
  router.push("goodsDetail");
};
</script>
<style lang="scss" scoped>
.search-result {
  display: flex;
  flex: 1;
  .goods-list {
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    margin-right: -25px;
    font-size: 12px;
    color: #666;
    .goods-item {
      width: 220px;
      margin: 0 25px 36px 0;
      box-sizing: border-box;
      :deep(.el-image) {
        width: 100%;
        height: 220px;
      }
      .points {
        margin-top: 5px;
        color: #e20755;
        span {
          font-size: 24px;
        }
      }
      .name {
        margin-top: 3px;
        line-height: 14px;
        display: inline-block;
        color: #333;
      }
      .title {
        height: 42px;
        margin-top: 6px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 3;
      }
      .btn {
        width: 100%;
        height: 30px;
        margin-top: 15px;
        line-height: 30px;
        text-align: center;
        background: #e20755;
        border-radius: 2px;
        color: #fff;
        cursor: pointer;
      }
    }
  }
  .no-data {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 300px;
  }
}
</style>
