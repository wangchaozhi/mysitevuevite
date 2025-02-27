<template>
  <div class="login">
    <h1>登录</h1>

    <el-form :model="loginForm" :rules="rules" ref="loginForm" label-width="100px" class="demo-loginForm">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="loginForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="loginForm.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="loginForm.rememberMe">记住密码</el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('loginForm')">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus'; // 引入 ElMessage
import api from '@/utils/api'; // 引入封装好的 api.js

export default {
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
        rememberMe: false, // 记住密码复选框的状态
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    };
  },
  created() {
    // 页面加载时，检查是否保存了用户名和密码
    this.loadSavedCredentials();
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 调用登录接口
          this.login();
        } else {
          console.log('验证失败');
          return false;
        }
      });
    },
    async login() {
      try {
        // 使用 api.js 发送 POST 请求
        const response = await api.post('/personalWebsite/login', {
          username: this.loginForm.username,
          password: this.loginForm.password
        });

        console.log(response);

        if (response.code === 200) {
          ElMessage.success(response.msg); // 使用 ElMessage.success
          console.log('登录成功，返回的数据:', response.data);

          // 保存 token 到本地存储
          localStorage.setItem('token', response.data.token);

          // 如果用户选择了“记住密码”，则保存用户名和密码
          if (this.loginForm.rememberMe) {
            localStorage.setItem('rememberedUsername', this.loginForm.username);
            localStorage.setItem('rememberedPassword', this.loginForm.password);
          } else {
            // 如果用户没有选择“记住密码”，则清除保存的用户名和密码
            localStorage.removeItem('rememberedUsername');
            localStorage.removeItem('rememberedPassword');
          }

          // 跳转到首页或其他页面
          this.$router.push('/markDown');
        } else {
          ElMessage.error(response.msg); // 使用 ElMessage.error
        }
      } catch (error) {
        console.log(error);

        if (error.response) {
          ElMessage.error(`登录失败: ${error.response.data.msg}`);
        } else {
          ElMessage.error('登录失败，请检查网络连接');
        }
        console.error('登录失败:', error);
      }
    },
    loadSavedCredentials() {
      // 从本地存储中加载保存的用户名和密码
      const rememberedUsername = localStorage.getItem('rememberedUsername');
      const rememberedPassword = localStorage.getItem('rememberedPassword');

      if (rememberedUsername && rememberedPassword) {
        this.loginForm.username = rememberedUsername;
        this.loginForm.password = rememberedPassword;
        this.loginForm.rememberMe = true; // 自动勾选“记住密码”
      }
    }
  }
};
</script>

<style scoped>
.login {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
}
</style>