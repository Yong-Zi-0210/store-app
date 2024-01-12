<template>
  <!-- 搜索 -->
  <SearchBar
    placeholder="请输入职位名称"
    :defaultValue="searchValue"
    @handleSearch="search"
  />
  <div class="main" v-loading="loading">
    <div class="search-container min-width">
      <div class="filters">
        <div class="total-title">
          全部结果：{{ searchValue ? `"${searchValue}"` : "" }}
        </div>
        <div class="tags">
          <el-button
            v-if="filters.length || !!searchValue"
            class="reset-btn"
            type="primary"
            size="small"
            plain
            @click="resetFilter"
            >重置</el-button
          >
        </div>
      </div>
      <div class="search-result">
        <HotJob :data="searchData" />
        <div class="pagination" v-if="searchData.length">
          <el-pagination
            v-model:current-page="searchPage.currentPage"
            v-model:page-size="searchPage.pageSize"
            :page-sizes="[12, 24, 44, 120]"
            background
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
      <div class="not-data" v-if="!loading && !searchData.length">暂无数据</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { searchList } from "@/api/job";
import useRouterStore from "@/store/module/router";

const loading = ref(false);
const paramsStore = useRouterStore();
const filters = ref<any>([]);
const searchValue = ref<any>("");
const searchData = ref<any>([]); // 搜索结果
const total = ref(0);
const searchPage = reactive({
  currentPage: 1,
  pageSize: 12,
});
const emit = defineEmits(["change"]);

// 初始化数据
onMounted(() => {
  searchValue.value = paramsStore.searchValue;
  getList();
});

/** 获取数据 */
const getList = async () => {
  loading.value = true;
  try {
    const res = await searchList({
      ...searchPage,
      condition: {
        keywords: searchValue.value,
      },
    });
    loading.value = false;
    const { pageItems, totalCount } = res.body;
    total.value = totalCount;
    searchData.value = pageItems;
  } catch (error) {
    loading.value = false;
  }
};
/** 搜索职位 */
const search = async (search = "" as string) => {
  searchValue.value = search;
  getList();
};

/** 重置筛选条件 */
const resetFilter = () => {
  filters.value.length = 0;
  searchValue.value = "";
  getList();
};

/** 修改每页数量 */
const handleSizeChange = (value: number) => {
  searchPage.pageSize = value;
  getList();
};

/** 改变当前页 */
const handleCurrentChange = (value: number) => {
  searchPage.currentPage = value;
  getList();
};
</script>
<style lang="scss" scoped>
.main {
  display: flex;
  align-items: center;
  height: 100%;
  width: 100%;
  margin-top: 13px;
  flex-direction: column;
}
.search-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.filters {
  min-height: 24px;
  margin-top: 20px;
  display: flex;
  justify-content: flex-start;
  .total-title {
    flex-shrink: 0;
    min-width: 80px;
    margin: 0 8px 13px 0;
    padding-top: 3px;
  }
  .tags {
    display: flex;
    flex-wrap: wrap;
    flex: 1;
  }
  .reset-btn {
    margin-bottom: 10px;
  }
  :deep(.el-tag) {
    margin: 0 10px 10px 0;
  }
}
.pagination {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}
.not-data {
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
}
</style>
