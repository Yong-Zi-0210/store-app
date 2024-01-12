<template>
  <div class="company">
    <div class="header">
      <div class="min-width">
        <div class="company-stat">
          <span class="total">{{ total }}</span>
          <span>在招职位</span>
        </div>
        <div class="info-primary">
          <el-image :src="companyData.displayImage" fit="cover"></el-image>
          <div class="info">
            <div class="company-name">{{ companyData.name }}</div>
            <p>
              {{ companyData.financing }}
              <em class="dolt"></em>
              {{ companyData.employeeNum }}
              <em class="dolt"></em>
              {{ companyData.type }}
            </p>
          </div>
        </div>

        <div class="company-tag">
          <el-tag type="info" v-for="(item, index) in tags" :key="index">{{
            item
          }}</el-tag>
        </div>
      </div>
    </div>
    <div class="main min-width">
      <el-tabs v-model="activeTab" @tab-change="changeTabs">
        <el-tab-pane label="公司简介" :name="0">
          <CompanyDetail
            :company-data="companyData"
            :hot-job="hotJob"
            :total="total"
            @change="
              () => {
                changeTabs(1);
              }
            "
          />
        </el-tab-pane>
        <el-tab-pane label="招聘职位" :name="1">
          <JobList />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { companyDetail, getJobById } from "@/api/job";
import useRouterStore from "@/store/module/router";

const paramsStore = useRouterStore();
const total = ref(0);
const activeTab = ref(0);
const companyData = ref<any>({});
const tags = computed(() => {
  if (companyData.value?.tag?.includes("|")) {
    return companyData.value.tag.split("|");
  } else {
    return [companyData.value.tag];
  }
});
const jobs = ref<any>([]); // 显示第一页6条
const hotJob = ref<any>([]); // 默认取列表里的前三条
const pageParams = reactive({
  pageSize: 6,
  currentPage: 1,
});

/** 获取企业详情 */
const getCompanyDetail = async () => {
  try {
    const res = await companyDetail({
      id: paramsStore.companyDetail.companyId,
    });
    companyData.value = res.body;
  } catch (error) {}
};
getCompanyDetail();

/** 获取公司职位 */
const getJobs = async () => {
  try {
    const res = await getJobById({
      ...pageParams,
      condition: {
        companyId: paramsStore.companyDetail.companyId,
      },
    });
    total.value = res.body.totalCount;
    jobs.value = res.body.pageItems;
    hotJob.value = res.body.pageItems?.slice(0, 3);
  } catch (error) {}
};
getJobs();

const changeTabs = (index: number) => {
  activeTab.value = index;
};
</script>
<style lang="scss" scoped>
.company {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.header {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 35px 0 20px 0;
  background-color: #fff;
  :deep(.el-image) {
    width: 70px;
    height: 70px;
    border-radius: 12px;
    border: 1px solid #f3f5fb;
  }
  .company-tag {
    margin-top: 10px;
  }
  .company-stat {
    float: right;
    .total {
      margin-right: 5px;
      font-size: 46px;
    }
  }
  .info-primary {
    display: flex;
    align-items: center;
    max-width: 800px;
    .info {
      margin-left: 24px;
      display: inline-block;
      vertical-align: middle;
      font-size: 14px;
      .company-name {
        font-size: 28px;
        font-weight: 600;
        color: #333;
        line-height: 40px;
        padding-bottom: 3px;
      }
      p {
        padding: 0 0 0 2px;
        margin-top: 3px;
        margin-bottom: 0;
        font-size: 13px;
        font-weight: 400;
        line-height: 18px;
        .dolt {
          display: inline-block;
          vertical-align: middle;
          width: 2px;
          height: 2px;
          margin: 0 7px;
          border-radius: 50%;
          background-color: #333;
        }
      }
    }
  }
}
.main {
  display: flex;
  flex-direction: column;
  margin-top: 16px;
  :deep(.el-tabs) {
    .el-tabs__header {
      padding-bottom: 12px;
      border-radius: 12px;
      background-color: #fff;
    }
    .el-tabs__nav-wrap {
      &::after {
        background-color: transparent;
      }
    }
    .el-tabs__item {
      padding: 0 34px;
      font-size: 16px;
    }
  }
}
</style>
