import { createApp } from "vue";
import router from "@/router";
import "@/router/permission";
import store from "./store";
import App from "./App.vue";
import "@/style/index.scss";
import { loadSvg } from "@/icons";
// import { loadPlugins } from "@/plugins";
const app = createApp(App);

/** 加载全局 SVG */
loadSvg(app);
// 注册插件
// loadPlugins(app);

app.use(router);
app.use(store);
app.mount("#app");
