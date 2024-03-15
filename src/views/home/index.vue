<template>
  <div class="home">
    <!-- 搜索 -->
    <SearchBar />
    <!-- 顶部导航 -->
    <div class="nav">
      <div class="nav-list min-width">
        <div class="goods">
          热门兑换
          <ul class="good-list">
            <li
              class="list-item"
              v-for="(item, index) in goodList"
              :key="index"
              @click="jumpDetail(item)"
            >
              {{ item.name }}
            </li>
          </ul>
        </div>
        <ul class="nav-bar">
          <li
            class="nav-item"
            v-for="(item, index) in navList"
            :key="index"
            @click="navTo(item.path)"
          >
            {{ item.name }}
          </li>
        </ul>
      </div>
    </div>
    <div class="main min-width">
      <!-- 主推荐位 -->
      <div class="core-rec">
        <!-- <div class="seckill">秒杀</div> -->
        <el-image
          class="banner"
          @click="jumpDetail(imageData)"
          fit="cover"
          :src="imageData.displayImage"
          lazy
        ></el-image>
        <div class="other">
          <el-image
            class="other-item"
            v-for="(item, index) in otherIamge"
            :key="index"
            @click="jumpDetail(item)"
            :src="item.displayImage"
            fit="cover"
            lazy
          ></el-image>
        </div>
        <div class="user">
          <div class="user-info">
            <div class="avatar" />
            <div class="info" v-if="userStore.userInfo?.username">
              <span class="username">{{ userStore.userInfo.username }}</span>
              <span class="level-title">{{
                userStore.userInfo.levelTitle
              }}</span>
              <span class="create-time"></span>
            </div>
            <span v-else class="user-login" @click="toLogin">请登录</span>
          </div>
          <div class="rec-hot">
            <ul class="news">
              <li
                class="new-item"
                v-for="(item, index) in hots"
                :key="index"
                @click="jumpDetail(item)"
              >
                <span class="type" :class="index <= 2 ? 'large' : ''">{{
                  index + 1
                }}</span>
                <span class="name" :title="item.name">{{ item.name }}</span>
                <span class="icon-type" :class="hotType[item.secondaryName]">{{
                  hotName[item.secondaryName]
                }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <!-- 推荐位 -->
      <ul class="rec-navbar">
        <li
          v-for="(item, index) in recNavBarData"
          :key="index"
          @click="reccChange(index, item.value)"
          class="rec-nav-item"
          :class="activeIndex === index ? 'active' : ''"
        >
          {{ item.title }}
        </li>
      </ul>
      <ul class="rec-result" v-loading="loading">
        <li
          class="goods-item"
          v-for="(item, index) in recData"
          :key="index"
          @click="jumpDetail(item)"
        >
          <el-image fit="cover" :src="item.displayImage" lazy></el-image>
        </li>
      </ul>
      <div class="rights">
        <div class="title">
          <span class="text">权益产品</span>
          <span class="bg-line"></span>
        </div>
        <ul class="goods">
          <li
            class="goods-item"
            v-for="(item, index) in rights"
            :key="index"
            @click="jumpDetail(item)"
          >
            <el-image fit="cover" :src="item.displayImage" lazy></el-image>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { coreRec } from "@/api";
import useUserStore from "@/store/module/user";
import { useJump } from "@/hooks/jump";

const jumpDetail = useJump();
const loading = ref(false);
const navList = ref([
  { name: "酒店精选", path: "hotel" },
  { name: "买车卖车", path: "usedCar" },
  { name: "优选好物", path: "goods" },
  { name: "岗位热招", path: "recruitment" },
  { name: "生活周边", path: "" },
  { name: "爱心公益", path: "" },
]);
const recNavBarData = ref([
  { title: "为你推荐", value: "002" },
  { title: "热门景点", value: "003" },
  { title: "精选好车", value: "004" },
  { title: "品质优选", value: "005" },
]);
const hotType = {
  0: "",
  1: "new",
  2: "hot",
  3: "top",
} as any;

const hotName = {
  0: "",
  1: "新",
  2: "热",
  3: "沸",
} as any;

const imageData = ref<any>({}); // 主推大图
const otherIamge = ref<any>([]); // 主推三张小图
const goodList = ref<any>([]); // 热门兑换
const recData = ref<any>([]); // 首推
const rights = ref<any>([]); // 权益商品
const hots = ref<any>([]); // 热搜
const userStore = useUserStore();

// 当前展示的数据
const activeIndex = ref(0);

/** 跳转一级路由 */
const router = useRouter();
const navTo = (path: string) => {
  router.push(path);
};

/** 跳转登录 */
const toLogin = () => router.push("login");

/**
 * 获取推位数据
 * web: 000-首页，
 * type: 001-主推荐位
 *  */
const getCoreRec = async (type: string) => {
  loading.value = true;
  try {
    const res = await coreRec({
      pageSize: 10,
      currentPage: 1,
      condition: {
        web: "000",
        type,
      },
    });
    loading.value = false;
    const { pageItems } = res.body;
    return pageItems;
  } catch (error) {
    loading.value = false;
  }
};

const reccChange = async (index: number, type: string) => {
  activeIndex.value = index;
  const res = await getCoreRec(type);
  recData.value = res;
};

/** 获取所有推位数据 */
const getAllRecData = async () => {
  const peromiseArr = [
    getCoreRec("001"), // 主推荐
    getCoreRec("002"), // 为你推荐
    getCoreRec("006"), // 权益商品
    getCoreRec("007"), // 热门兑换
    getCoreRec("008"), // 热搜
  ];
  const res = await Promise.all(peromiseArr);
  const [core, recDatas, rightsData, goodLists, hotList] = res;
  imageData.value = core[0];
  if (core.length > 4) {
    otherIamge.value = core.slice(1, 4);
  } else {
    otherIamge.value = core.slice(1, core.length);
  }
  recData.value = recDatas;
  rights.value = rightsData;
  hots.value = hotList;
  if (goodLists.length > 10) {
    goodList.value = goodLists.slice(0, 10);
  } else {
    goodList.value = goodLists;
  }
};
getAllRecData();
</script>
<style lang="scss" scoped>
.home {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.nav {
  width: 100%;
  background-color: #fff;
  display: flex;
  justify-content: center;
  .nav-list {
    display: flex;
    align-items: center;
    .goods {
      position: relative;
      margin-right: 37px;
      width: 197px;
      height: 38px;
      line-height: 38px;
      background: #e20755;
      border-radius: 8px 8px 0px 0px;
      color: #ffffff;
      text-align: center;
      .good-list {
        position: absolute;
        top: 40px;
        left: 0;
        width: 197px;
        list-style: none;
        margin: 0;
        padding: 0 0 10px 0;
        background: #ffffff;
        border-radius: 0 0 8px 8px;
        .list-item {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 10px 0;
          height: 40px;
          width: 100%;
          text-align: center;
          color: #333333;
          font-size: 14px;
          cursor: pointer;
          box-sizing: border-box;
        }
      }
    }
    .nav-bar {
      display: flex;
      align-items: center;
      list-style: none;
      margin: 0;
      padding: 0;
      font-size: 16px;
      color: #3c3c3c;
      .nav-item {
        margin-right: 49px;
        cursor: pointer;
      }
    }
  }
}
.main {
  .core-rec {
    display: flex;
    justify-content: center;
    margin-top: 10px;
    // .seckill {
    //   width: 197px;
    //   height: 230px;
    //   margin-top: 172px;
    //   background: #ffffff;
    //   border-radius: 8px;
    // }
    .banner {
      width: 579px;
      height: 401px;
      margin: 0 10px 0 207px;
      border-radius: 8px;
      cursor: pointer;
    }
    .other {
      width: 197px;
      margin-right: 10px;
      .other-item {
        display: flex;
        width: 197px;
        height: 127px;
        margin-bottom: 10px;
        border-radius: 8px;
        overflow: hidden;
        cursor: pointer;
        :deep(.el-image) {
          width: 100%;
          height: 100%;
        }
      }
    }
    .user {
      width: 197px;
      height: 401px;
      padding: 15px 14px;
      background: #ffffff;
      border-radius: 8px;
      box-sizing: border-box;
      .user-info {
        display: flex;
        align-items: center;
        padding-bottom: 14px;
        border-bottom: 0.5px solid #ebebeb;
        .avatar {
          width: 54px;
          height: 54px;
          background: url("@/assets/images/avatar.png");
          background-size: cover;
          margin-right: 9px;
        }
        .user-login {
          color: #e20755;
          cursor: pointer;
        }
        .info {
          display: flex;
          flex-direction: column;
          .username {
            margin-bottom: 5px;
            font-size: 14px;
            color: #333333;
          }
          .level-title {
            font-size: 12px;
            color: #666666;
          }
        }
      }
      .rec-hot {
        margin-top: 14px;
        padding-bottom: 20px;
        .new-item {
          display: flex;
          position: relative;
          align-items: center;
          height: 29px;
          font-size: 13px;
          color: #666666;
          cursor: pointer;
          .type {
            margin-right: 8px;
            color: #ff8200;
            font-style: italic;
            &.large {
              color: #f95858;
              font-size: 17px;
              font-weight: 600;
            }
          }
          .name {
            width: 120px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .icon-type {
            position: absolute;
            right: 0;
            display: inline-block;
            width: 20px;
            height: 20px;
            border-radius: 4px;
            line-height: 20px;
            text-align: center;
            font-size: 12px;
            color: #ffffff;
            transform: scale(0.8);
            &.hot {
              background-color: rgb(248, 100, 0);
            }
            &.new {
              background-color: rgb(255, 56, 82);
            }
            &.top {
              background-color: rgb(248, 100, 0);
            }
          }
        }
      }
    }
  }
  .rec-navbar {
    display: flex;
    align-items: center;
    height: 60px;
    margin: 0;
    padding-left: 96px;
    list-style: none;
    background: #fff;
    border-radius: 8px 8px 8px 8px;
    .rec-nav-item {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 200px;
      padding: 0 64px;
      line-height: 21px;
      box-sizing: border-box;
      color: #333333;
      font-size: 18px;
      cursor: pointer;
      &::after {
        display: inline-block;
        content: "";
        height: 26px;
        width: 2px;
        position: absolute;
        right: 0;
        background: #e7e7e7;
        opacity: 0.5;
      }
      &.active {
        padding: 0 49px;
        line-height: 28px;
        font-size: 24px;
        font-weight: 500;
        color: #e20755;
      }
      &:last-of-type {
        &::after {
          content: none;
        }
      }
    }
  }
  .rec-result,
  .goods {
    display: flex;
    flex-wrap: wrap;
    margin-top: 8px;
    margin-right: -8px;
    .goods-item {
      width: 294px;
      height: 147px;
      margin: 0 8px 8px 0;
      border-radius: 8px;
      overflow: hidden;
      cursor: pointer;
      :deep(.el-image) {
        width: 100%;
        height: 100%;
      }
    }
  }
  .rights {
    margin: 49px 0 54px 0;
  }
  .title {
    position: relative;
    display: flex;
    justify-content: center;
    margin-bottom: 31px;
    text-align: center;
    .text {
      position: absolute;
      bottom: 4px;
      font-size: 28px;
      font-weight: 600;
      color: #484545;
    }
    .bg-line {
      width: 154px;
      height: 15px;
      display: inline-block;
      background: #d9d9d9;
    }
  }
}
</style>
