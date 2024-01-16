<template>
  <ul class="hot-hotel-list">
    <li
      class="hotel-item"
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
const obj = {
  name: "上海迪士尼乐园酒店",
  price: "1554",
};

const arr = new Array(4).fill(obj);
const props = withDefaults(defineProps<Props>(), {
  data: () => [],
});
</script>
<style scoped lang="scss">
.hot-hotel-list {
  display: flex;
  flex-wrap: wrap;
  margin-right: -20px;
  .hotel-item {
    display: flex;
    flex-direction: column;
    margin: 0 19px 32px 0;
    .image {
      width: 286px;
      height: 187px;
      margin-bottom: 17px;
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
