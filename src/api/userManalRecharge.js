import { axios } from '@/utils/request'

export function getUserManualRechargeList (params) {
    return axios({
        url: 'user_recharge/manual',
        method: 'get',
        params
    })
}

export function auditManualRecharge (data) {
    return axios({
        url: 'user_recharge/audit_manual',
        method: 'post',
        data
    })
}
