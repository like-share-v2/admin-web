import { axios } from '@/utils/request'

export function getTaskCategories (params) {
    return axios({
        url: 'task/category',
        method: 'get',
        params
    })
}

export function editTaskCategoryContent (data) {
    return axios({
        url: 'task/category_content',
        method: 'put',
        data
    })
}

export function createTaskCategory (data) {
    return axios({
        url: 'task/category',
        method: 'post',
        data
    })
}

export function editTaskCategory (id, data) {
    return axios({
        url: `task/category/${id}`,
        method: 'put',
        data
    })
}

export function deleteTaskCategory (id) {
    return axios({
        url: `task/category/${id}`,
        method: 'delete'
    })
}

export function enableTaskCategories (ids) {
    return axios({
        url: `task/category/enable/${ids}`,
        method: 'put'
    })
}

export function disableTaskCategoryies (ids) {
    return axios({
        url: `task/category/disable/${ids}`,
        method: 'put'
    })
}
