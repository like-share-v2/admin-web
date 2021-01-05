import { axios } from '@/utils/request'

export function getUserLevels (params) {
    return axios({
        url: 'user_level',
        method: 'get',
        params
    })
}

export function createUserLevel (data) {
    return axios({
        url: 'user_level',
        method: 'post',
        data
    })
}

export function editUserlevel (id, data) {
    return axios({
        url: `user_level/${id}`,
        method: 'put',
        data
    })
}

export function deleteUserLevel (ids) {
    return axios({
        url: `user_level/${ids}`,
        method: 'delete'
    })
}
