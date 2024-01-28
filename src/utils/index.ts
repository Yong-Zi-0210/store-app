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

/** 设置公里显示格式 */
export const setMileage = (mileage: number) => {
  if (mileage.toString().length <= 3) {
    return `${mileage}公里`;
  } else if (mileage.toString().length > 2) {
    const newMileage = (mileage / 10000).toFixed(2);
    return `${newMileage}万公里`;
  }
};

/** 设置价格显示格式 */
export const setPrice = (price: number) => {
  if (price.toString().length <= 3) {
    return price;
  } else if (price.toString().length > 2) {
    const newPrice = (price / 10000).toFixed(2);
    return `${newPrice}万`;
  }
};

export function compareArrays(arr1: string[], arr2: string[]) {
  if (arr1.length !== arr2.length) {
    return false;
  }
  return arr2.every((item) => arr1.indexOf(item) !== -1);
}
