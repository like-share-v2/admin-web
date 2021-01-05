import { axios } from '@/utils/request'

export function getBannerList (params) {
    return axios({
        url: 'banner',
        method: 'get',
        params
    })
}

export function createBanner (data) {
    return axios({
        url: 'banner',
        method: 'post',
        data
    })
}

export function updateBanner (id, data) {
    return axios({
        url: `banner/${id}`,
        method: 'put',
        data
    })
}

export function deleteBanner (ids) {
    return axios({
        url: `banner/${ids}`,
        method: 'delete'
    })
}
