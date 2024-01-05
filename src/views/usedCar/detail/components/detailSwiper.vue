<template>
  <div class="arrow-left" @click="prevVSwiperSlide" />
  <swiper
    :modules="modules"
    :slides-per-view="4"
    :hideOnClick="false"
    :loop="true"
    @swiper="setVSwiperRef"
    class="base-swiper"
  >
    <swiper-slide v-for="(url, index) in props.bannerList" :key="index">
      <div
        class="image-item"
        @click="handleChange(url)"
        :style="{ backgroundImage: `url(${url})` }"
      />
    </swiper-slide>
  </swiper>
  <div class="arrow-right" @click="nextVSwiperSlide" />
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
const prevVSwiperSlide = () => vSwiperRef?.slidePrev();
const nextVSwiperSlide = () => vSwiperRef?.slideNext();

const handleChange = (url) => emit("change", url);
</script>
<style scoped lang="scss">
.arrow-left,
.arrow-right {
  width: 20px;
  height: 41px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  cursor: pointer;
}
.arrow-left {
  background-image: url("@/assets/images/arrow-left.png");
}
.arrow-right {
  background-image: url("@/assets/images/arrow-right.png");
}
.base-swiper {
  width: 464px;
}
.image-item {
  height: 70px;
  width: 110px;
  overflow: hidden;
  background: no-repeat center;
  background-size: cover;
  cursor: pointer;
}
</style>
