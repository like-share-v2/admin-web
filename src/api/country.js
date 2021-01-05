import { axios } from '@/utils/request'

export function getCountryList (params) {
    return axios({
        url: 'country',
        method: 'get',
        params
    })
}

export function addCountry (data) {
    return axios({
        url: 'country',
        method: 'post',
        data
    })
}

export function editCountry (id, data) {
    return axios({
        url: `country/${id}`,
        method: 'put',
        data
    })
}

export function deleteCountry (ids) {
    return axios({
        url: `country/${ids}`,
        method: 'delete'
    })
}
