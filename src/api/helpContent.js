import { axios } from '@/utils/request'

export function getHelpContent (params) {
    return axios({
        url: 'help/content',
        method: 'get',
        params
    })
}

export function updateHelpContent (data) {
    return axios({
        url: 'help/content',
        method: 'post',
        data
    })
}
