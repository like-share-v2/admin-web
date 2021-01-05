import { axios } from '@/utils/request'

export function getUserBankRechargeList (params) {
    return axios({
        url: 'user_recharge/bank',
        method: 'get',
        params
    })
}

export function auditBankRecharge (data) {
    return axios({
        url: 'user_recharge/audit_bank',
        method: 'post',
        data
    })
}
