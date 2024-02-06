import { request } from "@/utils/request";
import { ApiResponseData } from "@/utils/request/types";

// 热招岗位
export function hotJob() {
  return request<ApiResponseData<any>>({
    url: "recruitment/getHotPositions",
    method: "post",
  });
}

// 热门企业
export function hotUnit() {
  return request<ApiResponseData<any>>({
    url: "recruitment/getHotCompanies",
    method: "post",
  });
}

// 搜索职位
export function searchList(data: object) {
  return request<ApiResponseData<any>>({
    url: "/recruitment/getRecruitments",
    method: "post",
    data,
  });
}

// 职位详情
export function jobDetail(data: object) {
  return request<ApiResponseData<any>>({
    url: "recruitment/getRecruitmentPositionDetail",
    method: "post",
    data,
  });
}

// 公司详情
export function companyDetail(data: object) {
  return request<ApiResponseData<any>>({
    url: "recruitment/getRecruitmentCompanyDetail",
    method: "post",
    data,
  });
}

// 根据公司id获取职位
export function getJobById(data: object) {
  return request<ApiResponseData<any>>({
    url: "recruitment/getRecruitmentPositions",
    method: "post",
    data,
  });
}

// 招聘记录点
export function clickRecord(data: object) {
  return request<ApiResponseData<any>>({
    url: "recruitment/operate/recruitmentClickRecord",
    method: "post",
    data,
  });
}
