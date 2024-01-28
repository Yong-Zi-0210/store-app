<template>
  <div class="app-breadcrumb">
    <el-breadcrumb :separator-icon="ArrowRight">
      <transition-group name="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }" key="home"
          >首页</el-breadcrumb-item
        >
        <el-breadcrumb-item
          v-for="(item, index) in breadcrumbs"
          :key="item.path"
        >
          <span
            v-if="
              item.redirect === 'noRedirect' || index == breadcrumbs.length - 1
            "
            class="no-redirect"
            >{{ item.meta.title }}</span
          >
          <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
        </el-breadcrumb-item>
      </transition-group>
    </el-breadcrumb>
  </div>
</template>
<script setup lang="ts">
import { type RouteLocationMatched, useRoute, useRouter } from "vue-router";
import { ref, watch } from "vue";
import { ArrowRight } from "@element-plus/icons-vue";
import { compile } from "path-to-regexp";

const route = useRoute();
const router = useRouter();
/** 定义响应式数据 breadcrumbs，用于存储面包屑导航信息 */
const breadcrumbs = ref<any>([]);

/** 编译路由路径 */
const pathCompile = (path: string) => {
  const toPath = compile(path);
  return toPath(route.params);
};

/** 处理面包屑导航点击事件 */
const handleLink = (item: RouteLocationMatched) => {
  const { redirect, path } = item;
  if (redirect) {
    router.push(redirect as string);
    return;
  }
  router.push(pathCompile(path));
};
/** 获取面包屑导航信息 */
const getBreadcrumb = () => {
  breadcrumbs.value = route.matched.filter(
    (item) => item.meta?.title && item.meta?.breadcrumb !== false
  );
};

watch(
  () => router.currentRoute.value.path,
  () => {
    getBreadcrumb();
  },
  { immediate: true, deep: true }
);
</script>
<style lang="scss" scoped>
.app-breadcrumb {
  :deep(.el-breadcrumb) {
    height: 20px;
    line-height: 20px;
    margin-bottom: 8px;
  }
  :deep(.el-breadcrumb__item) {
    .el-breadcrumb__inner {
      color: #e20755;
      a {
        color: #e20755;
      }
    }
    &:last-of-type {
      .el-breadcrumb__inner {
        color: #333;
      }
    }
  }
}
</style>
