import { axios } from '@/utils/request'

export function getTaskAuditList (params) {
    return axios({
        url: 'task_audit',
        method: 'get',
        params
    })
}

export function auditTaskAudit (data) {
    return axios({
        url: 'task_audit/audit',
        method: 'post',
        data
    })
}
