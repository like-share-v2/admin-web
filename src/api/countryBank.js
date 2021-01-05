import { axios } from '@/utils/request'

export function getCountryBankList (params) {
    return axios({
        url: 'country_bank',
        method: 'get',
        params
    })
}

export function addCountryBank (data) {
    return axios({
        url: 'country_bank',
        method: 'post',
        data
    })
}

export function editCountryBank (id, data) {
    return axios({
        url: `country_bank/${id}`,
        method: 'put',
        data
    })
}

export function deleteCountryBank (ids) {
    return axios({
        url: `country_bank/${ids}`,
        method: 'delete'
    })
}
