import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'; // 引入路由配置
import 'element-plus/dist/index.css'; // 引入 Element Plus 样式

const app = createApp(App);
app.use(router); // 使用路由
app.mount('#app')
