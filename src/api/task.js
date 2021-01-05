import { axios } from '@/utils/request'

export function getTasks (params) {
    return axios({
        url: 'task',
        method: 'get',
        params
    })
}

export function createTask (data) {
    return axios({
        url: 'task',
        method: 'post',
        data
    })
}

export function editTask (id, data) {
    return axios({
        url: `task/${id}`,
        method: 'put',
        data
    })
}

export function enableTasks (ids) {
    return axios({
        url: `task/enable/${ids}`,
        method: 'put'
    })
}

export function disableTasks (ids) {
    return axios({
        url: `task/disable/${ids}`,
        method: 'put'
    })
}

export function deleteTasks (ids) {
    return axios({
        url: `task/${ids}`,
        method: 'delete'
    })
}

export function getTaskDemands () {
    return axios({
        url: 'task/demands',
        method: 'get'
    })
}
