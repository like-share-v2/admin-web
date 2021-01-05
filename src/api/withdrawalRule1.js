import { axios } from '@/utils/request'

export function getWithdrawalRule1List (params) {
    return axios({
        url: 'withdrawal_rule1',
        method: 'get',
        params
    })
}
export function createWithdrawalRule1List (data) {
    return axios({
        url: 'withdrawal_rule1',
        method: 'post',
        data
    })
}

export function updateWithdrawalRule1List (id, data) {
    return axios({
        url: 'withdrawal_rule1/' + id,
        method: 'put',
        data
    })
}

export function deleteWithdrawalRule1List (id) {
    return axios({
        url: 'withdrawal_rule1/' + id,
        method: 'delete'
    })
}
