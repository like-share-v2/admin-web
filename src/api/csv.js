import { axios } from '@/utils/request'

export function userCsv (params) {
    return axios({
        url: 'csv/user',
        method: 'get',
        params
    })
}

export function bankRechargeCsv () {
    return axios({
        url: 'csv/bankRecharge',
        method: 'get'
    })
}

export function withdrawalCsv () {
    return axios({
        url: 'csv/withdrawal',
        method: 'get'
    })
}

export function get () {
    return axios({
        url: 'csv/get',
        method: 'get'
    })
}

export function onlineRechargeCsv () {
    return axios({
        url: 'csv/onlineRecharge',
        method: 'get'
    })
}
