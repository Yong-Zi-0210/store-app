<template>
  <div class="base-info">
    <div class="header">
      <div class="avatar" />
      <div class="info">
        <div class="name">{{ userInfo.username }}</div>
        <div class="level">
          <el-text :type="type">{{ userInfo.levelTitle }}</el-text>
        </div>
        <div class="points">
          <span class="label">积分：</span>
          <span class="value">{{ userInfo.points }}</span>
        </div>
      </div>
    </div>
    <div class="points-record">
      <div class="title">积分消费记录</div>
      <el-timeline>
        <el-timeline-item
          v-for="(item, index) in records"
          :timestamp="formatDateTime(item.createTime)"
          :key="index"
          placement="top"
        >
          <el-card>
            <h4 class="points-num">
              消费积分：<span>{{ item.points }}</span>
            </h4>
            <p class="description">{{ item.description }}</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref, reactive } from "vue";
import useUserStore from "@/store/module/user";
import { formatDateTime } from "@/utils";
import { pointsRecord } from "@/api";

const userStore = useUserStore();
const { userInfo } = userStore;
const records = ref();
const pageParams = reactive({
  pageSize: 10,
  currentPage: 1,
});
const type = computed(() => {
  if (userInfo.level) {
    if (userInfo.level < 3) {
      return "info";
    } else if (userInfo.level < 5 && userInfo.level >= 3) {
      return "warnning";
    } else {
      return "danger";
    }
  } else {
    return "info";
  }
});

const getRecords = async () => {
  try {
    const res = await pointsRecord({
      ...pageParams,
    });
    records.value = res.body.pageItems;
  } catch (error) {}
};
getRecords();
</script>
<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;
  .avatar {
    width: 64px;
    height: 64px;
    background: url("@/assets/images/avatar.png");
    background-size: cover;
    margin-right: 12px;
  }
  .info {
    .name {
      display: flex;
      font-size: 14px;
      color: #333;
      margin-bottom: 2px;
    }
    .points {
      margin: 5px 0;
      display: flex;
      align-items: center;
      font-size: 14px;
      color: #666;
      .value {
        color: #e20755;
      }
    }
  }
}
.points-record {
  margin-top: 30px;
  .title {
    margin-bottom: 15px;
    font-size: 14px;
    color: #666;
  }
  .points-num {
    color: #333;
    span {
      color: #e20755;
    }
  }
  .description {
    color: #666;
    font-size: 14px;
  }
}
</style>
