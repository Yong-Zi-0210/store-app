<template>
  <div class="goods">
    <SearchBar placeholder="请输入商品名称" @handleSearch="toSearchCar" />
    <div class="main">
      <div class="min-width main-content">
        <!-- 分类 -->
        <div class="category">
          <span class="category-title">商品分类</span>
          <el-dropdown
            v-for="(item, index) in categories"
            class="menu-item"
            trigger="click"
            :key="index"
            @command="(children: any) => handleCommand(item, children)"
          >
            <span class="el-dropdown-link">
              {{ item.categoryName }}
              <el-icon><arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="(children, childrenIndex) in item.list"
                  :key="childrenIndex"
                  :index="`${children.categoryId}`"
                  :command="children"
                >
                  {{ children.categoryName }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <!-- 品牌 -->
        <div class="branchs" v-if="branchList.length">
          <span class="branch-title">品牌</span>
          <el-checkbox-group
            class="branch-list"
            v-model="brandId"
            @change="handleCheck"
          >
            <el-checkbox
              class="branch-item"
              v-for="item in branchList"
              :key="item.goodsBrandId"
              :label="item.goodsBrandId"
            >
              <el-image
                :src="item.displayImage"
                :alt="item.name"
                fit="cover"
              ></el-image>
            </el-checkbox>
          </el-checkbox-group>
        </div>
        <!-- 条件集 -->
        <div class="filters" v-if="searchFlag">
          <div class="total-title">
            全部结果：{{ searchValue ? `"${searchValue}"` : "" }}
          </div>
          <div class="tags">
            <el-tag v-if="categoryTag.value" :key="categoryTag.value">{{
              categoryTag.label
            }}</el-tag>
            <el-tag
              v-for="(tag, index) in checkBranch"
              :key="tag.value"
              closable
              @close="deleteTag(index, tag.value)"
              type="info"
            >
              {{ tag.label }}
            </el-tag>
            <el-button
              v-if="checkBranch.length || !!searchValue || categoryTag.value"
              class="reset-btn"
              type="primary"
              size="small"
              plain
              @click="resetFilter"
              >重置</el-button
            >
          </div>
        </div>
        <GoodsResultList
          v-if="searchFlag"
          :data-list="searchList"
          v-loading="loading"
        />
        <GoodsRecList v-else />
        <div class="pagination" v-if="searchFlag">
          <el-pagination
            v-model:current-page="pageParams.currentPage"
            v-model:page-size="pageParams.pageSize"
            :page-sizes="[15, 45, 75, 105]"
            background
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref } from "vue";
import { ArrowDown } from "@element-plus/icons-vue";
import { goodsCategories, goodsBrands, goodsList } from "@/api";
import useSettingStore from "@/store/module/setting";

const loading = ref(false);
const settingStore = useSettingStore();
settingStore.setFooterBgColor("#FFFFFF");
const searchValue = ref(""); // 搜索内容
const total = ref(0);
const lastCategoryId = ref(""); // 分类最后一级
const categories = ref<any>([]); // 分类数据
const categoryTag = reactive({
  value: "",
  label: "",
});
const pageParams = reactive({
  pageSize: 15,
  currentPage: 1,
});
const brandId = ref<any>([]); // 品牌id
const checkBranch = ref<any>([]);
const branchList = ref<any>([]); // 品牌列表
const searchFlag = ref(false);
const searchList = ref();

/** 选择分类 */
const handleCommand = (parent: any, children: any) => {
  checkBranch.value = [];
  brandId.value = [];
  lastCategoryId.value = children.categoryId;
  getGoodsBrands(children.categoryId);
  categoryTag.value = `${parent.categoryId}-${children.categoryId}`;
  categoryTag.label = `${parent.categoryName}-${children.categoryName}`;
  searchFlag.value = true;
  getList();
};

/** 选择品牌 */
const handleCheck = (value: number[]) => {
  const checkValue = value.map((item: number) => {
    return {
      value: item,
      label: branchList.value.find(
        (branch: any) => branch.goodsBrandId === item
      ).name,
    };
  });
  checkBranch.value = checkValue;
  brandId.value = value;
  getList();
};

/** 删除已选条件 */
const deleteTag = (index: number, value: number) => {
  checkBranch.value.splice(index, 1);
  const brandIndex = brandId.value.indexOf(value);
  brandId.value.splice(brandIndex, 1);
  getList();
};

/** 重置筛选条件 */
const resetFilter = () => {
  checkBranch.value.length = 0;
  brandId.value.length = 0;
  lastCategoryId.value = "";
  categoryTag.value = "";
  searchValue.value = "";
  pageParams.pageSize = 15;
  getList();
};

/** 搜索 */
const toSearchCar = (value: string) => {
  searchFlag.value = true;
  searchValue.value = value;
  getList();
};

/** 获取列表数据 */
const getList = async () => {
  loading.value = true;
  try {
    const res = await goodsList({
      ...pageParams,
      condition: {
        keywords: searchValue.value,
        brandId: brandId.value,
        categoryId: lastCategoryId.value,
      },
    });
    loading.value = false;
    total.value = res.body.totalCount;
    searchList.value = res.body.pageItems;
  } catch (error) {
    loading.value = false;
  }
};

/** 获取商品分类 */
const getGoodsCategories = async () => {
  try {
    const res = await goodsCategories();
    categories.value = res.body?.categories;
  } catch (error) {}
};
getGoodsCategories();

/** 获取商品品牌 */
const getGoodsBrands = async (categoryId: string) => {
  try {
    const res = await goodsBrands({
      categoryId,
    });
    branchList.value = res.body;
  } catch (error) {}
};

/** 修改每页数量 */
const handleSizeChange = (value: number) => {
  pageParams.pageSize = value;
  getList();
};

/** 改变当前页 */
const handleCurrentChange = (value: number) => {
  pageParams.currentPage = value;
  getList();
};
</script>
<style lang="scss" scoped>
.goods {
  width: 100%;
  height: 100%;
  .main {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    margin-top: 10px;
    align-items: center;
    background-color: #fff;
    padding-bottom: 26px;
    .main-content {
      display: flex;
      flex-direction: column;
    }
    .category,
    .branchs {
      display: flex;
      align-items: center;
      .category-title,
      .branch-title {
        width: 64px;
        font-size: 16px;
        margin-right: 20px;
        flex-shrink: 0;
      }
    }
    .category {
      padding: 20px 0;
      .menu-item {
        margin-right: 20px;
        cursor: pointer;
      }
    }
    .branchs {
      justify-content: flex-start;
      .branch-list {
        display: flex;
        align-items: baseline;
        margin-right: -20px;
        .branch-item {
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 20px;
          cursor: pointer;
          :deep(.el-checkbox__label) {
            height: 100%;
          }
          :deep(.el-image) {
            height: 100%;
          }
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
    .pagination {
      display: flex;
      justify-content: center;
    }
  }
}
</style>
