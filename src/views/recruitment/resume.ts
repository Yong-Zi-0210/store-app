import { reactive, ref } from "vue";
import { FormRules } from "element-plus";
import {
  BaseForm,
  PositionForm,
  WorkExperiences,
  EduExperiences,
  ProjectExperiences,
} from "./type";
// 个人信息
export const baseForm: BaseForm = reactive({
  name: "", // 姓名
  jobStatus: "", // 在职状态
  phone: "", // 电话
  email: "", // 邮箱
  gender: "", // 性别
  birthDate: "", // 出生年月
  startWorkDate: "", // 开始工作时间
});

// 期望职位信息
export const positionForm: PositionForm = reactive({
  expectedPosition: "", // 期望职位
  salary: "", // 期望薪资
  expectedIndustry: "", // 期望行业
  workCity: "", // 工作城市
});

export const workExperiences = ref<WorkExperiences[]>([]); // 工作经历
export const projectExperiences = ref<ProjectExperiences[]>([]); // 项目经历
export const eduExperiences = ref<EduExperiences[]>([]); // 教育经历
export const addFormType = {
  work: {
    companyName: "", // 公司
    industry: "", // 所属行业
    dept: "", // 公司部门名称
    positionName: "", // 职位名称
    officeTime: "", // 在职时间
    workContent: "", // 工作内容
    workPerformance: "", // 工作业绩
    skills: "", // 技能
  },
  project: {
    projectName: "", // 项目名称
    projectRole: "", // 角色
    projectLink: "", // 项目链接
    projectTime: "", // 项目时间
    projectContent: "", // 项目内容
    projectPerformance: "", // 项目业绩
  },
  edu: {
    schoolName: "", // 学校名称
    eduQualifications: "", // 学历
    major: "", // 专业
    schoolTime: "", // 在校时间
    schoolExperience: "", // 在校经历
  },
};

// 个人信息
export const baseRules = reactive<FormRules>({
  name: [{ required: true, trigger: "change", message: "请输入姓名" }],
  jobStatus: [{ required: true, trigger: "change", message: "请选择在职状态" }],
  phone: [
    { required: true, trigger: "change", message: "请输入手机号码" },
    {
      pattern: /^1[3456789]\d{9}$/,
      message: "请输入正确的手机号",
      trigger: "blur",
    },
  ],
  email: [{ required: true, trigger: "change", message: "请输入邮箱" }],
  gender: [{ required: true, trigger: "change", message: "请选择性别" }],
  birthDate: [{ required: true, trigger: "change", message: "请输入出生日期" }],
  startWorkDate: [
    { required: true, trigger: "change", message: "请输入开始工作日期" },
  ],
});

// 期望职位
export const positionRules = reactive<FormRules>({
  expectedPosition: [
    { required: true, trigger: "change", message: "请输入职位" },
  ],
  expectedIndustry: [
    { required: true, trigger: "change", message: "请输入期望行业" },
  ],
  salary: [{ required: true, trigger: "change", message: "请输入期望薪资" }],
  workCity: [{ required: true, trigger: "change", message: "请输入工作城市" }],
});

// 工作经历
export const workExperiencesRules = reactive<FormRules>({
  companyName: [
    { required: true, trigger: "change", message: "请输入公司名称" },
  ],
  industry: [{ required: true, trigger: "change", message: "请输入所属行业" }],
  dept: [{ required: true, trigger: "change", message: "请输入公司部门名称" }],
  positionName: [
    { required: true, trigger: "change", message: "请输入职位名称" },
  ],
  officeTime: [
    { required: true, trigger: "change", message: "请输入在职时间" },
  ],
  workContent: [
    { required: true, trigger: "change", message: "请输入工作内容" },
  ],
  workPerformance: [
    { required: true, trigger: "change", message: "请输入工作业绩" },
  ],
});

// 项目经历
export const projectExperiencesRules = reactive<FormRules>({
  projectName: [
    { required: true, trigger: "change", message: "请输入项目名称" },
  ], // 项目名称
  projectRole: [{ required: true, trigger: "change", message: "请输入角色" }], // 角色
  projectTime: [
    { required: true, trigger: "change", message: "请输入项目时间" },
  ], // 项目时间
  projectContent: [
    { required: true, trigger: "change", message: "请输入项目内容" },
  ], // 项目内容
  projectPerformance: [
    { required: true, trigger: "change", message: "请输入项目业绩" },
  ], // 项目业绩
});

// 根据类型获取经历
export const getExperiences = (type: string) => {
  switch (type) {
    case "work": {
      return workExperiences;
    }
    case "project": {
      return projectExperiences;
    }
    case "edu": {
      return eduExperiences;
    }
  }
};

// 根据不同类型创建经历数据
export const getFormData = (type: string) => {
  type keyType = "work" | "project" | "edu";
  console.log(addFormType[type as keyType]);
  // 保证每次创建的都是新的对象
  return JSON.parse(JSON.stringify(addFormType[type as keyType]));
};
