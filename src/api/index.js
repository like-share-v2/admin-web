import { axios } from '@/utils/request'

export function getStatisticalData () {
    return axios({
        url: 'index/statistical_data',
        method: 'get'
    })
}

export function getWeekData () {
    return axios({
        url: 'index/week_data',
        method: 'get'
    })
}

export function getData () {
    return axios({
        url: 'index/data',
        method: 'get'
    })
}

export function getPieData () {
    return axios({
        url: 'index/pie_data',
        method: 'get'
    })
}

export function get (params) {
    return axios({
        url: 'index',
        method: 'get',
        params
    })
}

export function getDetail (params) {
    return axios({
        url: 'index/detail',
        method: 'get',
        params
    })
}
