import { axios } from '@/utils/request'

export function getMFOrderList (params) {
    return axios({
        url: 'mf_order',
        method: 'get',
        params
    })
}
