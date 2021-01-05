import { axios } from '@/utils/request'

export function getUserCreditList (params) {
    return axios({
        url: 'user_credit',
        method: 'get',
        params
    })
}
