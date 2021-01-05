import { axios } from '@/utils/request'

export function getQrCodeList (params) {
    return axios({
        url: 'recharge_qr_code',
        method: 'get',
        params
    })
}

export function createQrCode (data) {
    return axios({
        url: 'recharge_qr_code',
        method: 'post',
        data
    })
}

export function editQrCode (id, data) {
    return axios({
        url: `recharge_qr_code/${id}`,
        method: 'put',
        data
    })
}

export function enableQrCodes (ids) {
    return axios({
        url: `recharge_qr_code/enable/${ids}`,
        method: 'put'
    })
}

export function disableQrCodes (ids) {
    return axios({
        url: `recharge_qr_code/disable/${ids}`,
        method: 'put'
    })
}

export function deleteQrCodes (ids) {
    return axios({
        url: `recharge_qr_code/${ids}`,
        method: 'delete'
    })
}
