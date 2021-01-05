import { axios } from '@/utils/request'

export function getUserWithdrawalList (params) {
    return axios({
        url: 'user_withdrawal',
        method: 'get',
        params
    })
}

export function auditUserWithdrawal (data) {
    return axios({
        url: 'user_withdrawal/audit',
        method: 'post',
        data
    })
}
