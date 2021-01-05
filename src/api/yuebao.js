import { axios } from '@/utils/request'

export function getAccount (params) {
    return axios({
        url: 'yuebao/account',
        method: 'get',
        params
    })
}

export function getCoinLog (params) {
    return axios({
        url: 'yuebao/coin_log',
        method: 'get',
        params
    })
}
