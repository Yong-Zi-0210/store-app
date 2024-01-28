<template>
  <el-select
    v-model="addressIndex"
    class="m-2"
    size="large"
    style="width: 240px"
    placeholder="请选择地址"
    @change="change"
  >
    <el-option
      v-for="(item, index) in addressOptions"
      :key="item.id"
      :label="item.deliveryAddress"
      :value="index"
    />
  </el-select>
</template>
<script setup lang="ts">
import { reactive, ref } from "vue";
import { addressList } from "@/api";

interface Options {
  [key: string]: any;
}
interface Props {
  deliveryName: string;
  deliveryPhone: string;
  deliveryArea: string;
  deliveryAddress: string;
}
const addressIndex = ref();
const data = reactive<Options>({
  deliveryName: "",
  deliveryPhone: "",
  deliveryArea: "",
  deliveryAddress: "",
});
const addressOptions = ref<Options[]>([]);
withDefaults(defineProps<Props>(), {
  deliveryName: "",
  deliveryPhone: "",
  deliveryArea: "",
  deliveryAddress: "",
});

const emit = defineEmits([
  "update:deliveryName",
  "update:deliveryPhone",
  "update:deliveryArea",
  "update:deliveryAddress",
]);

/** 改变地址 */
const change = (index: number) => {
  data.deliveryName = addressOptions.value[index]?.deliveryName;
  data.deliveryPhone = addressOptions.value[index]?.deliveryPhone;
  data.deliveryAddress = addressOptions.value[index]?.deliveryAddress;
  data.deliveryArea = addressOptions.value[index]?.deliveryArea;
  emit("update:deliveryName", data.deliveryName);
  emit("update:deliveryPhone", data.deliveryPhone);
  emit("update:deliveryAddress", data.deliveryAddress);
  emit("update:deliveryArea", data.deliveryArea);
};

/** 获取地址列表 */
const getList = async () => {
  try {
    const res = await addressList();
    addressOptions.value = res.body;
    if (addressOptions.value.length) {
      const index = addressOptions.value.findIndex((item) => item?.isFirst);
      addressIndex.value = index;
      change(index);
    }
  } catch (error) {}
};

getList();
</script>
