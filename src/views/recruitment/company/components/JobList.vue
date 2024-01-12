<template>
  <div class="company-jobs-list">
    <HotJob v-loading="loading" :data="jobs" />
    <div class="pagination" v-if="jobs.length">
      <el-pagination
        v-model:current-page="pageParams.currentPage"
        v-model:page-size="pageParams.pageSize"
        :page-sizes="[12, 24, 44, 120]"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref } from "vue";
import { getJobById } from "@/api/job";
import useRouterStore from "@/store/module/router";

const paramsStore = useRouterStore();
const jobs = ref<any>([]);
const total = ref(0);
const loading = ref(false);
const pageParams = reactive({
  pageSize: 12,
  currentPage: 1,
});
/** 获取公司职位 */
const getJobs = async () => {
  try {
    loading.value = true;
    const res = await getJobById({
      ...pageParams,
      condition: {
        companyId: paramsStore.companyDetail.companyId,
      },
    });
    loading.value = false;
    total.value = res.body.totalCount;
    jobs.value = res.body.pageItems;
  } catch (error) {
    loading.value = false;
  }
};
getJobs();

/** 修改每页数量 */
const handleSizeChange = (value: number) => {
  pageParams.pageSize = value;
  getJobs();
};

/** 改变当前页 */
const handleCurrentChange = (value: number) => {
  pageParams.currentPage = value;
  getJobs();
};
</script>
<style lang="scss" scoped>
.pagination {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}
</style>
