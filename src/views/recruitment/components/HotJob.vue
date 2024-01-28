<template>
  <ul class="hots" v-if="props.data.length">
    <li
      class="hot-item"
      v-for="(item, index) in props.data"
      :key="index"
      @click="jumpDetail(item)"
    >
      <div class="item-header">
        <span class="job-name">{{
          item.positionName ? item.positionName : item.name
        }}</span>
        <span class="salary">{{ item.salary }}</span>
      </div>
      <div class="main-info">
        <span class="info-item">{{ item.city }}</span>
        <span class="info-item">{{ item.workingAge }}</span>
        <span class="info-item">{{ item.education }}</span>
        <span class="info-item">{{ setKeyword(item.keywords) }}</span>
      </div>
      <div class="company-info">
        <div class="company-name">{{ item.companyName }}</div>
        <div class="financing-type">
          <span class="type" :class="item.financing ? 'line' : ''">{{
            item.companyType
          }}</span>
          <span v-if="item.financing" class="financing">{{
            item.financing
          }}</span>
        </div>
      </div>
    </li>
  </ul>
</template>
<script setup lang="ts">
import useRouterStore from "@/store/module/router";
import { useRouter } from "vue-router";

const paramsStore = useRouterStore();
const router = useRouter();

interface Props {
  data: any[];
}
const props = withDefaults(defineProps<Props>(), {
  data: () => [],
});

const setKeyword = (keywords: string) => {
  if (keywords.includes("|")) {
    return keywords.split("|")[0];
  } else {
    return keywords;
  }
};

const jumpDetail = (item: any) => {
  paramsStore.setJobDetail({
    companyId: item.companyId,
    positionId: item.positionId,
  });
  const routeUrl = router.resolve({
    path: "job",
  });
  window.open(routeUrl.href, "_blank");
};
</script>
<style lang="scss" scoped>
.hots {
  display: flex;
  flex-wrap: wrap;
  margin-right: -15px;
  .hot-item {
    width: 390px;
    overflow: hidden;
    margin: 0 15px 15px 0;
    background: #ffffff;
    border-radius: 8px;
    box-sizing: border-box;
    cursor: pointer;
    .item-header {
      display: flex;
      justify-content: space-between;
      padding: 15px 16px 13px 20px;
      line-height: 22px;
      font-size: 16px;
      font-weight: 600;
      .name {
        color: #333333;
      }
      .salary {
        color: #e20755;
      }
    }
    .main-info {
      display: flex;
      align-items: center;
      margin-bottom: 17px;
      padding: 0 16px 0 20px;
      .info-item {
        height: 21px;
        line-height: 21px;
        margin-right: 8px;
        padding: 0 11px;
        font-size: 12px;
        color: #666;
        text-align: center;
        background-color: #f7f7f7;
        border-radius: 4px;
      }
    }
    .company-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 49px;
      padding: 0 16px 0 20px;
      background: linear-gradient(
        90deg,
        rgba(251, 41, 116, 0.02) 13%,
        rgba(19, 79, 235, 0.01) 100%
      );
      font-size: 14px;
      color: #666;
      .financing-type {
        display: flex;
        align-items: center;
        .line {
          display: flex;
          align-items: center;
        }
      }
      .line::after {
        content: "";
        display: flex;
        align-items: center;
        width: 2px;
        height: 10px;
        margin: 0 8px;
        background-color: #dcdcdc;
      }
    }
  }
}
</style>
