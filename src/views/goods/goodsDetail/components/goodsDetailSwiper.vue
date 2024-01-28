<template>
  <div class="banner">
    <div class="arrow-left" @click="prevVSwiperSlide" />
    <swiper
      :modules="modules"
      :slides-per-view="slidesPerView"
      :hideOnClick="false"
      :space-between="12"
      :loop="true"
      @swiper="setVSwiperRef"
      class="base-swiper"
    >
      <swiper-slide v-for="(url, index) in props.bannerList" :key="index">
        <el-image
          class="image-item"
          :key="url"
          fit="cover"
          :src="url"
          @click="handleChange(url)"
          lazy
        />
      </swiper-slide>
    </swiper>
    <div class="arrow-right" @click="nextVSwiperSlide" />
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import type SwiperClass from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

interface Props {
  bannerList: string[];
}
const slidesPerView = 5;
const modules = ref([Navigation]);
const props = withDefaults(defineProps<Props>(), {
  bannerList: () => [],
});
const emit = defineEmits(["change"]);
// swiperRef
let vSwiperRef: SwiperClass | null = null;
const setVSwiperRef = (swiper: SwiperClass) => {
  vSwiperRef = swiper;
};
const prevVSwiperSlide = () => {
  if (slidesPerView >= props.bannerList.length) return;
  vSwiperRef?.slidePrev();
};
const nextVSwiperSlide = () => {
  if (slidesPerView >= props.bannerList.length) return;
  vSwiperRef?.slideNext();
};

const handleChange = (url: string) => emit("change", url);
</script>
<style scoped lang="scss">
.banner {
  width: 100%;
  height: 64px;
  margin-top: 14px;
  padding: 0 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}
.arrow-left,
.arrow-right {
  width: 16px;
  height: 33px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  cursor: pointer;
  flex-shrink: 0;
}
.arrow-left {
  margin-right: 14px;
  background-image: url("@/assets/images/arrow-left.png");
}
.arrow-right {
  margin-left: 14px;
  background-image: url("@/assets/images/arrow-right.png");
}
// .base-swiper {
//   width: 100%;
// }
.image-item {
  height: 64px;
  width: 64px;
  overflow: hidden;
  background: no-repeat center;
  background-size: cover;
  cursor: pointer;
}
</style>
