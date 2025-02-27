import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'
import viteCompression from 'vite-plugin-compression';
import path from 'path'; // 需要引入 path 模块


// https://vite.dev/config/
export default defineConfig({
    build: {
        sourcemap: false,
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['vue', 'vue-router'], // 将常用的库单独打包成 vendor.js
                    toast: ['@toast-ui/editor'], // 将常用的库单独打包成 vendor.js

                }
            },
        }
    },
    server: {
        host: '0.0.0.0', // 监听所有网络接口
        port: 5173, // 可选，指定端口号
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'), // 将 @ 指向 src 目录
        },
    },
    plugins: [
        vue(),
        AutoImport({
            resolvers: [ElementPlusResolver()],
        }),
        Components({
            resolvers: [ElementPlusResolver()],
        }),
        viteCompression({
            // 压缩配置选项
            algorithm: 'gzip', // 使用 gzip 压缩
            deleteOriginFile: true, // 压缩后删除源文件
            threshold: 1024, // 体积大于 1KB 才压缩
        }),
        viteCompression({
            algorithm: 'brotliCompress', // 压缩算法，可选 'gzip', 'brotliCompress', 'deflate', 'deflateRaw'
            deleteOriginFile: true, // 压缩后是否删除源文件
            threshold: 1024, // 体积大于 threshold 才会被压缩，单位 b
        })
    ]
})
