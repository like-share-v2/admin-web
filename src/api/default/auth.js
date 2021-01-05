import { axios } from '@/utils/request'

export function login (data) {
    return axios({
        url: 'admin/auth/login',
        method: 'post',
        data
    })
}

export function getCode (data) {
    return axios({
        url: 'admin/auth/sendSms',
        method: 'post',
        data
    })
}
