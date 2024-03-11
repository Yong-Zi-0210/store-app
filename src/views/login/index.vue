<template>
  <div class="app-login">
    <div class="logo-container">
      <span class="logo"></span>
    </div>
    <div class="login-form">
      <div class="login-type">
        <span
          class="account"
          :class="loginType === 'account' ? 'active' : ''"
          @click="change('account')"
          >账号登录</span
        >
        <span
          class="verify"
          :class="loginType === 'verify' ? 'active' : ''"
          @click="change('verify')"
          >验证码登录</span
        >
      </div>
      <Account v-if="loginType === 'account'" />
      <Verify v-else />
      <div class="login-tips">
        <div class="singup">
          <span>还没有账号？</span>
          <span class="singup-btn" @click="singup">去注册</span>
        </div>
        <div class="forget-password">忘记密码</div>
      </div>
      <div class="other-login">
        <div class="title">
          <span class="line" />
          <span class="text">使用其他方式登录</span>
          <span class="line" />
        </div>
        <div class="options">
          <span class="qq"></span>
          <span class="wechat"></span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";

const loginType = ref("account");
/** 切换登录方式 */
const change = (type: string) => {
  loginType.value = type;
};

/** 注册 */
const singup = () => {};
</script>

<style lang="scss" scoped>
.app-login {
  display: flex;
  justify-content: space-between;
  flex: 1;
  width: 100%;
  height: 100%;
  padding: 0 153px 0 167px;
  box-sizing: border-box;
  background: url("@/assets/images/lg_bg.png") no-repeat center;
  background-size: cover;
  overflow-y: auto;
  overflow-x: hidden;
  .logo-container {
    margin-top: 236px;
    .logo {
      display: inline-block;
      width: 453px;
      height: 84px;
      background: url("@/assets/images/lg_logo.jpg") no-repeat center;
      background-size: contain;
    }
  }
  .login-form {
    width: 389px;
    height: 520px;
    margin-top: 242px;
    padding: 42px 42px 0 42px;
    box-sizing: border-box;
    background: rgba(255, 255, 255, 0.7);
    border-radius: 24px 24px 24px 24px;
    .login-type {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 18px;
      color: #999999;
      margin-bottom: 21px;
    }
    .account,
    .verify {
      cursor: pointer;
      &.active {
        color: #e20755;
      }
    }
    .account {
      display: flex;
      align-items: center;
      &::after {
        content: "";
        display: inline-block;
        width: 2px;
        height: 27px;
        margin: 0 16px;
        background: #e2e2e2;
      }
    }
    .login-tips {
      margin-top: 5px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #999999;
      font-size: 12px;
      .forget-password {
        cursor: pointer;
      }
      .singup-btn {
        color: #e20755;
        cursor: pointer;
      }
    }
    .other-login {
      text-align: center;
      margin-top: 21px;
      font-size: 12px;
      color: #666666;
      .title {
        display: flex;
        align-items: center;
        .line {
          display: inline-block;
          height: 2px;
          width: 88px;
          background: #ffffff;
        }
        .text {
          margin: 0 16px;
        }
      }
      .options {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 15px;
        span {
          display: inline-block;
          width: 36px;
          height: 36px;
          overflow: hidden;
          background-position: no-repeat center;
          background-size: cover;
          cursor: pointer;
        }
        .qq {
          margin-right: 51px;
          background-image: url("@/assets/images/icon_qq.png");
        }
        .wechat {
          background-image: url("@/assets/images/icon_wechat.png");
        }
      }
    }
  }
}
</style>
