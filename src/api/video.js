import { axios } from '@/utils/request'

export function getVideoList (params) {
    return axios({
        url: 'video',
        method: 'get',
        params
    })
}

export function createVideo (data) {
    return axios({
        url: 'video',
        method: 'post',
        data
    })
}

export function editVideo (id, data) {
    return axios({
        url: `video/${id}`,
        method: 'put',
        data
    })
}

export function deleteVideo (ids) {
    return axios({
        url: `video/${ids}`,
        method: 'delete'
    })
}
