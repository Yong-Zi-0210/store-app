<script setup lang="ts">
import { reactive, ref } from "vue";
import { sellCarList } from "@/api/usedCar";
import { formatDateTime } from "@/utils";

interface Props {
  modelValue: boolean;
  data?: AnyObject;
}

interface AnyObject {
  [key: string]: any;
}

const loading = ref(false);
const sellCarDialog = ref(false);
const tableData = ref([]);
const filterForm = reactive({});
// 分页信息
const total = ref(0);
const pageParams = reactive({
  currentPage: 1,
  pageSize: 50,
});
const statusMap = {
  "001": {
    type: "info",
    text: "待联系",
  },
  "002": {
    type: "success",
    text: "已联系",
  },
} as any;
const emit = defineEmits(["update:modelValue", "refresh"]);
const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  data: () => {
    return {};
  },
});

/** 打开 */
const open = () => {
  search();
};
/** 关闭 */
const close = () => {
  emit("update:modelValue", false);
};

// 新增
const addDialog = async () => {
  sellCarDialog.value = true;
};

// 列表请求
const getData = async () => {
  loading.value = true;
  try {
    const res = await sellCarList({
      ...pageParams,
      condition: {
        ...filterForm,
      },
    });
    loading.value = false;
    const { body } = res;
    total.value = body.totalCount;
    tableData.value = body.pageItems;
  } catch (error) {
    loading.value = false;
  }
};

// 搜索
const search = () => {
  pageParams.pageSize = 50;
  pageParams.currentPage = 1;
  getData();
};

// 修改每页数量
const handleSizeChange = (value: number) => {
  pageParams.pageSize = value;
  getData();
};

// 改变当前页
const handleCurrentChange = (value: number) => {
  pageParams.currentPage = value;
  getData();
};
</script>

<template>
  <el-dialog
    :model-value="props.modelValue"
    :close-on-click-modal="false"
    @open="open"
    @close="close"
    width="80%"
  >
    <template #default>
      <el-button class="add-btn" type="primary" @click="addDialog"
        >新增</el-button
      >
      <el-table
        :data="tableData"
        :max-height="500"
        border
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="city" label="城市" />
        <el-table-column prop="brand" label="品牌" />
        <el-table-column prop="carName" label="车名" width="120" />
        <el-table-column prop="contactName" label="联系人" />
        <el-table-column prop="contactPhone" label="联系电话" width="120" />
        <el-table-column prop="status" label="状态" width="120">
          <template v-slot="scope">
            <el-text :type="statusMap[scope.row.status].type">{{
              statusMap[scope.row.status].text
            }}</el-text>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="160">
          <template v-slot="scope">
            <span>{{ formatDateTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="modifyTime" label="修改时间" width="160">
          <template v-slot="scope">
            <span>{{ formatDateTime(scope.row.modifyTime) }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          v-model:current-page="pageParams.currentPage"
          v-model:page-size="pageParams.pageSize"
          :page-sizes="[50, 150, 300, 400]"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
      <SellCarDialog v-model="sellCarDialog" @refresh="getData" />
    </template>
  </el-dialog>
</template>
<style scoped lang="scss">
.add-btn {
  margin-bottom: 10px;
}
.pagination {
  margin-top: 15px;
}
</style>
