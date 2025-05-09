<template>
  <div class="blog-container">
    <div class="blog-list">
      <el-card
          v-for="blog in blogList"
          :key="blog.id"
          class="blog-card"
      >
        <template #header>
          Blog Post #{{ blog.id }}
        </template>
        <div class="blog-content" v-html="blog.content"></div>
        <p class="create-time">Posted on: {{ blog.createTime }}</p>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/utils/api';

// 存储博客列表数据
const blogList = ref([]);

// 获取博客列表
const fetchBlogList = async () => {
  try {
    const response = await api.post('/personalWebsite/blogList', {});
    if (response.code === 200) {
      blogList.value = response.data;
      console.log(response.data);
    } else {
      console.error('Failed to fetch blog list:', response.msg || 'Unknown error');
    }
  } catch (error) {
    console.error('Error fetching blog list:', error.message, error.response);
  }
};

// 组件挂载时调用接口
onMounted(() => {
  fetchBlogList();
});
</script>

<style scoped>
.blog-container {
  width: 100%;
  padding: 2rem; /* Consistent padding around the entire container */
  box-sizing: border-box;
}


.blog-list {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem; /* Space between cards */
  justify-content: center; /* Align cards to the left */
  margin: 0 auto; /* Center the flex container */

}
.blog-card {
  width:25rem;
  height: 20rem;
  max-width: 30rem;
  max-height: 20rem;
  overflow: hidden;
}

.blog-content {
  max-height: 12rem;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  word-break: break-word;
}

.create-time {
  font-size: 0.75rem;
  color: #999;
  margin-top: 0.5rem;
}
</style>