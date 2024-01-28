<template>
  <ul class="goods-list" v-if="props.goodsList">
    <li
      class="goods-item"
      v-for="item in props.goodsList"
      :key="item.productId"
    >
      <el-image :src="item.displayImage" fit="cover"></el-image>
      <div class="price">
        ¥<span>{{ item.secondaryName }}</span>
      </div>
      <div class="name">{{ item.name }}</div>
      <div class="description" :title="item.description">
        {{ item.description }}
      </div>
      <div class="btn" @click="jumpDetail(item)">兑换</div>
    </li>
  </ul>
</template>
<script setup lang="ts">
import { useJump } from "@/hooks/jump";

const jumpDetail = useJump();
interface Props {
  goodsList?: any[];
}
const props = withDefaults(defineProps<Props>(), {
  goodsList: () => [],
});
</script>
<style lang="scss" scoped>
.goods-list {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -17px 0 194px;
  font-size: 12px;
  color: #666;
  .goods-item {
    width: 184px;
    margin: 0 17px 36px 0;
    box-sizing: border-box;
    :deep(.el-image) {
      width: 100%;
      height: 184px;
    }
    .price {
      margin-top: 5px;
      color: #e20755;
      span {
        font-size: 24px;
      }
    }
    .name {
      height: 42px;
      margin-top: 3px;
      line-height: 14px;
      display: inline-block;
    }
    .description {
      width: 184px;
      overflow: hidden;
      text-overflow: ellipsis;
      text-wrap: nowrap;
      margin-top: 6px;
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
</style>
