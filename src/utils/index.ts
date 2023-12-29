import dayjs from "dayjs";
/** 用 JS 获取全局 css 变量 */
export const getCssVariableValue = (cssVariableName: string) => {
  let cssVariableValue = "";
  try {
    // 没有拿到值时，会返回空串
    cssVariableValue = getComputedStyle(
      document.documentElement
    ).getPropertyValue(cssVariableName);
  } catch (error) {
    console.error(error);
  }
  return cssVariableValue;
};

/** 获取随机串 */
export function getRandomString(length: number) {
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let randomString = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }

  return randomString;
}

/** 格式化时间 */
export const formatDateTime = (
  time: string | number | Date,
  format = "YYYY-MM-DD HH:mm:ss"
) => {
  return time ? dayjs(new Date(time)).format(format) : "N/A";
};

/** 获取时间戳 */

export const timestamp = (time: string | number | Date) => {
  return time ? dayjs(new Date(time)).unix() : "N/A";
};
