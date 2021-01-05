import { axios } from '@/utils/request'

export function getBankCodeList (params) {
    return axios({
        url: 'country_bank_code',
        method: 'get',
        params
    })
}

export function addBankCode (data) {
    return axios({
        url: 'country_bank_code',
        method: 'post',
        data
    })
}

export function editBankCode (id, data) {
    return axios({
        url: `country_bank_code/${id}`,
        method: 'put',
        data
    })
}

export function deleteBankCode (ids) {
    return axios({
        url: `country_bank_code/${ids}`,
        method: 'delete'
    })
}
