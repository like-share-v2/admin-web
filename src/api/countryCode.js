import { axios } from '@/utils/request'

export function getCountryCodeList (params) {
    return axios({
        url: 'country_code',
        method: 'get',
        params
    })
}

export function createCountryCode (data) {
    return axios({
        url: 'country_code',
        method: 'post',
        data
    })
}

export function updateCountryCode (id, data) {
    return axios({
        url: `country_code/${id}`,
        method: 'put',
        data
    })
}

export function deleteCountryCode (ids) {
    return axios({
        url: `country_code/${ids}`,
        method: 'delete'
    })
}
