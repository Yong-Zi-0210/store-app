<template>
  <div class="jobs">
    <div class="header">
      <div class="min-width">
        <div class="job-primary">
          <div class="name-salary">
            <div class="name">{{ jobData.name }}</div>
            <div class="salary">{{ jobData.salary }}</div>
          </div>
          <Welfare :tags="companyData.welfareTreatment" />
        </div>
        <div class="job-other">
          <div class="city item">
            <el-icon><Location /></el-icon>
            <span>{{ jobData.city }}</span>
          </div>
          <div class="working-age item">
            <el-icon><Suitcase /></el-icon>
            <span>{{ jobData.workingAge }}</span>
          </div>
          <div class="education item">
            <el-icon><User /></el-icon>
            <span>{{ jobData.education }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="main min-width">
      <div class="details">
        <div class="job-detail detail-item">
          <div class="detail-title">职位描述</div>
          <ul class="job-keyword-list">
            <li
              class="keyword-item"
              v-for="(item, index) in keywords"
              :key="index"
            >
              {{ item }}
            </li>
          </ul>
          <div class="detail-info" v-html="jobData.workDetails"></div>
        </div>
        <div class="address-detail detail-item">
          <div class="detail-title">工作地址</div>
          <div class="address">{{ companyData.address }}</div>
        </div>
        <div class="profile-detail detail-item">
          <div class="detail-title">公司简介</div>
          <div class="address">{{ companyData.profile }}</div>
        </div>
      </div>
      <div class="company-info">
        <div class="title">公司基本信息</div>
        <div class="company-name">
          <el-image class="image" :src="companyData.displayImage" fit="cover" />
          <span>{{ companyData.name }}</span>
        </div>
        <p>
          <SvgIcon name="group" />
          <span>{{ companyData.financing }}</span>
        </p>
        <p>
          <SvgIcon name="up" />
          <span>{{ companyData.employeeNum }}</span>
        </p>
        <p>
          <SvgIcon name="company" />
          <span>{{ companyData.type }}</span>
        </p>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
import { Location, Suitcase, User } from "@element-plus/icons-vue";
import useRouterStore from "@/store/module/router";
import { jobDetail, companyDetail } from "@/api";

const paramsStore = useRouterStore();
const jobData = ref<any>({});
const companyData = ref<any>({});
const keywords = computed(() => {
  if (jobData.value?.keywords?.indexOf("|") > -1) {
    return jobData.value.keywords.split("|");
  } else {
    return [jobData.value.keywords];
  }
});

/** 职位信息 */
const getJobDetail = async () => {
  try {
    const res = await jobDetail({
      id: paramsStore.jobDetail.positionId | paramsStore.jobDetail.id,
    });
    jobData.value = res.body;
  } catch (error) {}
};
getJobDetail();

/** 企业信息 */
const getCompanyDetail = async () => {
  try {
    const res = await companyDetail({
      id: paramsStore.jobDetail.companyId,
    });
    companyData.value = res.body;
  } catch (error) {}
};
getCompanyDetail();
</script>
<style lang="scss" scoped>
.jobs {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  .header {
    width: 100%;
    display: flex;
    justify-content: center;
    background-color: #fff;
    padding: 35px 0 20px 0;
    .job-primary {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .name-salary {
        display: flex;
      }
      .name {
        margin-right: 30px;
        font-size: 28px;
      }
      .salary {
        font-size: 34px;
        color: #e20755;
      }
    }
    .job-other {
      display: flex;
      align-items: center;
      margin-top: 16px;
      .item {
        display: flex;
        align-items: center;
        margin-right: 20px;
        :deep(.el-icon) {
          margin-right: 5px;
        }
      }
    }
  }
  .main {
    display: flex;
    margin-top: 16px;
    .details {
      flex: 1;
      .detail-item {
        margin: 0 16px 16px 0;
        padding: 20px 30px;
        background: #fff;
        border-radius: 12px;
      }
      .detail-title {
        margin-bottom: 12px;
        font-size: 18px;
        font-weight: 600;
        color: #222;
      }
      .job-keyword-list {
        overflow: hidden;
      }
      .keyword-item {
        margin-top: 8px;
        margin-right: 8px;
        font-size: 14px;
        color: #666;
        line-height: 20px;
        float: left;
        padding: 4px 12px;
        white-space: nowrap;
        background: #f8f8f8;
        border-radius: 4px;
      }
    }

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
      .company-name {
        display: flex;
        align-items: center;
        padding: 16px 24px;
        margin-bottom: 4px;
        font-size: 16px;
        font-weight: 500;
        color: #222;
        line-height: 22px;
        .image {
          width: 48px;
          height: 48px;
          margin-right: 16px;
          border: 1px solid #f3f5fb;
          border-radius: 8px;
        }
      }
      p {
        padding: 0 24px;
        display: flex;
        align-items: center;
        font-size: 15px;
        color: #333;
        line-height: 21px;
        margin-bottom: 8px;
        .svg-icon {
          margin-right: 8px;
        }
      }
    }
  }
}
</style>
