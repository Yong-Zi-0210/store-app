<script setup lang="ts">
import { ref, computed, nextTick, reactive } from "vue";
import { createResume, modifyResume } from "@/api";
import { ElMessage, FormInstance, ElMessageBox, ElInput } from "element-plus";
import { Delete, Edit, Plus } from "@element-plus/icons-vue";
import useUserStore from "@/store/module/user";
import { formatDateTime } from "@/utils";
import {
  baseForm,
  positionForm,
  workExperiences,
  projectExperiences,
  eduExperiences,
  getFormData,
  baseRules,
  positionRules,
  workExperiencesRules,
  projectExperiencesRules,
} from "../resume";
import { BaseForm, PositionForm } from "../type";

interface Props {
  modelValue: boolean;
  edit?: boolean;
}

const baseFormRef = ref<FormInstance>(); // 个人信息
const positionFormRef = ref<FormInstance>(); // 期望职位
const submitWorkExperiences = ref<any>([]); // 工作经历提交的数据-通过校验
const submitProjectExperiences = ref<any>([]); // 项目经历提交的数据-通过校验
const submiteEduExperiences = ref<any>([]); // 教育经历提交的数据-通过校验
const certificateTags = ref<string[]>([]);
const inputValue = ref("");
const inputVisible = ref(false);
const InputRef = ref<InstanceType<typeof ElInput>>();
const workRefs = [] as any; // 工作经历表单ref
const projectRefs = [] as any; // 项目经历表单ref
const eduRefs = [] as any; // 教育经历表单ref
const currentEditObj = reactive({
  index: 0,
  type: "work",
  edit: false,
});
enum RefsType {
  "work" = workRefs,
  "project" = projectRefs,
  "edu" = eduRefs,
}
enum SubmitType {
  "work" = submitWorkExperiences as any,
  "project" = submitProjectExperiences as any,
  "edu" = submiteEduExperiences as any,
}
enum FormTpye {
  "work" = workExperiences as any,
  "project" = projectExperiences as any,
  "edu" = eduExperiences as any,
}
const emit = defineEmits(["update:modelValue", "refresh"]);
const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  edit: false,
});

const statusOptions = [
  { value: "0", label: "离职" },
  { value: "1", label: "在职" },
];
const operType = computed(() => (!props.edit ? "add" : "edit"));
const title = computed(() => (props.edit ? "修改" : "新增"));
const userStore = useUserStore();
/** 打开 */
const open = () => {
  nextTick(() => {
    baseFormRef.value?.resetFields();
    positionFormRef.value?.resetFields();
    currentEditObj.edit = false;
    if (props.edit) {
      initFormFields(userStore.resume);
    } else {
      workExperiences.value.length = 0;
      projectExperiences.value.length = 0;
      eduExperiences.value.length = 0;
      submitWorkExperiences.value.length = 0;
      submitProjectExperiences.value.length = 0;
      submiteEduExperiences.value.length = 0;
      certificateTags.value.length = 0;
      workRefs.length = 0;
      projectRefs.length = 0;
      eduRefs.length = 0;
    }
  });
};
/** 关闭 */
const close = () => {
  emit("update:modelValue", false);
};

/** 新增经历 */
const handleAddForm = (type: any) => {
  // 当前存在未保存项
  if (currentEditObj.edit) {
    ElMessageBox.confirm(
      "退出编辑后，更新的内容不会自动保存",
      "有内容没有保存，确定退出编辑吗?",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }
    )
      .then(() => {
        // 和取消的逻辑一致
        if (
          !(SubmitType[currentEditObj.type as any] as any).value[
            currentEditObj.index
          ]
        ) {
          (
            RefsType[currentEditObj.type as any][currentEditObj.index] as any
          ).splice(currentEditObj.index, 1);
          (FormTpye[currentEditObj.type as any] as any).value.splice(
            currentEditObj.index,
            1
          );
        } else {
          (
            RefsType[currentEditObj.type as any][currentEditObj.index] as any
          ).edit.value = false;
        }

        // 添加
        (RefsType[type] as any).push({
          edit: ref(true),
          ref: ref<FormInstance>(),
        });
        (FormTpye[type] as any).value.push(getFormData(type));
        currentEditObj.edit = true;
        currentEditObj.type = type;
        currentEditObj.index = (FormTpye[type] as any).value.length - 1;
      })
      .catch(() => {});
  } else {
    // 无未保存项直接添加
    (RefsType[type] as any).push({
      edit: ref(true),
      ref: ref<FormInstance>(),
    });
    (FormTpye[type] as any).value.push(getFormData(type));
    currentEditObj.edit = true;
    currentEditObj.type = type;
    currentEditObj.index = (FormTpye[type] as any).value.length - 1;
  }
};

// 处理回显数据
const initFormFields = (detail: any) => {
  for (const key in detail) {
    // 个人信息
    if (Object.prototype.hasOwnProperty.call(baseForm, key)) {
      type baseKey = keyof BaseForm;
      baseForm[key as baseKey] = detail[key];
    }
    // 期望职位
    if (Object.prototype.hasOwnProperty.call(positionForm, key)) {
      type Key = keyof PositionForm;
      positionForm[key as Key] = detail[key];
    }
    // 工作经历
    workExperiences.value = detail.workExperiences || [];
    submitWorkExperiences.value = detail.workExperiences || [];
    // 项目经历
    projectExperiences.value = detail.projectExperiences || [];
    submitProjectExperiences.value = detail.projectExperiences || [];
    // 教育经历
    eduExperiences.value = detail.eduExperiences || [];
    submiteEduExperiences.value = detail.eduExperiences || [];
    // 证书
    certificateTags.value = detail.certificate.length
      ? detail.certificate?.split(",")
      : [];

    if (workExperiences.value.length) {
      initRefs(workExperiences.value, "work");
    }
    if (projectExperiences.value.length) {
      initRefs(projectExperiences.value, "project");
    }
    if (eduExperiences.value.length) {
      initRefs(eduExperiences.value, "edu");
    }
  }
};

// 初始化ref
const initRefs = (list: any, type: any) => {
  (RefsType[type] as any).length = 0;
  list.forEach(() => {
    (RefsType[type] as any).push({
      edit: ref(false),
      ref: ref<FormInstance>(),
    });
  });
};

/** 取消 */
const cancel = (type: any, index: number) => {
  if (!(SubmitType[type as any] as any).value[index]) {
    (RefsType[type] as any).splice(index, 1);
    (FormTpye[type] as any).value.splice(index, 1);
  } else {
    (RefsType[type][index] as any).edit.value = false;
  }
  currentEditObj.type = type;
  currentEditObj.index = index;
  currentEditObj.edit = false;
};

/** 保存 */
const save = (type: any, index: number) => {
  (RefsType[type as any][index] as any).ref.value[0]?.validate(
    async (val: any) => {
      if (val) {
        // 调用接口
        await modifyResume({
          id: userStore.resume.id,
          ...baseForm,
          ...positionForm,
          workExperiences: [...submitWorkExperiences.value],
          projectExperiences: [...submitProjectExperiences.value],
          eduExperiences: [...submiteEduExperiences.value],
          certificate: certificateTags.value?.join(","),
        });
        if (!(SubmitType[type as any] as any).value[index]) {
          (SubmitType[type as any] as any).value.push(
            (FormTpye[type as any] as any).value[index]
          );
        }
        (RefsType[type as any][index] as any).edit.value = false;
        currentEditObj.type = type;
        currentEditObj.index = index;
        currentEditObj.edit = false;
      } else {
        console.error("检验不通过");
      }
    }
  );
};

/** 单项编辑 */
const handleEdit = (type: any, index: number) => {
  if (currentEditObj.edit) {
    ElMessageBox.confirm(
      "退出编辑后，更新的内容不会自动保存",
      "有内容没有保存，确定退出编辑吗?",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }
    )
      .then(() => {
        // 和取消逻辑一样
        if (
          !(SubmitType[currentEditObj.type as any] as any).value[
            currentEditObj.index
          ]
        ) {
          (
            RefsType[currentEditObj.type as any][currentEditObj.index] as any
          ).splice(currentEditObj.index, 1);
          (FormTpye[currentEditObj.type as any] as any).value.splice(
            currentEditObj.index,
            1
          );
        } else {
          (
            RefsType[currentEditObj.type as any][currentEditObj.index] as any
          ).edit.value = false;
        }

        // 编辑
        (RefsType[type][index] as any).edit.value = true;
        currentEditObj.index = index;
        currentEditObj.edit = true;
        currentEditObj.type = type;
      })
      .catch(() => {});
  } else {
    (RefsType[type][index] as any).edit.value = true;
    currentEditObj.index = index;
    currentEditObj.edit = true;
    currentEditObj.type = type;
  }
};

// 删除证书
const handleClose = (tag: string) => {
  certificateTags.value.splice(certificateTags.value.indexOf(tag), 1);
};
const showInput = () => {
  inputVisible.value = true;
  nextTick(() => {
    InputRef.value!.input!.focus();
  });
};
const handleInputConfirm = () => {
  if (inputValue.value) {
    certificateTags.value.push(inputValue.value);
  }
  inputVisible.value = false;
  inputValue.value = "";
};

/** 删除 */
const handleDelete = (type: any, index: number) => {
  (RefsType[type] as any).splice(index, 1);
  (SubmitType[type as any] as any).value.splice(index, 1);
  (FormTpye[type] as any).value.splice(index, 1);
  currentEditObj.type = type;
  currentEditObj.index = index;
  currentEditObj.edit = false;
};

// 新增简历
const add = async (data: object) => {
  await createResume(data);
  ElMessage.success("新增成功");
};

// 编辑简历
const edit = async (data: object) => {
  await modifyResume(data);
  ElMessage.success("修改成功");
};

/** 确认 */
const confirm = async () => {
  // 个人信息
  const base = await baseFormRef.value?.validate((validate) => {
    if (validate) {
      return true;
    } else {
      return Promise.reject("base校验不通过");
    }
  });

  // 期望职位
  const position = await positionFormRef.value?.validate((validate) => {
    if (validate) {
      return true;
    } else {
      return Promise.reject("base校验不通过");
    }
  });
  if (base && position) {
    operType.value === "add"
      ? await add({
          ...baseForm,
          ...positionForm,
          workExperiences: [...submitWorkExperiences.value],
          projectExperiences: [...submitProjectExperiences.value],
          eduExperiences: [...submiteEduExperiences.value],
          certificate: certificateTags.value?.join(","),
        })
      : await edit({
          id: userStore.resume.id,
          ...baseForm,
          ...positionForm,
          workExperiences: [...submitWorkExperiences.value],
          projectExperiences: [...submitProjectExperiences.value],
          eduExperiences: [...submiteEduExperiences.value],
          certificate: certificateTags.value?.join(","),
        });
    userStore.updateResume();
    emit("update:modelValue", false);
  }
};
</script>

<template>
  <el-dialog
    :model-value="props.modelValue"
    :close-on-click-modal="false"
    :title="title"
    @open="open"
    @close="close"
    width="80%"
  >
    <template #default>
      <!-- 个人信息 -->
      <div class="base-form form-item">
        <div class="title">个人信息</div>
        <el-form :model="baseForm" :rules="baseRules" ref="baseFormRef">
          <el-row :gutter="24">
            <el-col :span="6">
              <el-form-item label="姓名" prop="name">
                <el-input v-model="baseForm.name" placeholder="姓名"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="在职状态" prop="jobStatus">
                <el-select v-model="baseForm.jobStatus">
                  <el-option
                    v-for="(item, index) in statusOptions"
                    :key="index"
                    :value="item.value"
                    :label="item.label"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="手机号码" prop="phone">
                <el-input
                  v-model="baseForm.phone"
                  placeholder="手机号码"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="邮箱" prop="email">
                <el-input
                  v-model="baseForm.email"
                  placeholder="邮箱"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="6">
              <el-form-item label="性别" prop="gender">
                <el-select v-model="baseForm.gender">
                  <el-option value="1" label="男"></el-option>
                  <el-option value="0" label="女"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="出生年月" prop="birthDate">
                <el-date-picker
                  v-model="baseForm.birthDate"
                  type="date"
                  value-format="x"
                  placeholder="日期时间"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="开始工作时间" prop="startWorkDate">
                <el-date-picker
                  v-model="baseForm.startWorkDate"
                  type="date"
                  value-format="x"
                  placeholder="日期时间"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <!-- 期望职位 -->
      <div class="position-form form-item">
        <div class="title">期望职位</div>
        <el-form
          :model="positionForm"
          :rules="positionRules"
          ref="positionFormRef"
        >
          <el-row :gutter="24">
            <el-col :span="6">
              <el-form-item label="期望职位" prop="expectedPosition">
                <el-input
                  v-model="positionForm.expectedPosition"
                  placeholder="期望职位"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="期望薪资" prop="salary">
                <el-input
                  v-model="positionForm.salary"
                  placeholder="期望薪资"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="期望行业" prop="expectedIndustry">
                <el-input
                  v-model="positionForm.expectedIndustry"
                  placeholder="期望行业"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="工作城市" prop="workCity">
                <el-input
                  v-model="positionForm.workCity"
                  placeholder="工作城市"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <!-- 工作经历 -->
      <div class="add-form-item form-item">
        <div class="title">
          工作经历
          <div class="add-icon" @click="handleAddForm('work')">
            <el-icon class="icon-plus"><Plus /></el-icon>
            <span>添加</span>
          </div>
        </div>
        <div class="show-form-item" v-for="(item, index) in workExperiences">
          <!-- 展示工作经历 -->
          <div class="form-item-info" v-if="!workRefs[index]?.edit.value">
            <template v-if="submitWorkExperiences.length">
              <div class="info-title">
                <span class="name">
                  <span class="company-name">{{
                    submitWorkExperiences[index].companyName
                  }}</span>
                  <span class="position-name">{{
                    submitWorkExperiences[index].positionName
                  }}</span>
                </span>
                <span class="edit-btn">
                  <el-button
                    @click="handleEdit('work', index)"
                    :icon="Edit"
                    size="small"
                    type="warning"
                    circle
                  ></el-button>
                  <el-button
                    @click="handleDelete('work', index)"
                    :icon="Delete"
                    size="small"
                    type="danger"
                    circle
                  ></el-button>
                </span>
              </div>
              <div class="content">
                <label class="content-label">内容：</label>
                <span class="content-text">
                  {{ submitWorkExperiences[index].workContent }}
                </span>
              </div>
            </template>
          </div>
          <!-- 编辑工作经历 -->
          <el-form
            v-else
            :model="item"
            :rules="workExperiencesRules"
            :ref="workRefs[index] && workRefs[index].ref"
          >
            <el-row :gutter="24">
              <el-col :span="6">
                <el-form-item label="公司名称" prop="companyName">
                  <el-input
                    v-model="item.companyName"
                    placeholder="公司名称"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="所属行业" prop="industry">
                  <el-input
                    v-model="item.industry"
                    placeholder="所属行业"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="公司部门名称" prop="dept">
                  <el-input
                    v-model="item.dept"
                    placeholder="公司部门名称"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="职位名称" prop="positionName">
                  <el-input
                    v-model="item.positionName"
                    placeholder="职位名称"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="在职时间" prop="officeTime">
                  <el-date-picker
                    v-model="item.officeTime"
                    type="daterange"
                    range-separator="-"
                    value-format="x"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="24">
                <el-form-item label="工作内容" prop="workContent">
                  <el-input
                    v-model="item.workContent"
                    type="textarea"
                    placeholder="工作内容"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="24">
                <el-form-item label="工作业绩" prop="workPerformance">
                  <el-input
                    v-model="item.workPerformance"
                    type="textarea"
                    placeholder="工作业绩"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="24">
                <el-form-item label="拥有技能" prop="skills" label-width="77px">
                  <el-input
                    v-model="item.skills"
                    type="textarea"
                    placeholder="技能"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="submit">
              <el-button @click="cancel('work', index)">取消</el-button>
              <el-button type="primary" @click="save('work', index)"
                >保存</el-button
              >
            </el-row>
          </el-form>
        </div>
      </div>

      <!-- 项目经历-->
      <div class="add-form-item form-item">
        <div class="title">
          项目经历
          <div class="add-icon" @click="handleAddForm('project')">
            <el-icon class="icon-plus"><Plus /></el-icon>
            <span>添加</span>
          </div>
        </div>
        <div class="show-form-item" v-for="(item, index) in projectExperiences">
          <!-- 展示项目经历 -->
          <div class="form-item-info" v-if="!projectRefs[index]?.edit.value">
            <template v-if="submitProjectExperiences.length">
              <div class="info-title">
                <span class="name">
                  <span class="project-name">{{
                    submitProjectExperiences[index].projectName
                  }}</span>
                  <span class="project-role">{{
                    submitProjectExperiences[index].projectRole
                  }}</span>
                </span>
                <span class="edit-btn">
                  <el-button
                    @click="handleEdit('project', index)"
                    :icon="Edit"
                    size="small"
                    type="warning"
                    circle
                  ></el-button>
                  <el-button
                    @click="handleDelete('project', index)"
                    :icon="Delete"
                    size="small"
                    type="danger"
                    circle
                  ></el-button>
                </span>
              </div>
              <div class="content">
                <label class="content-label">内容：</label>
                <span class="content-text">
                  {{ submitProjectExperiences[index].projectContent }}
                </span>
              </div>
            </template>
          </div>
          <!-- 编辑项目经历 -->
          <el-form
            v-else
            :model="item"
            :rules="projectExperiencesRules"
            :ref="projectRefs[index] && projectRefs[index].ref"
          >
            <el-row :gutter="24">
              <el-col :span="6">
                <el-form-item label="项目名称" prop="projectName">
                  <el-input
                    v-model="item.projectName"
                    placeholder="项目名称"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="项目角色" prop="projectRole">
                  <el-input
                    v-model="item.projectRole"
                    placeholder="项目角色"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="项目时间" prop="projectTime">
                  <el-date-picker
                    v-model="item.projectTime"
                    type="daterange"
                    range-separator="-"
                    value-format="x"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="24">
                <el-form-item label="项目内容" prop="projectContent">
                  <el-input
                    v-model="item.projectContent"
                    type="textarea"
                    placeholder="项目内容"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="24">
                <el-form-item label="项目业绩" prop="projectPerformance">
                  <el-input
                    v-model="item.projectPerformance"
                    type="textarea"
                    placeholder="项目业绩"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="24">
                <el-form-item
                  label="项目链接"
                  prop="projectLink"
                  label-width="77px"
                >
                  <el-input
                    v-model="item.projectLink"
                    placeholder="项目链接"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="submit">
              <el-button @click="cancel('project', index)">取消</el-button>
              <el-button type="primary" @click="save('project', index)"
                >保存</el-button
              >
            </el-row>
          </el-form>
        </div>
      </div>

      <!-- 教育经历 -->
      <div class="add-form-item form-item">
        <div class="title">
          教育经历
          <div class="add-icon" @click="handleAddForm('edu')">
            <el-icon class="icon-plus"><Plus /></el-icon>
            <span>添加</span>
          </div>
        </div>
        <div class="show-form-item" v-for="(item, index) in eduExperiences">
          <!-- 展示教育经历 -->
          <div class="form-item-info" v-if="!eduRefs[index]?.edit.value">
            <template v-if="submiteEduExperiences.length">
              <div class="info-title">
                <span class="name">
                  <span class="school-name">{{
                    submiteEduExperiences[index].schoolName
                  }}</span>
                  <span class="school-time">{{
                    formatDateTime(
                      submiteEduExperiences[index].schoolTime[0],
                      "YYYY"
                    ) +
                    " - " +
                    formatDateTime(
                      submiteEduExperiences[index].schoolTime[1],
                      "YYYY"
                    )
                  }}</span>
                </span>
                <span class="edit-btn">
                  <el-button
                    @click="handleEdit('edu', index)"
                    :icon="Edit"
                    size="small"
                    type="warning"
                    circle
                  ></el-button>
                  <el-button
                    @click="handleDelete('edu', index)"
                    :icon="Delete"
                    size="small"
                    type="danger"
                    circle
                  ></el-button>
                </span>
              </div>
              <ul class="content school-attr">
                <li class="major">{{ submiteEduExperiences[index].major }}</li>
                <li class="edu-qualifications">
                  {{ submiteEduExperiences[index].eduQualifications }}
                </li>
              </ul>
            </template>
          </div>
          <!-- 编辑项目经历 -->
          <el-form
            v-else
            :model="item"
            :rules="{}"
            :ref="eduRefs[index] && eduRefs[index].ref"
          >
            <el-row :gutter="24">
              <el-col :span="6">
                <el-form-item label="学校名称" prop="schoolName">
                  <el-input
                    v-model="item.schoolName"
                    placeholder="学校名称"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="学历" prop="eduQualifications">
                  <el-input
                    v-model="item.eduQualifications"
                    placeholder="学历"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="专业" prop="major">
                  <el-input v-model="item.major" placeholder="专业"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="在校时间" prop="schoolTime">
                  <el-date-picker
                    v-model="item.schoolTime"
                    type="daterange"
                    range-separator="-"
                    value-format="x"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="24">
                <el-form-item label="在校经历" prop="schoolExperience">
                  <el-input
                    v-model="item.schoolExperience"
                    type="textarea"
                    placeholder="在校经历"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="submit">
              <el-button @click="cancel('edu', index)">取消</el-button>
              <el-button type="primary" @click="save('edu', index)"
                >保存</el-button
              >
            </el-row>
          </el-form>
        </div>
      </div>

      <!-- 证书 -->
      <div class="form-item">
        <div class="title">资格证书</div>
        <el-tag
          v-for="tag in certificateTags"
          :key="tag"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)"
        >
          {{ tag }}
        </el-tag>
        <el-input
          v-if="inputVisible"
          ref="InputRef"
          v-model="inputValue"
          style="width: 200px; margin-left: 10px"
          size="small"
          @keyup.enter="handleInputConfirm"
          @blur="handleInputConfirm"
        />
        <el-button
          v-else
          class="button-new-tag"
          size="small"
          @click="showInput"
        >
          新增证书
        </el-button>
      </div>
    </template>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="confirm"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<style scoped lang="scss">
.form-item {
  padding: 12px 0;
  .title {
    position: relative;
    padding-left: 14px;
    font-size: 20px;
    height: 27px;
    line-height: 27px;
    font-weight: 500;
    margin-bottom: 12px;
    &::before {
      content: "";
      position: absolute;
      width: 4px;
      height: 17px;
      background: #e20755;
      border-radius: 3px;
      left: 0;
      top: 5px;
    }
  }
  .button-new-tag {
    margin-left: 10px;
  }
  .submit {
    justify-content: flex-end;
  }
  &.add-form-item {
    &:hover {
      .add-icon {
        display: flex;
      }
    }
    .add-icon {
      position: absolute;
      right: 0;
      top: 0;
      align-items: center;
      cursor: pointer;
      display: none;
      .icon-plus {
        margin-right: 5px;
        padding: 2px;
        border-radius: 3px;
        font-size: 13px;
        font-weight: 400;
        background: #e20755;
        color: #fff;
      }
      span {
        font-size: 13px;
        color: #e20755;
      }
    }
  }
  .show-form-item {
    margin-top: 24px;
    .form-item-info {
      padding: 8px 16px;
      position: relative;
      min-height: 40px;
      border-radius: 8px;
      .edit-btn {
        display: none;
      }
      .info-title {
        display: flex;
        justify-content: space-between;
        height: 24px;
        line-height: 24px;
        .name {
          font-size: 16px;
          font-weight: 500;
          color: #222;
          span:first-of-type {
            margin-right: 20px;
          }
          .school-time {
            display: inline-block;
            font-size: 14px;
            color: #999;
            line-height: 20px;
            align-self: start;
          }
        }
      }
      .school-attr {
        display: block;
        overflow: hidden;
        margin-top: 8px;
        li {
          max-width: 250px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          position: relative;
          float: left;
          padding: 0 8px;
          line-height: 20px;
          font-size: 14px;
          margin: 0;
          min-height: auto;
          color: #222;
          &:first-of-type {
            padding-left: 0;
          }
        }
      }
      &:hover {
        background: #f8f8f8;
        cursor: pointer;
        .edit-btn {
          display: block;
        }
      }
    }
  }
}
</style>
