import { axios } from '@/utils/request'

export function getMember (params) {
    return axios({
        url: 'member',
        method: 'get',
        params
    })
}

export function enableMember (id) {
    return axios({
        url: `member/enable/${id}`,
        method: 'put'
    })
}

export function disableMember (id) {
    return axios({
        url: `member/disable/${id}`,
        method: 'put'
    })
}

export function recharge (data) {
    return axios({
        url: 'member/recharge',
        method: 'post',
        data
    })
}

export function editBalance (data) {
    return axios({
        url: 'member/balance',
        method: 'put',
        data
    })
}

export function getTeam (params) {
    return axios({
        url: 'member/team',
        method: 'get',
        params
    })
}

export function getTeamLevel (params) {
    return axios({
        url: 'member/team_level',
        method: 'get',
        params
    })
}

export function createMember (data) {
    return axios({
        url: 'member',
        method: 'post',
        data
    })
}

export function setUpAgent (data) {
    return axios({
        url: 'member/set_up_agent',
        method: 'put',
        data
    })
}

export function cancelAgent (data) {
    return axios({
        url: 'member/cancel_agent',
        method: 'put',
        data
    })
}

export function update (data) {
    return axios({
        url: 'member/update',
        method: 'put',
        data
    })
}

export function changeEffectiveTime (data) {
    return axios({
        url: 'member/effective_time',
        method: 'put',
        data
    })
}

export function changeParentId (data) {
    return axios({
        url: 'member/changeParentId',
        method: 'put',
        data
    })
}

export function getUserMember (params) {
    return axios({
        url: 'member/user_member',
        method: 'get',
        params
    })
}
