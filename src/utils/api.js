import axios from 'axios';
import {ElMessage} from "element-plus";
import router from "@/router/index.js";


// 可以根据环境变量或打包环境动态设置 baseURL
const getBaseURL = () => {
    // 开发环境
    if (process.env.NODE_ENV === 'development') {
        return 'http://localhost:8091/winxin';
        // return 'https://winxin.wangchaozhi.cn/winxin';
    }
    // 生产环境
    if (process.env.NODE_ENV === 'production') {
        return 'https://winxin.wangchaozhi.cn/winxin';
    }
    // 测试环境（可选）
    if (process.env.NODE_ENV === 'test') {
        return 'http://test-api.yourdomain.com/winxin';
    }
    // 默认值
    return 'http://localhost:8091/winxin';
};

// 创建 axios 实例
const instance = axios.create({
    baseURL: getBaseURL(), // 你的 API 基础地址
    timeout: 10000, // 请求超时时间
    headers: {
        'Content-Type': 'application/json', // 默认请求头
    },
});
const skipAuthUrls = ['/personalWebsite/login', '/public/data']; // 不需要携带 token 的接口
// 请求拦截器
instance.interceptors.request.use(
    (config) => {
        // 判断当前请求是否需要跳过 Authorization
        if (!skipAuthUrls.some(url => config.url.includes(url))) {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        // 对请求错误做些什么
        return Promise.reject(error);
    }
);
//
// // 响应拦截器
// instance.interceptors.response.use(
//     (response) => {
//         // 对响应数据做些什么
//         return response.data;
//     },
//     (error) => {
//         // 对响应错误做些什么
//         if (error.response) {
//             switch (error.response.status) {
//                 case 401:
//                     console.error('未授权，请重新登录');
//                     break;
//                 case 404:
//                     console.error('资源未找到');
//                     break;
//                 case 500:
//                     console.error('服务器错误');
//                     break;
//                 default:
//                     console.error('请求失败', error.response.status);
//             }
//         }
//         return Promise.reject(error);
//     }
// );

// Response interceptor
instance.interceptors.response.use(
    (response) => {
        switch (response.data.code) {
            case 200:
                return response.data;
            case 401:
                ElMessage.error('未授权，请重新登录');
                // 保存当前路由的路径
                localStorage.setItem('currentRoute', router.currentRoute.value.fullPath);
                router.push('/admin/login');
                break;
            case 404:
                ElMessage.error('资源未找到');
                break;
            case 500:
                ElMessage.error('服务器错误');
                break;
            default:
                // ElMessage.error(response.data.msg || '请求失败');
        }
        return response.data;
    },
    (error) => {
        ElMessage.error('网络错误，请稍后重试');
        if (error.response) {
            console.error(`HTTP 错误: ${error.response.status}`, error.response.data?.msg || 'Unknown error');
        } else {
            console.error('网络错误:', error.message);
        }
        return Promise.reject(error);
    }
);


/**
 * RESTful 风格的请求方法封装
 */
const api = {
    /**
     * GET 请求
     * @param {string} url - 请求地址
     * @param {object} params - 请求参数
     * @param config
     * @returns {Promise}
     */
    get(url, params = {}, config = {}) {
        return instance.get(url, {
            ...config,
            params, // 确保 params 仍然生效
        });
    },


    /**
     * POST 请求
     * @param {string} url - 请求地址
     * @param {object} data - 请求体数据
     * @param config
     * @returns {Promise}
     */
    post(url, data = {}, config = {}) {
        return instance.post(url, data, config); // 添加 config 参数
    },

    /**
     * PUT 请求
     * @param {string} url - 请求地址
     * @param {object} data - 请求体数据
     * @returns {Promise}
     */
    put(url, data = {}) {
        return instance.put(url, data);
    },

    /**
     * PATCH 请求
     * @param {string} url - 请求地址
     * @param {object} data - 请求体数据
     * @returns {Promise}
     */
    patch(url, data = {}) {
        return instance.patch(url, data);
    },

    /**
     * DELETE 请求
     * @param {string} url - 请求地址
     * @param {object} params - 请求参数
     * @returns {Promise}
     */
    delete(url, params = {}) {
        return instance.delete(url, { params });
    },
};

export default api;