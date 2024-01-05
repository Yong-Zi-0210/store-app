<template>
  <div
    class="app-footer"
    :style="{ backgroundColor: `${settingStore.footerBackgroundColor}` }"
  >
    <div class="min min-width">
      <ul class="category">
        <li
          class="category-item"
          v-for="(item, index) in category"
          :key="index"
        >
          <div class="title">
            <i class="icon"></i>
            <span>{{ item.title }}</span>
          </div>
          <div
            class="sub-item"
            v-for="(subItem, subIndex) in item.children"
            :key="subIndex"
          >
            <a :href="subItem.url">{{ subItem.title }}</a>
          </div>
        </li>
      </ul>
      <div class="copyright">
        <div
          class="copyright-item"
          v-for="(item, index) in copyright"
          :key="index"
        >
          <a :href="item.url">{{ item.title }}</a>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import useSettingStore from "@/store/module/setting";

const settingStore = useSettingStore();
const copyright = ref([
  { title: "联系我们", url: "" },
  { title: "帮助信息", url: "" },
  { title: "京ICP备00000000号", url: "" },
  { title: "证照信息", url: "" },
]);
const category = ref([
  {
    title: "新手上路",
    children: [
      { title: "客服密码", url: "" },
      { title: "兑换流程", url: "" },
    ],
  },
  {
    title: "配送方式",
    children: [{ title: "送货上门", url: "" }],
  },
  {
    title: "售后服务",
    children: [
      { title: "退换货政策", url: "" },
      { title: "礼品三包", url: "" },
      { title: "查看订单", url: "" },
    ],
  },
  {
    title: "积分计划",
    children: [
      { title: "积分计划", url: "" },
      { title: "常见问题", url: "" },
    ],
  },
  {
    title: "招商公告",
    children: [{ title: "招商公告", url: "" }],
  },
]);
</script>
<style lang="scss" scoped>
.app-footer {
  display: flex;
  justify-content: center;
  .min {
    border-top: 0.5px solid #cdcdcd;
    padding: 53px 0 28px 0;
    .category {
      display: flex;
      justify-content: space-around;
      list-style: none;
      margin: 0;
      padding: 0;
      .category-item {
        .title {
          display: flex;
          align-items: center;
          margin-bottom: 5px;
          .icon {
            width: 32px;
            height: 32px;
            margin-right: 11px;
            background: url("@/assets/images/category.png") no-repeat center;
            background-size: cover;
          }
          span {
            display: inline-block;
            color: #3f3f3f;
            font-size: 14px;
          }
        }
        .sub-item {
          margin-bottom: 10px;
          padding-left: 43px;
          color: #999999;
          font-size: 12px;
        }
      }
    }
    .copyright {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 59px;
      .copyright-item {
        padding-right: 12px;
        border-right: 2px solid #999999;
        box-sizing: border-box;
        font-size: 12px;
        color: #999999;
        margin-right: 12px;
        &:last-of-type {
          border: none;
          margin: 0;
          padding: 0;
        }
      }
    }
  }
}
</style>
