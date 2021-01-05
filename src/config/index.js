export default {
    // oss地址
    staticUrl: process.env.VUE_APP_STATIC_URL
}
// 默认系统名称
export const siteTitle = ''
// 默认首页
export const indexPage = '/dashboard/workplace'
// 默认登录页
export const loginPage = '/auth/login'
// 主题风格
export const themeData = {
    headMaxWidth: false // 栏目头部是否通顶（最大宽度） 默认false
}

console.log(process.env)
