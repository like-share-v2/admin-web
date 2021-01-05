import { axios } from '@/utils/request'

export function getNewsContent (params) {
    return axios({
        url: 'user_notify/content',
        method: 'get',
        params
    })
}

export function updateNewsContent (data) {
    return axios({
        url: 'user_notify/content',
        method: 'post',
        data
    })
}
