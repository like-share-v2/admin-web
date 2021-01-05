import { axios } from '@/utils/request'

export function getList (params) {
    return axios({
        url: 'defray',
        method: 'get',
        params
    })
}

export function defray (data) {
    return axios({
        url: 'defray',
        method: 'post',
        data
    })
}
