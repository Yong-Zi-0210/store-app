export interface BaseForm {
  name: string; // 姓名
  jobStatus: string; // 在职状态
  phone: string; // 电话
  email: string; // 邮箱
  gender: string; // 性别
  birthDate: string; // 出生年月
  startWorkDate: string; // 开始工作时间
}

export interface PositionForm {
  expectedPosition: string; // 期望职位
  salary: string; // 期望薪资
  expectedIndustry: string; // 期望行业
  workCity: string; // 工作城市
}

export interface WorkExperiences {
  companyName: string; // 公司
  industry: string; // 所属行业
  dept: string; // 公司部门名称
  positionName: string; // 职位名称
  officeTime: string; // 在职时间
  workContent: string; // 工作内容
  workPerformance: string; // 工作业绩
  skills: string; // 技能
}

export interface ProjectExperiences {
  projectName: string; // 项目名称
  projectRole: string; // 角色
  projectLink: string; // 项目链接
  projectTime: string; // 项目时间
  projectContent: string; // 项目内容
  projectPerformance: string; // 项目业绩
}

export interface EduExperiences {
  schoolName: string; // 学校名称
  eduQualifications: string; // 学历
  major: string; // 专业
  schoolTime: string; // 在校时间
  schoolExperience: string; // 在校经历
}
