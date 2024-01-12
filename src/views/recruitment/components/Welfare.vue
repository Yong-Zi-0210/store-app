<template>
  <div class="welfare-list">
    <el-tag
      class="welfare-item"
      type="info"
      v-for="(item, index) in showTags"
      :key="index"
    >
      {{ item }}
    </el-tag>
    <el-dropdown v-if="moreTags.length">
      <el-tag type="info">...</el-tag>
      <template #dropdown>
        <div class="more-welfare">
          <el-tag
            class="welfare-item"
            type="info"
            v-for="(item, index) in moreTags"
            :key="index"
          >
            {{ item }}
          </el-tag>
        </div>
      </template>
    </el-dropdown>
  </div>
</template>
<script setup lang="ts">
import { computed, watch, ref } from "vue";

const showTags = ref<any>([]);
const moreTags = ref<any>([]);
interface Props {
  tags: string;
}
const props = withDefaults(defineProps<Props>(), {
  tags: "",
});

const formatTags = computed(() => {
  if (props.tags.includes("|")) {
    return props.tags.split("|");
  } else {
    return [props.tags];
  }
});

console.log(formatTags);

watch(
  () => formatTags.value,
  () => {
    if (formatTags.value.length > 5) {
      showTags.value = formatTags.value.slice(0, 5);
      moreTags.value = formatTags.value.slice(5, formatTags.value.length);
    } else {
      showTags.value = formatTags.value;
    }
  },
  { immediate: true }
);
</script>
<style lang="scss" scoped>
.welfare-item {
  margin: 0 8px 8px 0;
}
.more-welfare {
  padding: 20px;
}
</style>
