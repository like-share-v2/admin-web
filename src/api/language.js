import { axios } from '@/utils/request'

export function getLanguageList (params) {
    return axios({
        url: 'language',
        method: 'get',
        params
    })
}

export function addLanguage (data) {
    return axios({
        url: 'language',
        method: 'post',
        data
    })
}

export function editLanguage (id, data) {
    return axios({
        url: `language/${id}`,
        method: 'put',
        data
    })
}

export function deleteLanguage (ids) {
    return axios({
        url: `language/${ids}`,
        method: 'delete'
    })
}
