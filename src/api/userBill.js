import { axios } from '@/utils/request'

export function getUserBillList (params) {
    return axios({
        url: 'user_bill',
        method: 'get',
        params
    })
}

export function cancel (data) {
    return axios({
        url: 'user_bill/cancel',
        method: 'post',
        data
    })
}
