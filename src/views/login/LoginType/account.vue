<template>
  <el-form
    class="account-form"
    :model="loginForm"
    :rules="rules"
    ref="loginRef"
  >
    <el-form-item prop="account">
      <el-input v-model="loginForm.account" placeholder="请输入账号" />
    </el-form-item>
    <el-form-item prop="password">
      <el-input v-model="loginForm.password" placeholder="请输入密码" />
    </el-form-item>
  </el-form>
  <el-button
    class="login-btn"
    type="primary"
    @click="handleLogin"
    :loading="loading"
    >{{ loading ? "正在登录..." : "登录" }}</el-button
  >
</template>
<script setup lang="ts">
import { FormInstance, FormRules } from "element-plus";
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { AccountLogin } from "../types";
import useUserStore from "@/store/module/user";
import useRouterStore from "@/store/module/router";
import { storeToRefs } from "pinia";

// 跳转到上次页面路由
const routerStore = useRouterStore();
const { lastRouter } = storeToRefs(routerStore);
const loading = ref(false);
const router = useRouter();
const loginRef = ref<FormInstance>();
const rules = reactive<FormRules>({
  account: [{ required: true, message: "请输入账号", trigger: "change" }],
  password: [{ required: true, message: "请输入密码", trigger: "change" }],
});
const loginForm = reactive<AccountLogin>({
  account: "test001",
  password: "Pass@Word",
});
const emit = defineEmits(["hanldeValidate"]);

/** 登录 */
const userStore = useUserStore();
const handleLogin = () => {
  loginRef.value?.validate(async (val) => {
    if (val) {
      loading.value = true;
      try {
        await userStore.login(loginForm);
        loading.value = false;
        if (lastRouter.value) {
          router.push(lastRouter.value.path);
        } else {
          router.push("/");
        }
      } catch (error) {
        loading.value = false;
      }
    }
  });
};
</script>
<style lang="scss" scoped>
.account-form {
  :deep(.el-form-item) {
    margin-bottom: 22px;
    .el-input {
      width: 305px;
      height: 48px;
      background: #ffffff;
      border: none;
      border-radius: 6px 6px 6px 6px;
      .el-input__wrapper {
        box-shadow: none;
      }
    }
  }
}
.login-btn {
  width: 305px;
  height: 48px;
  color: #ffffff;
  background: #e20755;
  border: none;
  border-radius: 6px 6px 6px 6px;
  opacity: 1;
}
</style>
