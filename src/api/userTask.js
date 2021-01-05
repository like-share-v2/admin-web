import { axios } from '@/utils/request'

export function getUserTasks (params) {
    return axios({
        url: 'user_task',
        method: 'get',
        params
    })
}

export function auditUserTask (data) {
    return axios({
        url: 'user_task/audit',
        method: 'post',
        data
    })
}

export function auditUserTaskAll () {
    return axios({
        url: 'user_task/audit_all_pass',
        method: 'post'
    })
}
