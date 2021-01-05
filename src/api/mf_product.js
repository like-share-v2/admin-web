import { axios } from '@/utils/request'

export function getMFProductList (params) {
    return axios({
        url: 'mf_product',
        method: 'get',
        params
    })
}

export function createMFProduct (data) {
    return axios({
        url: 'mf_product',
        method: 'post',
        data
    })
}

export function updateMFProduct (id, data) {
    return axios({
        url: 'mf_product/' + id,
        method: 'put',
        data
    })
}

export function deleteMFProduct (id) {
    return axios({
        url: 'mf_product/' + id,
        method: 'delete'
    })
}
