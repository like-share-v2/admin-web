import { axios } from '@/utils/request'

export function getInvitationList (params) {
    return axios({
        url: 'invitation',
        method: 'get',
        params
    })
}

export function deleteInvitation (ids) {
    return axios({
        url: `invitation/${ids}`,
        method: 'delete'
    })
}

export function addInvitation (data) {
    return axios({
        url: 'invitation',
        method: 'post',
        data
    })
}

export function editInvitation (id, data) {
    return axios({
        url: `invitation/${id}`,
        method: 'put',
        data
    })
}
