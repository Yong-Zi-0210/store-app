<template>
  <div class="search-bar">
    <div class="main min-width">
      <div class="logo">
        <span class="icon" @click="toHome">LOGO</span>
        <span class="text">途途社区</span>
      </div>
      <div class="search-action">
        <div class="search-box">
          <div class="search-input">
            <i class="search-icon"></i>
            <input
              type="text"
              v-model="searchValue"
              :placeholder="props.placeholder"
            />
          </div>
          <div class="search-btn" @click="search">搜索</div>
        </div>
        <!-- <ul class="hot-list">
          <li class="hot-item" v-for="item in hotList" :key="item">
            {{ item }}
          </li>
        </ul> -->
      </div>
      <!-- <div class="code"></div> -->
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from "vue";
import { useRouter } from "vue-router";

interface Props {
  defaultValue?: string;
  placeholder?: string;
}
const router = useRouter();
const searchValue = ref("");
const props = withDefaults(defineProps<Props>(), {
  defaultValue: "",
  placeholder: "请输入您想要的商品名称",
});

watch(
  () => props.defaultValue,
  () => {
    searchValue.value = props.defaultValue;
  },
  {
    immediate: true,
  }
);
const emit = defineEmits(["handleSearch"]);
const search = async () => {
  emit("handleSearch", searchValue.value);
};
const toHome = () => {
  router.push("/home");
};
</script>
<style scoped lang="scss">
.search-bar {
  width: 100%;
  display: flex;
  justify-content: center;
  background-color: #ffffff;
  .main {
    display: flex;
    align-items: center;
    padding: 24px 0;
    .logo {
      height: 42px;
      margin-right: 97px;
      display: flex;
      align-items: center;
      font-size: 30px;
      .icon {
        display: flex;
        align-items: center;
        color: #e20755;
        cursor: pointer;
        &::after {
          content: "";
          width: 2px;
          height: 36.5px;
          margin: 0 16px 0 13px;
          background: #e2e2e2;
          display: inline-block;
        }
      }
      .text {
        display: inline-block;
        color: #333333;
      }
    }
    .search-box {
      display: flex;
      align-items: center;
      font-size: 16px;
      margin-right: 110px;
      .search-input {
        display: flex;
        align-items: center;
        width: 534px;
        height: 48px;
        padding: 13px 14px;
        border-radius: 24px 0px 0px 24px;
        border: 2px solid #e20755;
        box-sizing: border-box;
        .search-icon {
          width: 24px;
          height: 24px;
          margin-right: 4px;
          background: url("@/assets/images/search.png") no-repeat center;
          background-size: cover;
        }
        input {
          width: 100%;
          outline: none;
          border: none;
          font-size: 16px;
        }
      }
      .search-btn {
        width: 87px;
        height: 48px;
        text-align: center;
        line-height: 48px;
        background: #e20755;
        border-radius: 0px 24px 24px 0px;
        font-size: 16px;
        color: #ffffff;
        cursor: pointer;
      }
    }
    .hot-list {
      display: flex;
      align-items: center;
      margin: 0;
      padding: 0 0 12px 14px;
      list-style: none;
      color: #999999;
      .hot-item {
        margin-right: 24px;
        &:last-of-type {
          margin-right: 0;
        }
      }
    }
    .code {
      width: 77px;
      height: 77px;
      background: #5e5c5c;
    }
  }
}
</style>
