<template>
  <div class="dialog">
    <el-dialog
      :model-value="props.modelValue"
      :close-on-click-modal="false"
      @close="close"
      @open="open"
      :title="title"
      width="40%"
    >
      <el-form
        :model="formData"
        :rules="rules"
        ref="ruleRef"
        label-width="auto"
      >
        <el-form-item label="收货人" prop="deliveryName">
          <el-input v-model="formData.deliveryName" />
        </el-form-item>
        <el-form-item label="收货人手机号" prop="deliveryPhone">
          <el-input v-model="formData.deliveryPhone" />
        </el-form-item>
        <el-form-item label="地区" prop="deliveryArea">
          <el-cascader
            v-model="formData.deliveryArea"
            :options="areaOptions"
            :props="cascaderProps"
          />
        </el-form-item>
        <el-form-item label="详细地址" prop="deliveryAddress">
          <el-input type="textarea" v-model="formData.deliveryAddress" />
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
import { ref, reactive, computed, nextTick } from "vue";
import { addAddress, editAddress, cites } from "@/api";
import { ElMessage, FormInstance, FormRules } from "element-plus";

interface Props {
  data?: any;
  modelValue: boolean;
}
const cascaderProps = {
  value: "name",
  label: "name",
  children: "cities",
};
const areaOptions = ref([]);
const ruleRef = ref<FormInstance>();
const formData = reactive<any>({
  deliveryName: "", // 收货人
  deliveryPhone: "", // 手机
  deliveryArea: [], // 地区
  deliveryAddress: "", // 地址
});
const title = computed(() =>
  props.data?.id ? "编辑收货地址" : "新增收货地址"
);
const operType = computed(() => (props.data?.id ? "edit" : "add"));
const rules = reactive<FormRules>({
  deliveryName: [
    { required: true, message: "请输入收货人", trigger: "change" },
  ],
  deliveryArea: [{ required: true, message: "请选择地区", trigger: "change" }],
  deliveryAddress: [
    { required: true, message: "请输入详细地址", trigger: "change" },
  ],
  deliveryPhone: [
    { required: true, message: "请输入手机号", trigger: "change" },
    {
      pattern: /^1[3456789]\d{9}$/,
      message: "请输入正确的手机号",
      trigger: "blur",
    },
  ],
});
const props = withDefaults(defineProps<Props>(), {
  data: {},
  modelValue: false,
});
const emit = defineEmits(["update:modelValue", "refresh"]);

/** 关闭 */
const close = () => emit("update:modelValue", false);

/** 初始化 */
const open = () => {
  nextTick(() => {
    ruleRef.value?.resetFields();
    if (props.data?.id) {
      initFormFields(props.data);
    }
  });
};
const initFormFields = (detail: any) => {
  for (const key in detail) {
    if (Object.prototype.hasOwnProperty.call(formData, key)) {
      if (key !== "deliveryArea") {
        formData[key] = detail[key];
      }
    }
    formData.deliveryArea = detail.deliveryArea.split("/");
  }
};

// 新增
const add = async (data: object) => {
  await addAddress(data);
  ElMessage.success("新增成功");
};

// 编辑
const edit = async (data: object) => {
  await editAddress(data);
  ElMessage.success("修改成功");
};
/** 确定 */
const confirm = () => {
  ruleRef?.value?.validate(async (validate) => {
    if (validate) {
      const newDeliveryArea = JSON.parse(JSON.stringify(formData.deliveryArea));
      const params = Object.assign(formData, {
        deliveryArea: newDeliveryArea.join("/"),
      });
      operType.value === "add"
        ? await add({ ...params })
        : await edit({ ...params, id: props.data.id });
      emit("update:modelValue", false);
      emit("refresh");
    } else {
    }
  });
};

/** 获取省市区数据 */
const getCites = async () => {
  try {
    const res = await cites();
    areaOptions.value = res.body;
  } catch (error) {}
};
getCites();
</script>
<style lang="scss" scoped>
.dialog {
  background-color: red !important;
  :deep(.el-dialog__body) {
    padding-top: 0 !important;
  }
  :deep(.el-cascader) {
    width: 100%;
  }
  :deep(.el-form) {
    margin-top: 10px;
  }
}
</style>
