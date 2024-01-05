import { createApp } from "vue";
import router from "@/router";
import "@/router/permission";
import store from "./store";
import App from "./App.vue";
import "normalize.css";
import "element-plus/dist/index.css";
import "element-plus/theme-chalk/dark/css-vars.css";
import "@/styles/index.scss";
import { loadSvg } from "@/icons";
const app = createApp(App);

/** 加载全局 SVG */
loadSvg(app);

app.use(router);
app.use(store);
app.mount("#app");
