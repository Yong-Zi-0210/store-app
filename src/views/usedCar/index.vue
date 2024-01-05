<template>
  <div class="used-car">
    <router-view></router-view>
  </div>
</template>
<script setup lang="ts">
import useSettingStore from "@/store/module/setting";

const settingStore = useSettingStore();
settingStore.setFooterBgColor("#FFFFFF");
</script>
<style lang="scss" scoped>
.used-car {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
