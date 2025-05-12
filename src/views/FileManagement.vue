<template>
  <div class="file-management-wrapper">
    <h2>文件管理</h2>
    <!-- 上传按钮 -->
    <div class="upload-section">
      <el-upload
          action=""
          :http-request="handleUpload"
          accept="image/jpeg,image/png,image/gif"
          :limit="1"
          :file-list="uploadFileList"
          :before-upload="beforeUpload"
      >
        <el-button type="primary" size="default">上传图片</el-button>
        <template #tip>
          <div class="upload-tip">
            仅支持 JPG、PNG、GIF 格式，文件大小不超过 5MB
          </div>
        </template>
      </el-upload>
    </div>
    <el-table
        :data="fileList"
        style="width: 100%"
        border
        stripe
        class="file-table"
    >
      <el-table-column prop="id" label="ID" width="80" align="center" />
      <el-table-column prop="path" label="文件路径" min-width="100">
        <template #default="{ row }">
          <el-tooltip :content="row.path" placement="top">
            <span class="path-text">{{ row.path }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="size" label="文件大小" width="120" align="center">
        <template #default="{ row }">
          {{ formatFileSize(row.size) }}
        </template>
      </el-table-column>
      <el-table-column prop="modifiedtime" label="修改时间" width="180" align="center" />
      <el-table-column label="操作" width="200" align="center">
        <template #default="{ row }">
          <el-button
              type="primary"
              size="small"
              @click="handleDownload(row)"
          >
            下载
          </el-button>

          <el-button
              type="danger"
              size="small"
              @click="handleDelete(row)"
          >
           删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 下载进度条对话框 -->
    <el-dialog
        v-model="downloadDialogVisible"
        title="正在下载"
        width="30%"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
    >
      <el-progress :percentage="downloadProgress" status="success" />
      <template #footer>
        <span class="dialog-footer">
          <el-button
              type="primary"
              size="small"
              :disabled="downloadProgress < 100"
              @click="downloadDialogVisible = false"
          >
            关闭
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import {ElMessage, ElMessageBox} from 'element-plus';
import api from '@/utils/api';

// 存储文件列表数据
const fileList = ref([]);
// 上传文件列表（用于 el-upload 组件）
const uploadFileList = ref([]);

// 下载进度条相关
const downloadDialogVisible = ref(false);
const downloadProgress = ref(0);


// 获取文件列表
const fetchFileList = async () => {
  try {
    const response = await api.post('/personalWebsite/fileList', {});
    if (response.code === 200) {
      fileList.value = response.data;
    }
    // else {
    //   ElMessage.error(response.msg || '获取文件列表失败');
    // }
  } catch (error) {
    console.error('Error fetching file list:', error.message, error.response);
    ElMessage.error('获取文件列表失败');
  }
};

// 格式化文件大小
const formatFileSize = (size) => {
  if (size === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let value = size;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex++;
  }
  return `${value.toFixed(2)} ${units[unitIndex]}`;
};
// 处理文件下载
const handleDownload = async (file) => {
  try {
    if (!file.id) {
      ElMessage.error('文件ID无效');
      return;
    }

    // 重置并显示进度条
    downloadProgress.value = 0;
    downloadDialogVisible.value = true;

    // 发送下载请求
    const response = await api.get('/weChat/getFile/' + file.id, {},{
      responseType: 'blob',
      timeout: 0, // 永不超时
      onDownloadProgress: (progressEvent) => {
        // 计算下载进度
        if (progressEvent.total) {
          downloadProgress.value = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        }
      }
    });

    // 判断是否是 JSON 错误
    const contentType = response.type;
    if (contentType === 'application/json') {
      // 将 blob 读取为文本
      const text = await response.text();
      const json = JSON.parse(text);
      downloadDialogVisible.value = false;
      ElMessage.error(json.msg || '下载失败');
      return;
    }

    // 创建下载链接
    const url = window.URL.createObjectURL(new Blob([response]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', file.path.split('\\').pop());
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    // 下载完成，关闭对话框
    downloadDialogVisible.value = false;
    ElMessage.success('下载已开始');
  } catch (error) {
    console.error('Error downloading file:', error.message, error.response);
    downloadDialogVisible.value = false;
    ElMessage.error('下载文件失败');
  }
};
// // 处理文件下载
// const handleDownload = async (file) => {
//   try {
//     console.log(file)
//     // 假设下载接口需要文件路径作为参数
//     const response = await api.get('/weChat/getFile/' + file.id, {},{
//       responseType: 'blob'});
//     // 判断是否是 JSON 错误
//     const contentType = response.type;
//     if (contentType === 'application/json') {
//       // 将 blob 读取为文本
//       const text = await response.text();
//       const json = JSON.parse(text);
//       ElMessage.error(json.msg || '下载失败');
//       return;
//     }
//
//     // 创建下载链接
//     const url = window.URL.createObjectURL(new Blob([response]));
//     const link = document.createElement('a');
//     link.href = url;
//     link.setAttribute('download', file.path.split('\\').pop()); // 使用文件名
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     window.URL.revokeObjectURL(url);
//     ElMessage.success('下载已开始');
//   } catch (error) {
//     console.error('Error downloading file:', error.message, error.response);
//     ElMessage.error('下载文件失败');
//   }
// };

// 上传前校验
const beforeUpload = (file) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (!allowedTypes.includes(file.type)) {
    ElMessage.error('仅支持 JPG、PNG、GIF 格式');
    return false;
  }
  if (file.size > maxSize) {
    ElMessage.error('文件大小不能超过 5MB');
    return false;
  }
  return true;
};

// 处理文件上传
const handleUpload = async (options) => {
  try {
    const formData = new FormData();
    formData.append('file', options.file);

    // const response = await api.post('/weChat/getFile', { }, {
    //   responseType: 'blob'
    // });


    const response = await api.post('/weChat/uploadFile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'

      }
    });
    if (response.code === 200) {
      ElMessage.success('图片上传成功');
      uploadFileList.value = []; // 清空上传列表
      // 等待 2 秒后再刷新文件列表
      await new Promise(resolve => setTimeout(resolve, 1000));
      await fetchFileList(); // 刷新文件列表
    } else {
      ElMessage.error(response.msg || '图片上传失败');
      uploadFileList.value = []; // 清空上传列表
    }
  } catch (error) {
    console.error('Error uploading file:', error.message, error.response);
    ElMessage.error('图片上传失败');
  }
};



const handleDelete = async (file) => {
  try {
    await ElMessageBox.confirm(
        '确认要删除该文件吗？此操作不可撤销。',
        '删除确认',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
    );

    // 用户点击了“确定”，执行删除请求
    const response = await api.post('/weChat/deleteFile', { id: file.id });
    if (response.code === 200) {
      ElMessage.success('文件删除成功');
      // 等待 2 秒后再刷新文件列表
      await new Promise(resolve => setTimeout(resolve, 1000));
      await fetchFileList(); // 删除成功后刷新列表
    } else {
      ElMessage.error(response.msg || '文件删除失败');
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Error deleting file:', error.message || error);
      ElMessage.error('文件删除失败');
    }
    // 用户取消时无需提示错误
  }
};



// 组件挂载时调用接口
onMounted(() => {
  fetchFileList();
});
</script>

<style scoped>
.file-management-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem;
  box-sizing: border-box;
  width: 100%;
}

.file-table {
  background-color: #fff;
  border-radius: 8px;
}

.path-text {
  display: inline-block;
  max-width: 280px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

h2 {
  font-size: 1.5rem;
  margin: 0 0 1rem 0;
  color: #333;
}

.upload-section {
  margin-bottom: 1rem;
}

.upload-tip {
  color: #606266;
  font-size: 12px;
  margin-top: 8px;
}
</style>