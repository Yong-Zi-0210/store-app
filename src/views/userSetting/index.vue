<template>
  <div class="user-setting">
    <div class="main min-width">
      <div class="sider-bar">
        <el-menu :default-active="defaultActive" class="el-menu-vertical-demo">
          <router-link to="/userSetting/baseInfo">
            <el-menu-item index="/userSetting/baseInfo">
              基本信息
            </el-menu-item>
          </router-link>
          <router-link to="/userSetting/addrssManage">
            <el-menu-item index="/userSetting/addrssManage"
              >地址管理</el-menu-item
            >
          </router-link>
          <router-link to="/userSetting/order">
            <el-menu-item index="/userSetting/order">我的订单</el-menu-item>
          </router-link>
        </el-menu>
      </div>
      <div class="container">
        <router-view v-slot="{ Component, route }">
          <component :is="Component" :key="route.path" />
        </router-view>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import useSettingStore from "@/store/module/setting";
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const settingStore = useSettingStore();
settingStore.setFooterBgColor("#FFFFFF");
const defaultActive = computed(() => {
  return route.path;
});
</script>
<style lang="scss" scoped>
.user-setting {
  display: flex;
  justify-content: center;
  height: 100%;
  width: 100%;
  background-color: #fff;
  .main {
    display: flex;
    padding: 13px 0;
    flex-shrink: 0;
    .sider-bar {
      width: 110px;
    }
    .container {
      margin-left: 20px;
      flex: 1;
    }
  }
}
</style>
