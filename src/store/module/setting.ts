import { defineStore } from "pinia";
import { ref } from "vue";
const useSettingStore = defineStore("setting", () => {
  const footerBackgroundColor = ref("#f4f4f4");

  const setFooterBgColor = (color = "#f4f4f4" as string) => {
    footerBackgroundColor.value = color;
  };
  return { footerBackgroundColor, setFooterBgColor };
});

export default useSettingStore;
