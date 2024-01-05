<template>
  <div class="dialog">
    <el-dialog
      :model-value="props.modelValue"
      :close-on-click-modal="false"
      @close="close"
      title="沟通信息"
      width="30%"
    >
      <el-alert
        title="我们将把您的联系方式发送给车商，车商稍后会与您联系。"
        type="warning"
      />
      <el-form
        :model="formData"
        :rules="rules"
        ref="ruleRef"
        label-width="auto"
      >
        <el-form-item label="姓名" prop="userRealName">
          <el-input v-model="formData.userRealName" />
        </el-form-item>
        <el-form-item label="手机号" prop="userContactPhone">
          <el-input v-model="formData.userContactPhone" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="close">取消</el-button>
          <el-button type="primary" @click="confirm"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { communicate } from "@/api/usedCar";
import { ElMessage, FormInstance, FormRules } from "element-plus";
import { ref, reactive } from "vue";

interface Props {
  info?: any;
  modelValue: boolean;
}
const ruleRef = ref<FormInstance>();
const formData = reactive({
  userRealName: "", // 用户真实姓名
  userContactPhone: "", // 手机
});
const rules = reactive<FormRules>({
  userRealName: [{ required: true, message: "请输入姓名", trigger: "change" }],
  userContactPhone: [
    { required: true, message: "请输入手机号", trigger: "change" },
    {
      pattern: /^1[3456789]\d{9}$/,
      message: "请输入正确的手机号",
      trigger: "blur",
    },
  ],
});
const props = withDefaults(defineProps<Props>(), {
  info: {},
  modelValue: false,
});
const emit = defineEmits(["update:modelValue"]);

/** 关闭 */
const close = () => emit("update:modelValue", false);

/** 确定 */
const confirm = () => {
  ruleRef?.value?.validate(async (val) => {
    if (val) {
      await handleCommunicate();
      emit("update:modelValue", false);
    }
  });
};
/** 预约沟通 */
const handleCommunicate = async () => {
  try {
    await communicate({
      ...formData,
      ...props.info,
    });
    ElMessage.success("操作成功");
  } catch (error) {}
};
</script>
<style lang="scss" scoped>
.dialog {
  background-color: red !important;
  :deep(.el-dialog__body) {
    padding-top: 0 !important;
  }
  :deep(.el-form) {
    margin-top: 10px;
  }
}
</style>
