const path = require('path')
const webpack = require('webpack')

function resolve (dir) {
    return path.join(__dirname, dir)
}

module.exports = {
    lintOnSave: true, // 使用带有浏览器内编译器的完整构建版本 // https://vuejs.org/v2/guide/installation.html#Runtime-Compiler-vs-Runtime-only
    runtimeCompiler: false, // babel-loader默认会跳过`node_modules`依赖. // 通过这个选项可以显示转译一个依赖
    transpileDependencies: [
        /* string or regex */
    ], // 是否为生产环境构建生成sourceMap?

    productionSourceMap: false, // 调整内部的webpack配置. // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
    chainWebpack: (config) => {
        config.resolve.alias
            .set('@$', resolve('src'))

        // set svg-sprite-loader
        config.module
            .rule('svg')
            .exclude.add(resolve('src/icons'))
            .end()
        config.module
            .rule('icons')
            .test(/\.svg$/)
            .include.add(resolve('src/icons'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            })
            .end()

        config.plugin('provide').use(webpack.ProvidePlugin, [{
            'window.Quill': 'quill'
        }])
    },
    configureWebpack: () => {}, // CSS 相关选项
    css: {
        loaderOptions: {
            less: {
                modifyVars: {
                    // less vars，customize ant design theme

                    // 'primary-color': '#F5222D',
                    // 'link-color': '#F5222D',
                    // 'border-radius-base': '4px'
                },
                // DO NOT REMOVE THIS LINE
                javascriptEnabled: true
            }
        }
    },
    publicPath: '/web/',
    devServer: {
        port: 8088,
        open: true,
        proxy: {
            '/socket': {
                target: 'ws://192.168.3.3:9502',//后端目标接口地址
                changeOrigin: true,//是否允许跨域
                ws: true //开启ws, 如果是http代理此处可以不用设置
            },
            'sockjs-node': {
                target: 'http://localhost:8088',
                ws: false,
                changeOrigin: true
            },
        }
    }, // 第三方插件配置

    pluginOptions: {
        // ...

    },

};
