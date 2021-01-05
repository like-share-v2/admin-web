import { axios } from '@/utils/request'

export function getMFIncomeList (params) {
    return axios({
        url: 'mf_income',
        method: 'get',
        params
    })
}
