import { axios } from '@/utils/request'

export function getOnlineRecharge (params) {
    return axios({
        url: 'user_online_recharge',
        method: 'get',
        params
    })
}
