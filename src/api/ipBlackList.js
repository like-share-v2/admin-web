import { axios } from '@/utils/request'

export function getIpBlackList (params) {
    return axios({
        url: 'ip_black_list',
        method: 'get',
        params
    })
}

export function addIpBlackList (data) {
    return axios({
        url: 'ip_black_list',
        method: 'post',
        data
    })
}

export function editIpBlackList (id, data) {
    return axios({
        url: `ip_black_list/${id}`,
        method: 'put',
        data
    })
}

export function deleteIpBlackList (ids) {
    return axios({
        url: `ip_black_list/${ids}`,
        method: 'delete'
    })
}
