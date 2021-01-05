import { axios } from '@/utils/request'

export function getHelpQuestions (params) {
    return axios({
        url: 'help',
        method: 'get',
        params
    })
}

export function createHelpQuestion (data) {
    return axios({
        url: 'help',
        method: 'post',
        data
    })
}

export function updateHelpQuestion (id, data) {
    return axios({
        url: `help/${id}`,
        method: 'put',
        data
    })
}

export function deleteHelpQuestions (ids) {
    return axios({
        url: `help/${ids}`,
        method: 'delete'
    })
}

export function enableHelpQuestions (ids) {
    return axios({
        url: `help/enable/${ids}`,
        method: 'put'
    })
}

export function disableHelpQuestions (ids) {
    return axios({
        url: `help/disable/${ids}`,
        method: 'put'
    })
}
