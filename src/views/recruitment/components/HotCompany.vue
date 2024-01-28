<template>
  <ul class="hots" v-if="props.data.length">
    <li
      class="hot-item"
      v-for="(item, index) in props.data"
      :key="index"
      @click="jumpDetail(item)"
    >
      <div class="item-header">
        <div class="company-name">{{ item.companyName }}</div>
        <div class="company-info">
          <span class="financing item">{{ item.financing }}</span>
          <span class="employee-num item">{{ item.employeeNum }}</span>
          <span class="companyType">{{ item.companyType }}</span>
        </div>
      </div>
      <ul class="jobs">
        <li
          class="job-item"
          v-for="(position, index) in item.positions"
          :key="index"
        >
          <div class="job-header">
            <span class="name">{{ position.name }}</span>
            <span class="salary">{{ position.salary }}</span>
          </div>
          <div class="main-info">
            <span class="info-item">{{ position.city }}</span>
            <span class="info-item">{{ position.workingAge }}</span>
            <span class="info-item">{{ position.education }}</span>
            <span class="info-item">{{ position.keywords }}</span>
          </div>
        </li>
      </ul>
      <div class="more">
        <div class="btn">查看更多职位</div>
      </div>
    </li>
  </ul>
</template>
<script setup lang="ts">
import { useRouter } from "vue-router";
import useRouterStore from "@/store/module/router";

const router = useRouter();
const paramsStore = useRouterStore();
interface Props {
  data: any[];
}
const props = withDefaults(defineProps<Props>(), {
  data: () => [],
});

/** 跳转详情页 */
const jumpDetail = (item: any) => {
  paramsStore.setCompanyDetail({
    companyId: item.companyId,
    positionId: item.positionId,
  });
  const routeUrl = router.resolve({
    path: "company",
  });
  window.open(routeUrl.href, "_blank");
};
</script>
<style lang="scss" scoped>
.hots {
  display: flex;
  flex-wrap: wrap;
  margin-right: -15px;
  margin-bottom: 40px;
  .hot-item {
    width: 390px;
    overflow: hidden;
    margin: 0 15px 15px 0;
    border-radius: 8px;
    background: #ffffff;
    box-sizing: border-box;
    .item-header {
      width: 391px;
      height: 71px;
      background: linear-gradient(
        90deg,
        rgba(251, 41, 116, 0.02) 13%,
        rgba(19, 79, 235, 0.01) 100%
      );
      padding: 14px 0 15px 21px;
      box-sizing: border-box;
      .company-name {
        font-size: 16px;
        color: #333333;
        font-weight: 600;
        line-height: 22px;
        margin-bottom: 3px;
      }
      .company-info {
        display: flex;
        align-items: center;
        font-size: 12px;
        line-height: 17px;
        color: #999;
        .item {
          display: flex;
          align-items: center;
          &::after {
            content: "";
            width: 2px;
            height: 10px;
            margin: 0 8px;
            background-color: #dcdcdc;
          }
        }
      }
    }
    .jobs {
      .job-item {
        margin-bottom: 26px;
      }
      .job-header {
        display: flex;
        justify-content: space-between;
        padding: 0 16px 13px 20px;
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
    }
    .more {
      display: flex;
      justify-content: center;
      margin-bottom: 25px;
      .btn {
        width: 124px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        font-size: 14px;
        color: #e20755;
        background: #ffffff;
        border-radius: 8px;
        border: 1px solid #e20755;
        cursor: pointer;
      }
    }
  }
}
</style>
