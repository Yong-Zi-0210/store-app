<template>
  <div class="dialog">
    <el-dialog
      :model-value="props.modelValue"
      :close-on-click-modal="false"
      @close="close"
      title="兑换商品"
      width="30%"
    >
      <div class="points">
        <p class="my-points">
          <span>我的积分：</span>
          <el-text type="success">{{ userInfo.points }}</el-text>
        </p>
        <div
          class="tips"
          v-if="userInfo.points && userInfo.points >= props.points"
        >
          确定消费<span style="color: #e20755">{{ props.points }} </span
          >积分兑换该商品吗？
        </div>
        <el-text v-else type="danger">当前积分不足</el-text>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="close">取消</el-button>
          <el-button
            v-if="userInfo.points && userInfo.points >= props.points"
            type="primary"
            @click="confirm"
            :loading="props.loading"
          >
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import useUserStore from "@/store/module/user";
import { storeToRefs } from "pinia";

const userStroe = useUserStore();
const { userInfo } = storeToRefs(userStroe);
interface Props {
  points?: number;
  loading?: boolean;
  modelValue: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  points: 0,
  loading: false,
  modelValue: false,
});
const emit = defineEmits(["update:modelValue", "confirm"]);

/** 关闭 */
const close = () => emit("update:modelValue", false);

/** 确定 */
const confirm = () => {
  emit("confirm");
};
</script>
<style lang="scss" scoped>
.dialog {
  :deep(.el-dialog__body) {
    padding-top: 0 !important;
  }
  :deep(.el-form) {
    margin-top: 10px;
  }
}
</style>
