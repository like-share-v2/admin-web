import { axios } from '@/utils/request'

// 获取用户信息接口
export function getInfo () {
    return axios({
        url: 'admin/account/info',
        method: 'get'
    })
}

// 获取菜单接口
export function getMenu () {
    return axios({
        url: 'admin/account/menu',
        method: 'get'
    })
}

// 退出接口
export function logout () {
    return axios({
        url: 'admin/account/logout',
        method: 'post'
    })
}

// 获取选项接口
export function getOption () {
    return axios({
        url: 'admin/account/option',
        method: 'get'
    })
}

// 修改密码接口
export function changePassword (data) {
    return axios({
        url: 'admin/account/password',
        method: 'put',
        data
    })
}

// 获取wsToken
export function getWsToken () {
    return axios({
        url: 'admin/account/wstoken',
        method: 'get'
    })
}

// 获取谷歌验证二维码
export function getGoogleAuthQRCode () {
    return axios({
        url: 'admin/account/google_auth_qrcode',
        method: 'get'
    })
}

// 绑定谷歌验证
export function bindGoogleAuth (data) {
    return axios({
        url: 'admin/account/bind_google_auth',
        method: 'post',
        data
    })
}

// 开关谷歌验证
export function switchGoogleAuth () {
    return axios({
        url: 'admin/account/switch_google_auth',
        method: 'post'
    })
}
