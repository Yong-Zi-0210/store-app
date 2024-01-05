<template>
  <el-form class="verify-form" :model="loginForm" :rules="rules" ref="loginRef">
    <el-form-item prop="phone">
      <el-input v-model="loginForm.phone" placeholder="请输入手机号" />
    </el-form-item>
    <el-form-item prop="verifyCode">
      <el-input
        class="verify-input"
        v-model="loginForm.verifyCode"
        placeholder="请输入验证码"
      />
      <el-button class="send-sms" :disabled="countDown" @click="sendMessage">
        {{ countDown ? `${time}s重新发送` : "获取验证码" }}
      </el-button>
    </el-form-item>
  </el-form>
  <div class="not-sms"><span>收不到验证码？</span></div>
  <el-button
    class="login-btn"
    type="primary"
    :loading="loading"
    @click="handleLogin"
  >
    {{ loading ? "正在登录..." : "登录" }}
  </el-button>
</template>
<script setup lang="ts">
import { FormInstance, FormRules } from "element-plus";
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { getLoginCodeApi } from "@/api/user";
import { VerifyCodeLogin } from "../types";
import useUserStore from "@/store/module/user";
import useRouterStore from "@/store/module/router";
import { storeToRefs } from "pinia";

// 跳转到上次页面路由
const routerStore = useRouterStore();
const { lastRouter } = storeToRefs(routerStore);
const router = useRouter();
const loading = ref(false);
const loginRef = ref<FormInstance>();
const countDown = ref(false);
const time = ref(60);
const rules = reactive<FormRules>({
  phone: [
    { required: true, message: "请输入手机号", trigger: "change" },
    {
      pattern: /^1[3456789]\d{9}$/,
      message: "请输入正确的手机号",
      trigger: "blur",
    },
  ],
  verifyCode: [{ required: true, message: "请输入验证码", trigger: "change" }],
});
const loginForm = reactive<VerifyCodeLogin>({
  phone: "",
  verifyCode: "",
});
const emit = defineEmits(["hanldeValidate"]);

/** 倒计时 */
const setTime = () => {
  const timer = setInterval(() => {
    if (time.value === 0) {
      clearInterval(timer);
      time.value = 60;
      countDown.value = false;
    }
    time.value--;
  }, 1000);
};
/** 发送短信 */
const sendMessage = () => {
  loginRef.value?.validateField("phone", async (val) => {
    if (val) {
      countDown.value = true;
      setTime();
      try {
        await getLoginCodeApi({
          purpose: "login",
          phone: loginForm.phone,
        });
        setTime();
      } catch (error) {}
    }
  });
};

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
.verify-form {
  .verify-input {
    width: 184px !important;
    margin-right: 12px;
  }
  .send-sms {
    width: 109px;
    height: 48px;
    color: #ffffff;
    background: #3f3f3f;
    border: none;
    border-radius: 6px 6px 6px 6px;
  }
  :deep(.el-form-item) {
    margin-bottom: 22px;
    &:last-of-type {
      margin-bottom: 5px;
    }
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
.not-sms {
  display: flex;
  justify-content: flex-end;
  color: #757575;
  font-size: 14px;
  margin-bottom: 22px;
  span {
    cursor: pointer;
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
