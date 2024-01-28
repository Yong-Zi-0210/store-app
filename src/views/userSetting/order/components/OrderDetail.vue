<template>
  <el-dialog
    :model-value="modelValue"
    :close-on-click-modal="false"
    @close="close"
    title="订单详情"
    width="65%"
  >
    <el-row :gutter="24">
      <el-col :span="12">
        <el-row :gutter="24">
          <el-col :span="6">商品名称:</el-col>
          <el-col :span="14">{{ detail.goodsName }}</el-col>
        </el-row>
      </el-col>
      <el-col :span="12">
        <el-row :gutter="24">
          <el-col :span="6">单件积分:</el-col>
          <el-col :span="14">{{ detail.points }}</el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="12">
        <el-row :gutter="24">
          <el-col :span="6">数量:</el-col>
          <el-col :span="14">{{ detail.quantity }}</el-col>
        </el-row>
      </el-col>
      <el-col :span="12">
        <el-row :gutter="24">
          <el-col :span="6">总消费积分:</el-col>
          <el-col :span="14">{{ detail.totalPoints }}</el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="12">
        <el-row :gutter="24">
          <el-col :span="6">发货时间:</el-col>
          <el-col :span="14">{{
            detail.deliveryTime ? formatDateTime(detail.deliveryTime) : "-"
          }}</el-col>
        </el-row>
      </el-col>
      <el-col :span="12">
        <el-row :gutter="24">
          <el-col :span="6">物流单号:</el-col>
          <el-col :span="14">{{ detail.logistics }}</el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="12">
        <el-row :gutter="24">
          <el-col :span="6">收件人:</el-col>
          <el-col :span="14">{{ detail.deliveryName }}</el-col>
        </el-row>
      </el-col>
      <el-col :span="12">
        <el-row :gutter="24">
          <el-col :span="6">收件人手机号:</el-col>
          <el-col :span="14">{{ detail.deliveryPhone }}</el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="12">
        <el-row :gutter="24">
          <el-col :span="6">收货地区:</el-col>
          <el-col :span="14">{{ detail.deliveryArea }}</el-col>
        </el-row>
      </el-col>
      <el-col :span="12">
        <el-row :gutter="24">
          <el-col :span="6">收货地址:</el-col>
          <el-col :span="14">{{ detail.deliveryAddress }}</el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="12">
        <el-row :gutter="24">
          <el-col :span="6">订单编号:</el-col>
          <el-col :span="14">{{ detail.orderNo }}</el-col>
        </el-row>
      </el-col>
      <el-col :span="12">
        <el-row :gutter="24">
          <el-col :span="6">订单状态:</el-col>
          <el-col :span="14">{{ statusText[detail.status] }}</el-col>
        </el-row>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script setup lang="ts">
import { formatDateTime } from "@/utils";

const statusText = {
  "001": "已支付",
  "002": "已发货",
  "003": "已完成",
  "004": "已关闭",
} as any;

interface Props {
  modelValue: boolean;
  detail: any;
}

withDefaults(defineProps<Props>(), {
  modelValue: false,
  detail: {},
});

const emit = defineEmits(["update:modelValue"]);

/** 关闭 */
const close = () => emit("update:modelValue", false);
</script>
