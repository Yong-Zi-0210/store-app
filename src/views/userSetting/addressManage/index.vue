<template>
  <div class="address-manage">
    <el-button type="primary" @click="add">新增</el-button>
    <el-table :data="addressList" v-loading="loading">
      <el-table-column prop="deliveryName" label="收货人" />
      <el-table-column prop="deliveryPhone" label="收货人手机号" />
      <el-table-column prop="deliveryArea" label="地区" />
      <el-table-column prop="deliveryAddress" label="收货地址" />
      <el-table-column prop="oper" label="操作">
        <template v-slot="scope">
          <el-button type="warning" link @click="edit(scope.row)"
            >修改</el-button
          >
          <el-button type="danger" link @click="delAddress(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
      <el-table-column prop="isFirst" label="">
        <template v-slot="scope">
          <el-tag v-if="scope.row.isFirst">默认地址</el-tag>
          <el-button v-else link type="info" @click="setDefault(scope.row)"
            >设为默认</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        v-model:current-page="pageParams.currentPage"
        v-model:page-size="pageParams.pageSize"
        :page-sizes="[10, 20, 30, 45]"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <addressAddEdit
      v-model="addDialog"
      :data="detailData"
      @refresh="getAddress"
    />
  </div>
</template>
<script setup lang="ts">
import { reactive, ref } from "vue";
import { address, editAddress } from "@/api";
import { ElMessage, ElMessageBox } from "element-plus";

const loading = ref(false);
const addDialog = ref(false);
const total = ref(0);
const addressList = ref([]);
const detailData = ref({});
const pageParams = reactive({
  pageSize: 10,
  currentPage: 1,
});

/** 获取收货地址 */
const getAddress = async () => {
  loading.value = true;
  try {
    const res = await address({
      ...pageParams,
    });
    loading.value = false;
    total.value = res.body.totalCount;
    addressList.value = res.body.pageItems;
  } catch (error) {
    loading.value = false;
  }
};
getAddress();

/** 新增 */
const add = () => {
  addDialog.value = true;
  detailData.value = {};
};
/** 编辑 */
const edit = (row: any) => {
  addDialog.value = true;
  detailData.value = row;
};

/** 删除 */
const delAddress = async (row: any) => {
  ElMessageBox.confirm("确定要删除该收货地址吗？", "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      const newRow = Object.assign(row, { status: "002" });
      try {
        await editAddress({
          ...newRow,
        });
        getAddress();
        ElMessage({
          type: "success",
          message: "删除成功",
        });
      } catch (error) {}
    })
    .catch(() => {});
};

/** 设置默认地址 */
const setDefault = async (row: any) => {
  try {
    const newRow = Object.assign(row, { isFirst: true });
    await editAddress({
      ...newRow,
    });
    getAddress();
    ElMessage.success("设置成功");
  } catch (error) {}
};

// 修改每页数量
const handleSizeChange = (value: number) => {
  pageParams.pageSize = value;
  getAddress();
};

// 改变当前页
const handleCurrentChange = (value: number) => {
  pageParams.currentPage = value;
  getAddress();
};
</script>
<style lang="scss" scoped>
.pagination {
  margin-top: 10px;
}
</style>
