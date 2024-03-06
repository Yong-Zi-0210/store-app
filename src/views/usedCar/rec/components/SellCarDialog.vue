<script setup lang="ts">
import { reactive, ref, nextTick } from "vue";
import { sellCar } from "@/api/usedCar";
import { FormRules } from "element-plus";
import { ElMessage, FormInstance } from "element-plus";

interface Props {
  modelValue: boolean;
}

interface AnyObject {
  [key: string]: any;
}
const baseFormRef = ref<FormInstance>();
const emit = defineEmits(["update:modelValue", "refresh"]);
const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
});

// 基本信息字段
const formData = reactive<AnyObject>({
  city: "", // 城市
  brand: "", // 品牌
  carName: "", // 车名
  contactName: "", // 联系人
  contactPhone: "", // 联系电话
});

const rules = reactive<FormRules>({
  city: [{ required: true, trigger: "change", message: "请输入城市" }],
  brand: [{ required: true, trigger: "change", message: "请输入品牌" }],
  carName: [{ required: true, trigger: "change", message: "请输入车名" }],
  contactName: [{ required: true, trigger: "change", message: "请输入联系人" }],
  contactPhone: [
    { required: true, trigger: "change", message: "请输入手机号" },
    {
      pattern: /^1[3456789]\d{9}$/,
      message: "请输入正确的手机号",
      trigger: "blur",
    },
  ],
});
/** 打开 */
const open = () => {
  nextTick(() => {
    baseFormRef.value?.resetFields();
  });
};
/** 关闭 */
const close = () => {
  emit("update:modelValue", false);
};

// 新增
const add = async (data: object) => {
  await sellCar(data);
  ElMessage.success("新增成功");
};

/** 确认 */
const confirm = () => {
  baseFormRef.value?.validate(async (validate) => {
    if (validate) {
      await add({ ...formData });
      emit("update:modelValue", false);
      emit("refresh");
    }
  });
};
</script>

<template>
  <el-dialog
    :model-value="props.modelValue"
    :close-on-click-modal="false"
    title="我要卖车"
    @open="open"
    @close="close"
    width="450px"
  >
    <template #default>
      <el-form
        :model="formData"
        :rules="rules"
        label-width="auto"
        ref="baseFormRef"
      >
        <el-form-item label="城市" prop="city">
          <el-input
            v-model="formData.city"
            clearable
            placeholder="城市"
          ></el-input>
        </el-form-item>
        <el-form-item label="品牌" prop="brand">
          <el-input
            v-model="formData.brand"
            clearable
            placeholder="品牌"
          ></el-input>
        </el-form-item>
        <el-form-item label="车名" prop="carName">
          <el-input
            v-model="formData.carName"
            clearable
            placeholder="车名"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="contactName">
          <el-input
            v-model="formData.contactName"
            clearable
            placeholder="联系人"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="contactPhone">
          <el-input
            v-model="formData.contactPhone"
            clearable
            placeholder="请输入手机号码"
          ></el-input>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="confirm"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<style scoped lang="scss"></style>
