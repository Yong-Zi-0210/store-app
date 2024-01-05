<template>
  <div class="app-header">
    <div class="main min-width">
      <div class="location">
        <i class="icon"></i>
        <span>{{ location.address }}</span>
      </div>
      <ul class="actions" v-if="userInfo.id">
        <li class="action-item user">{{ "亲爱的" + userInfo.username }}</li>
        <!-- <li class="action-item service">我的收藏</li> -->
        <!-- <li class="action-item">
          <el-dropdown
            ref="serviceRef"
            trigger="contextmenu"
            style="margin-right: 30px"
          >
            <div class="el-dropdown-link" @click="showDown(serviceRef)">
              客户服务
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>客户服务 1</el-dropdown-item>
                <el-dropdown-item>客户服务 2</el-dropdown-item>
                <el-dropdown-item>客户服务 3</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <i class="down-icon"></i>
        </li> -->
        <!-- <li class="action-item more">
          <el-dropdown
            ref="moreRef"
            trigger="contextmenu"
            style="margin-right: 30px"
          >
            <div class="el-dropdown-link" @click="showDown(moreRef)">
              更多电子服务
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>更多电子服务 1</el-dropdown-item>
                <el-dropdown-item>更多电子服务 2</el-dropdown-item>
                <el-dropdown-item>更多电子服务 3</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <i class="down-icon"></i>
        </li> -->
        <!-- <li class="action-item">企业门户</li> -->
        <!-- <li class="action-item">网站地图</li> -->
      </ul>
      <ul class="login-action">
        <li class="action-item logout" v-if="userInfo.id" @click="logout">
          退出登录
        </li>
        <li class="action-item login" v-else>
          <span>您好,</span>
          <span class="login-btn" @click="login">请登录</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import useUserStore from "@/store/module/user";
import { storeToRefs } from "pinia";

// const serviceRef = ref();
// const moreRef = ref();
const router = useRouter();
const userStore = useUserStore();
const location = ref({
  address: "上海",
});

const { userInfo } = storeToRefs(userStore);

/** 下拉菜单 */
// const showDown = (ref: any) => {
//   if (!ref) return;
//   ref.handleOpen();
// };

/** 登录 */
const login = () => router.push("/login");
/** 登出 */
const logout = () => {
  userStore.logout();
};
</script>
<style lang="scss" scoped>
.app-header {
  display: flex;
  margin-bottom: 10px;
  justify-content: center;
  background: #ffffff;
  color: #333333;
  .main {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 48px;
    overflow: hidden;
    padding: 14px 0;
    font-size: 14px;
    box-sizing: border-box;
    .location {
      display: flex;
      align-items: center;
      width: 120px;
      .icon {
        width: 20px;
        height: 20px;
        margin-right: 6px;
        background: url("@/assets/images/location.png") no-repeat center;
        background-size: cover;
      }
    }
    .actions {
      flex: 1;
    }
    .login-action {
      margin-left: 22px;
    }
    .actions,
    .login-action {
      display: flex;
      justify-content: flex-end;
      list-style: none;
      .action-item {
        display: flex;
        align-items: center;
        margin-right: 22px;
        cursor: pointer;
        .login-btn {
          margin-left: 5px;
          color: #e20755;
        }
        &.logout {
          color: #e20755;
        }
        .down-icon {
          height: 5px;
          width: 11px;
          margin-left: 4px;
          background: url("@/assets/images/down.png") no-repeat center;
          background-size: cover;
        }
        &:last-of-type {
          margin-right: 0;
        }
      }
      :deep(.el-dropdown) {
        margin-right: 0 !important;
        font-size: 14px;
        color: #333333;
      }
    }
  }
}
</style>
