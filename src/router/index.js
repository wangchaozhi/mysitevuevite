import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import AboutPage from '../views/AboutPage.vue';
import PortfolioPage from "../views/PortfolioPage.vue";
import BlogPage from "../views/BlogPage.vue";
import Login from "../views/admin/Login.vue";
import ToastEditor from "@/views/admin/ToastEditor.vue";
import FileManagement from "@/views/FileManagement.vue";


const routes = [
    { path: '/', component: HomePage },
    { path: '/about', component: AboutPage },
    { path: '/portfolio', component: PortfolioPage },
    { path: '/blog', component: BlogPage }, // 添加新的路由
    { path: '/admin/login', component: Login }, // 添加新的路由
    { path: '/markDown', component: ToastEditor }, // 添加新的路由
    { path: '/fileManagement', component: FileManagement } // 添加新的路由

];

const router = createRouter({
    history: createWebHistory(),
    routes
});



export default router;
