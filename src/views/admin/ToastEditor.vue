<!-- ToastEditor.vue -->
<template>
  <div class="centered-content">
    <div ref="editorRef"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
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