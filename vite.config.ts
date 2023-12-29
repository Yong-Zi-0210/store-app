import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import path from "path";

const pathSrc = path.resolve(__dirname, "src");
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      // Auto import functions from Vue, e.g. ref, reactive, toRef...
      // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
      imports: ["vue"],
      // Auto import functions from Element Plus, e.g. ElMessage, ElMessageBox... (with style)
      // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
      resolvers: [ElementPlusResolver()],
      dts: true,
    }),
    Components({
      dirs: ["src"],
      // valid file extensions for components.
      extensions: ["vue"],
      resolvers: [
        // Auto register Element Plus components
        // 自动导入 Element Plus 组件
        ElementPlusResolver(),
      ],
      dts: true,
    }),
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), "src/icons/svg")],
      symbolId: "icon-[dir]-[name]",
    }),
  ],

  resolve: {
    alias: {
      "@": pathSrc,
    },
  },
  server: {
    /** 设置 host: true 才可以使用 Network 的形式，以 IP 访问项目 */
    host: true, // host: "0.0.0.0"
    /** 端口号 */
    port: 3334,
    /** 是否自动打开浏览器 */
    open: true,
    /** 跨域设置允许 */
    cors: true,
    /** 端口被占用时，是否直接退出 */
    strictPort: false,
    /** 接口代理 */
    proxy: {
      // 管理后台
      "/manage-server": {
        target: "http://122.51.54.57:8060",
        ws: true,
        /** 是否允许跨域 */
        changeOrigin: true,
      },
      // 经销商后台
      "/cardealer-server": {
        target: "http://122.51.54.57:8061",
        ws: true,
        /** 是否允许跨域 */
        changeOrigin: true,
      },
    },
    // /** 预热常用文件，提高初始页面加载速度 */
    // warmup: {
    //   clientFiles: ["./src/layouts/**/*.vue"],
    // },
  },
});
