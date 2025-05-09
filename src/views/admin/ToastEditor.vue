<!-- ToastEditor.vue -->
<template>
  <div class="centered-content">
    <div ref="editorRef"></div>
    <button @click="submitRichText">提交</button>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import api from '@/utils/api'; // 引入封装好的 api.js
import '@toast-ui/editor/dist/toastui-editor.css'; // 保持样式静态导入

// 定义编辑器实例和内容
const editorRef = ref(null);
let editorInstance = null;

// 初始化编辑器（动态导入）
onMounted(async () => {
  // 动态加载 @toast-ui/editor
  const { default: Editor } = await import('@toast-ui/editor');

  // 初始化编辑器
  editorInstance = new Editor({
    el: editorRef.value,
    height: '80vh',
    initialEditType: 'markdown', // 可选: 'markdown' 或 'wysiwyg'
    previewStyle: 'vertical',   // 预览样式: 'tab' 或 'vertical'
    initialValue: '',
    toolbarItems: [
      ['heading', 'bold', 'italic', 'strike'],
      ['hr', 'quote'],
      ['ul', 'ol', 'task'],
      ['table', 'image', 'link'],
      ['code', 'codeblock'],
    ],
  });
});

// 提交富文本内容
const submitRichText = async () => {
  try {
    if (!editorInstance) {
      console.error('编辑器尚未初始化');
      return;
    }

    // 获取编辑器内容
    const markdownContent = editorInstance.getMarkdown(); // Markdown 格式
    const htmlContent = editorInstance.getHTML(); // HTML 格式
    console.log('markdownContent:', markdownContent);
    console.log('htmlContent:', htmlContent);

    // 构造请求数据
    const richTextData = {
      content: htmlContent, // 或者使用 markdownContent，取决于后端需求
      // 可以添加其他字段
      // title: '文章标题',
      // author: '作者名',
    };

    // 发送 POST 请求
    const response = await api.post('/personalWebsite/richText', richTextData);

    // 处理响应
    console.log('提交成功:', response);
    alert('富文本内容提交成功！');

  } catch (error) {
    console.error('提交失败:', error);
    alert('提交失败，请稍后重试');
  }
};


// 清理编辑器实例
onBeforeUnmount(() => {
  if (editorInstance) {
    editorInstance.destroy();
  }
});
</script>

<style scoped>
.editor-container {
  width: 80%;
  height: 100%;
  margin: 20px auto;
  padding: 20px;
}

button {
  margin-top: 10px;
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.preview {
  margin-top: 20px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.preview h3 {
  margin: 0 0 10px 0;
}
</style>