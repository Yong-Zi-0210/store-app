<template>
  <div class="details">
    <div class="profile-detail detail-item">
      <div class="detail-title">公司简介</div>
      <div class="profile">{{ props.companyData.companyDetails }}</div>
      <div class="detail-title">公司相册</div>
      <div class="company-image">
        <el-image
          v-for="(item, index) in props.companyData.images"
          :key="index"
          :src="item"
          :preview-src-list="props.companyData.images"
          :initial-index="4"
          fit="cover"
        ></el-image>
      </div>
    </div>
    <div class="company-industryInformation detail-item">
      <div class="detail-title">行业信息</div>
      <div v-html="props.companyData.industryInformation"></div>
    </div>
    <div class="company-address detail-item">
      <div class="detail-title">公司地址</div>
      <div class="address">{{ props.companyData.address }}</div>
    </div>
  </div>
  <div class="slider">
    <div class="company-info">
      <div class="title">工作时间及福利</div>
      <p class="info-item work-time">
        <el-icon style="margin-right: 5px; color: #999"><Clock /></el-icon>
        <span style="font-size: 14px; color: #999">{{
          props.companyData.workTime
        }}</span>
      </p>
      <p class="info-item">
        <Welfare :tags="props.companyData.welfareTreatment" />
      </p>
    </div>
    <div class="company-info">
      <div class="title">热招职位</div>
      <div class="info-item">
        <ul class="jobs-list">
          <li
            class="job-item"
            v-for="(item, index) in hotJob"
            :key="index"
            @click="jumpDetail(item)"
          >
            <div class="job-name">{{ item.name }}</div>
            <div class="salary-info">
              <div class="salary">{{ item.salary }}</div>
              <span class="workingAge">{{ item.workingAge }}</span>
              <span class="education">{{ item.education }}</span>
            </div>
          </li>
        </ul>
        <div class="more-jobs" @click="changTabs">查看全部职位{{ total }}</div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Clock } from "@element-plus/icons-vue";
import useRouterStore from "@/store/module/router";
import { useRouter } from "vue-router";

const router = useRouter();
const paramsStore = useRouterStore();
interface Props {
  companyData: any;
  hotJob: any[];
  total: number;
}
const props = withDefaults(defineProps<Props>(), {
  companyData: {},
  hotJob: () => [],
  total: 0,
});

const emit = defineEmits(["change"]);

const changTabs = () => {
  emit("change");
};

/** 跳转职位详情 */
const jumpDetail = (item: any) => {
  paramsStore.setJobDetail(item);
  const routeUrl = router.resolve({
    path: "job",
  });
  window.open(routeUrl.href, "_blank");
};
</script>
<style lang="scss" scoped>
.details {
  width: 900px;
  padding-right: 0;
  float: left;
  .detail-item {
    margin-bottom: 16px;
    padding: 20px 30px;
    background: #fff;
    border-radius: 12px;
    .profile {
      margin-bottom: 36px;
    }
    :deep(.el-image) {
      width: 200px;
      height: 120px;
      border-radius: 12px;
      overflow: hidden;
      margin: 0 4px;
      cursor: pointer;
      flex-shrink: 0;
    }
  }
  .detail-title {
    margin-bottom: 12px;
    font-size: 18px;
    font-weight: 600;
    color: #222;
  }
}
.jobs-list {
  .job-item {
    margin-top: 12px;
    padding: 16px;
    border-radius: 12px;
    cursor: pointer;
    .job-name {
      line-height: 22px;
      height: 22px;
      margin-bottom: 8px;
      font-size: 16px;
      font-weight: 600;
    }
    .salary-info {
      display: flex;
      .salary {
        margin-right: 10px;
        font-size: 16px;
        font-weight: 600;
        color: #e20755;
      }
      span {
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
    &:hover {
      background: #f7f7f7;
    }
  }
}
.slider {
  width: 284px;
  float: right;
  margin-left: 16px;
  .company-info {
    width: 284px;
    border-radius: 12px;
    padding-bottom: 20px;
    background: #fff;
    margin-bottom: 16px;
    .title {
      font-size: 16px;
      font-weight: 500;
      color: #222;
      line-height: 22px;
      padding: 12px 24px;
      background: linear-gradient(90deg, #f5fcfc 0, #fcfbfa 100%);
      margin-bottom: 0;
      border-radius: 12px 12px 0 0;
    }
    .work-time {
      display: flex;
      align-items: center;
      padding: 16px 24px;
      margin-bottom: 4px;
      font-size: 16px;
      font-weight: 500;
      color: #222;
      line-height: 22px;
    }
    .info-item {
      padding: 0 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 15px;
      color: #333;
      line-height: 21px;
      margin-bottom: 8px;
      .svg-icon {
        margin-right: 8px;
      }
      &.work-time {
        flex-direction: row;
      }
      &:last-of-type {
        margin-bottom: 0;
      }
    }
    .more-jobs {
      margin-top: 20px;
      font-size: 15px;
      color: #e20755;
      line-height: 21px;
      font-weight: 500;
      margin-right: 0;
      margin-top: 4px;
      padding-right: 6px;
      background: 0 0;
      cursor: pointer;
      transition: all 0.2s linear;
    }
  }
}
</style>
