import { axios } from '@/utils/request'

export function getNewsList (params) {
    return axios({
        url: 'user_notify',
        method: 'get',
        params
    })
}

export function createNews (data) {
    return axios({
        url: 'user_notify',
        method: 'post',
        data
    })
}

export function editNews (id, data) {
    return axios({
        url: `user_notify/${id}`,
        method: 'put',
        data
    })
}

export function deleteNews (ids) {
    return axios({
        url: `user_notify/${ids}`,
        method: 'delete'
    })
}
