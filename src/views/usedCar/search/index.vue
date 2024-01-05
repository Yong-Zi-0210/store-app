<template>
  <!-- 搜索 -->
  <SearchBar
    placeholder="请输入车辆名称"
    :defaultValue="searchValue"
    @handleSearch="search"
  />
  <div class="main">
    <div class="search-container min-width">
      <!-- 品牌分类 -->
      <div class="brands">
        <el-tabs v-model="activeGroup" class="demo-tabs">
          <el-tab-pane
            v-for="(children, key) in brands"
            :key="key"
            :label="key"
            :name="key"
          >
            <el-checkbox-group
              class="group"
              v-model="brandCheckValue"
              @change="brandChange"
            >
              <el-checkbox
                class="group-item"
                v-for="(groupItem, groupIndex) in children"
                :key="groupIndex"
                :label="groupItem.id"
              >
                {{ groupItem.name }}
              </el-checkbox>
            </el-checkbox-group>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="filters">
        <div class="total-title">
          全部结果：{{ searchValue ? `"${searchValue}"` : "" }}
        </div>
        <div class="tags">
          <el-tag
            v-for="(tag, index) in filters"
            :key="tag.value"
            class="ml-2"
            closable
            @close="deleteTag(index, tag.value)"
            type="info"
          >
            {{ tag.label }}
          </el-tag>
          <el-button
            v-if="filters.length || !!searchValue"
            class="reset-btn"
            type="primary"
            size="small"
            plain
            @click="resetFilter"
            >重置</el-button
          >
        </div>
      </div>
      <ul class="result-list" v-loading="loading" v-if="searchData.length">
        <li
          class="result-item"
          v-for="item in searchData"
          :key="item.id"
          @click="toDetail(item)"
        >
          <div
            class="image"
            :style="{ backgroundImage: `url(${item.displayImage})` }"
          ></div>
          <div class="name">{{ item.name }}</div>
          <div class="year-mileage">
            <span class="year"
              >{{ formatDateTime(item.productionYear, "YYYY") }}年</span
            >
            <span class="mileage">{{ setMileage(item.mileage) }}</span>
          </div>
          <div class="price-pay">
            <span class="price">{{ setPrice(item.price) }}</span>
            <span class="down-payment"
              >首付{{ setPrice(item.downPayment) }}</span
            >
          </div>
        </li>
        <div class="pagination">
          <el-pagination
            v-model:current-page="searchPage.currentPage"
            v-model:page-size="searchPage.pageSize"
            :page-sizes="[12, 24, 44, 120]"
            background
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </ul>
      <div class="not-data" v-else>暂无数据</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { brand } from "@/api/usedCar";
import { carList } from "@/api/usedCar";
import useRouterStore from "@/store/module/router";
import { formatDateTime, setMileage, setPrice } from "@/utils";

const router = useRouter();
const loading = ref(false);
const paramsStore = useRouterStore();
const activeGroup = ref("A"); // 当前品牌组
const brands = ref<any>({}); // 品牌
const brandMap = ref<any>({}); // 品牌映射
const brandCheckValue = ref<any>([]); // 选择品牌
const filters = ref<any>([]);
const searchValue = ref<any>("");
const searchFlag = ref(false);
const searchData = ref<any>([]); // 搜索结果
const total = ref(0);
const searchPage = reactive({
  currentPage: 1,
  pageSize: 12,
});
const emit = defineEmits(["change"]);

// 初始化数据
onMounted(() => {
  searchValue.value = paramsStore.searchValue;
  getList();
});

/** 获取汽车品牌 */
const getBrand = async () => {
  try {
    const res = await brand({
      firstLetter: "",
    });
    const { carBrandsByLetter } = res.body;
    brands.value = carBrandsByLetter;
    const map: any = {};
    for (const key in carBrandsByLetter) {
      carBrandsByLetter[key].forEach((item: any) => {
        map[item.id] = item.name;
      });
    }
    brandMap.value = map;
  } catch (error) {}
};
getBrand();

/** 选择品牌 */
const brandChange = (value: number[]) => {
  const checkValue = value.map((item: number) => {
    return {
      value: item,
      label: brandMap.value[item],
    };
  });
  filters.value = checkValue;
  brandCheckValue.value = value;
  getList();
};

/** 获取数据 */
const getList = async () => {
  loading.value = true;
  try {
    const res = await carList({
      ...searchPage,
      condition: {
        brandIds: brandCheckValue.value,
        search: searchValue.value,
      },
    });
    loading.value = false;
    const { pageItems, totalCount } = res.body;
    total.value = totalCount;
    searchData.value = pageItems;
  } catch (error) {
    loading.value = false;
  }
};
/** 搜索车辆 */
const search = async (search = "" as string) => {
  searchFlag.value = true;
  searchValue.value = search;
  getList();
};

/** 删除已选条件 */
const deleteTag = (index: number, value: number) => {
  filters.value.splice(index, 1);
  const brandIndex = brandCheckValue.value.indexOf(value);
  brandCheckValue.value.splice(brandIndex, 1);
  getList();
};

/** 重置筛选条件 */
const resetFilter = () => {
  filters.value.length = 0;
  searchValue.value = "";
  brandCheckValue.value.length = 0;
  getList();
};

/**
 * 跳转详情页
 * |productType|001|二手车|
 * |productType|002|招聘|
 * |productType|003|商城|
 * |productType|004|酒店|
 */
const toDetail = (item: any) => {
  paramsStore.setCarDetail(item);
  router.push("detail");
};

/** 修改每页数量 */
const handleSizeChange = (value: number) => {
  searchPage.pageSize = value;
  getList();
};

/** 改变当前页 */
const handleCurrentChange = (value: number) => {
  searchPage.currentPage = value;
  getList();
};
</script>
<style lang="scss" scoped>
.main {
  display: flex;
  align-items: center;
  height: 100%;
  width: 100%;
  margin-top: 13px;
  flex-direction: column;
  background: #fff;
}
.search-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.brands {
  margin-top: 40px;
  padding: 0 20px;
  box-shadow: 0px 5px 22px 0px rgba(204, 204, 204, 0.25);
  border-radius: 8px;
  .brand-item {
    margin-bottom: 10px;
    .title {
      font-size: 16px;
      margin-bottom: 5px;
      color: #000;
    }
  }
  .group {
    display: flex;
    .group-item {
      margin-right: 26px;
      color: #333;
      font-size: 14px;
    }
  }
}
.filters {
  min-height: 24px;
  margin-top: 20px;
  display: flex;
  justify-content: flex-start;
  .total-title {
    flex-shrink: 0;
    min-width: 80px;
    margin: 0 8px 13px 0;
    padding-top: 3px;
  }
  .tags {
    display: flex;
    flex-wrap: wrap;
    flex: 1;
  }
  .reset-btn {
    margin-bottom: 10px;
  }
  :deep(.el-tag) {
    margin: 0 10px 10px 0;
  }
}
.result-list {
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  margin-right: -20px;
  .result-item {
    margin: 0 18px 46px 0;
    .image {
      width: 287px;
      height: 191px;
      margin-bottom: 12px;
      border-radius: 4px;
      overflow: hidden;
      background-position: center;
      background-size: cover;
      background-repeat: no-repeat;
      cursor: pointer;
    }
    .name {
      margin-bottom: 3px;
      font-size: 16px;
      font-weight: 500;
      color: #535353;
    }
    .year-mileage {
      display: flex;
      align-items: center;
      font-size: 14px;
      color: #adb1b8;
      .year {
        display: flex;
        align-items: center;
        &::after {
          content: "";
          display: inline-block;
          width: 1px;
          height: 12px;
          margin: 0 6px;
          background-color: #adb1b8;
        }
      }
    }
    .price-pay {
      margin-top: 13px;
      display: flex;
      align-items: center;
      .price {
        margin-right: 8px;
        font-size: 18px;
        font-weight: 500;
        color: #e20755;
      }
      .down-payment {
        font-size: 12px;
        font-weight: 400;
        color: #e20755;
      }
    }
  }
  .pagination {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
  }
}
.not-data {
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
}
</style>
@/store/module/router
