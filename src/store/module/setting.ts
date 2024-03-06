import { defineStore } from "pinia";
import { ref } from "vue";
const useSettingStore = defineStore("setting", () => {
  const footerBackgroundColor = ref("#f4f4f4"); // 页面底部背景色
  const onRecruiment = ref(false); // 搜索栏开启简历按钮

  // 设置背景色
  const setFooterBgColor = (color = "#f4f4f4" as string) => {
    footerBackgroundColor.value = color;
  };

  // 设置简历按钮显隐
  const setOnRecruiment = (value: boolean) => {
    onRecruiment.value = value;
  };
  return {
    footerBackgroundColor,
    onRecruiment,
    setFooterBgColor,
    setOnRecruiment,
  };
});

export default useSettingStore;
