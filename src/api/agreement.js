import { axios } from '@/utils/request'

export function getUsageAgreement (params) {
    return axios({
        url: 'agreement/usage_agreement',
        method: 'get',
        params
    })
}

export function editUsageAgreement (data) {
    return axios({
        url: 'agreement/usage_agreement',
        method: 'put',
        data
    })
}

export function getPrivacyPolicy (params) {
    return axios({
        url: 'agreement/privacy_policy',
        method: 'get',
        params
    })
}

export function editPrivacyPolicy (data) {
    return axios({
        url: 'agreement/privacy_policy',
        method: 'put',
        data
    })
}

export function getCreditRule (params) {
    return axios({
        url: 'agreement/credit_rule',
        method: 'get',
        params
    })
}

export function editCreditRule (data) {
    return axios({
        url: 'agreement/credit_rule',
        method: 'put',
        data
    })
}

export function getHomePopUp (params) {
    return axios({
        url: 'agreement/home_pop_up',
        method: 'get',
        params
    })
}

export function editHomePopUp (data) {
    return axios({
        url: 'agreement/home_pop_up',
        method: 'put',
        data
    })
}
