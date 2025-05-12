<template>
  <el-container>
    <el-header> <!-- 设置 el-menu 为横向菜单 -->
      <el-menu mode="horizontal" :default-active="$route.path">
        <!-- 使用 el-icon 图标 -->
        <el-menu-item  index="/" @click="navigateTo('/')">
          <i class="el-icon-house"></i>首页
        </el-menu-item>
        <el-menu-item index="about"  @click="navigateTo('/about')">
          <i class="el-icon-info"></i>关于我
        </el-menu-item>
        <el-menu-item index="portfolio"  @click="navigateTo('/portfolio')">
          <i class="el-icon-s-grid"></i>作品集
        </el-menu-item>
        <el-menu-item index="blog" @click="navigateTo('/blog')">
          <i class="el-icon-edit"></i>博客
        </el-menu-item>

        <el-menu-item index="fileManagement" @click="navigateTo('/fileManagement')">
          <i class="el-icon-edit"></i>文件管理
        </el-menu-item>
<!--        <el-menu-item index="5"  @click="navigateTo('/admin/login')">-->
<!--          <i class="el-icon-edit"></i>登录-->
<!--        </el-menu-item>-->
      <el-menu-item index="6"  @click="goTo('http://vue3.wangchaozhi.cn')">
        <i class="right-align"></i>后台管理页面
      </el-menu-item>
      </el-menu>
    </el-header>
    <el-main>
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </el-main>


<!--    <el-main>-->
<!--      &lt;!&ndash; 路由页面切换过渡效果 &ndash;&gt;-->
<!--      <transition name="fade" mode="out-in">-->
<!--        <router-view></router-view>-->
<!--      </transition>-->
<!--    </el-main>-->
    <!-- Footer -->
    <el-footer>
      <div class="footer-content">
        <p>© 2025 王超智. All Rights Reserved.</p>
        <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener">湘ICP备2024092326号</a>

      </div>
    </el-footer>
  </el-container>
</template>

<script>
export default {
  methods: {
    // 跳转到指定页面
    navigateTo(path) {
      this.$router.push(path); // 使用 Vue Router 的 push 方法进行路由跳转
    },
    goTo(url) {
      window.location.href = url;
    }
  }
};
</script>

<style scoped>


.el-menu {
  width: 100%;
}



/* 整体布局调整 */
.el-container {
  min-height: 100vh; /* 确保容器至少占满整个视口 */
  display: flex;
  flex-direction: column;
}


/* Footer 样式 */
.footer-content {
  display: flex;
  flex-direction: column;
  align-items: center; /* 使内容居中 */
  justify-content: center; /* 使内容居中 */
  height: 100%; /* 确保 footer-content 占满整个 el-footer 的高度 */
}

.el-footer {
  height: 100%; /* 确保 footer-content 占满整个 el-footer 的高度 */
  display: flex;
  justify-content: center; /* 使 footer-content 居中 */
  align-items: center; /* 使 footer-content 居中 */
  text-align: center; /* 使文本居中 */
}

/* 图标样式 */
.el-icon {
  margin-right: 8px;
}

.sidebar {
  padding: 0;
}
</style>
