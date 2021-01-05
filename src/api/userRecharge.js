import { axios } from '@/utils/request'

export function getUserRechargeList (params) {
    return axios({
        url: 'user_recharge',
        method: 'get',
        params
    })
}
