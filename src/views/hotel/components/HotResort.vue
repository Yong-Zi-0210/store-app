<template>
  <ul class="hot-resort-list">
    <li
      class="resort-item"
      v-for="item in props.data"
      :key="item.id"
      @click="jumpDetail(item)"
    >
      <el-image class="image" fit="cover" :src="item.displayImage" lazy />
      <div class="name">{{ item.name }}</div>
      <div class="price-info">
        <span class="price">
          ¥
          <span class="price-value">{{ item.price }}</span>
          起
        </span>
        <span class="btn">立即抢购</span>
      </div>
    </li>
  </ul>
</template>
<script setup lang="ts">
import { useJump } from "@/hooks/jump";

const jumpDetail = useJump();
interface Props {
  data: any[];
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
});
</script>
<style scoped lang="scss">
.hot-resort-list {
  display: flex;
  flex-wrap: wrap;
  margin-right: -15px;
  .resort-item {
    display: flex;
    flex-direction: column;
    margin: 0 15px 32px 0;
    .image {
      width: 228px;
      height: 149px;
      margin-bottom: 10px;
      background: #d9d9d9;
      border-radius: 8px;
    }
    .name {
      margin-bottom: 12px;
      font-size: 16px;
      font-weight: 500;
      color: #000000;
      line-height: 22px;
    }
    .price-info {
      display: flex;
      justify-content: space-between;
      .price {
        font-size: 12px;
        color: #e20755;
      }
      .price-value {
        font-size: 22px;
      }
      .btn {
        width: 107px;
        line-height: 32px;
        text-align: center;
        color: #fff;
        background: #e20755;
        cursor: pointer;
      }
    }
  }
}
</style>
