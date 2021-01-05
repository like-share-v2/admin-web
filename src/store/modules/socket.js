import { Notification } from 'element-ui'
import store from '@/store'

let pageVisibility = true
// 监听页面是否是激活状态
const hiddenProperty = 'hidden' in document ? 'hidden' : 'webkitHidden' in document ? 'webkitHidden' : 'mozHidden' in document ? 'mozHidden' : null
const visibilityChangeEvent = hiddenProperty.replace(/hidden/i, 'visibilitychange')
const onVisibilityChange = () => {
    pageVisibility = !document[hiddenProperty]
}
document.addEventListener(visibilityChangeEvent, onVisibilityChange)

const socket = {
    state: {
        io: null,
        onlineCount: 0,
        uid: null,
        dialogueList: [],
        index: null
    },
    mutations: {
        SET_SOCKET_IO (state, io) {
            state.io = io.io
        },
        SET_SOCKET_UID (state, uid) {
            state.uid = uid
        },
        // 收到系统通知
        SOCKET_system (state, data) {
            console.log(data)
        },
        // 收到消息
        SOCKET_message (state, message) {
            const temp = state.dialogueList.slice(0)
            // 如果是自己发送的消息
            let objectId, avatar, name
            if (message.from.objectId === state.uid || message.object !== 1) {
                objectId = message.to.objectId
                avatar = message.to.avatar
                name = message.to.name
            } else {
                objectId = message.from.objectId
                avatar = message.from.avatar
                name = message.from.name
            }
            let skip = false
            temp.forEach((item, index) => {
                if (item.objectId === objectId && item.object === message.object) {
                    if (temp[index].messageList.length >= 100) {
                        temp[index].messageList.shift()
                    }
                    temp[index].avatar = avatar
                    temp[index].name = name
                    temp[index].type = message.type
                    temp[index].content = message.content
                    temp[index].sendTime = message.sendTime
                    temp[index].messageList.push(message)
                    if (index !== state.index && temp[index].unread < 99) {
                        temp[index].unread++
                    }
                    skip = true
                }
            })
            if (!skip) {
                temp.unshift({
                    objectId,
                    avatar,
                    name,
                    object: message.object,
                    type: message.type,
                    content: message.content,
                    sendTime: message.sendTime,
                    messageList: [message],
                    unread: 1
                })
            }
            state.dialogueList = temp
            if (message.from.objectId !== state.uid) {
                // 页面内弹窗通知
                if (store.getters.router.path !== '/dashboard/customerService') {
                    Notification({
                        title: name || 'anonymous',
                        message: message.content
                    })
                }
                // 桌面通知
                if (!pageVisibility) {
                    const n = new window.Notification((message.object + objectId).toString(), {
                        dir: 'auto',
                        body: message.content,
                        icon: avatar,
                        vibrate: [200, 100, 200]
                    })
                    n.onclick = function (e) {
                        window.open(window.location.href, '_blank')
                        n.close()
                    }
                }
            }
        },
        // 收到在线人数变化
        SOCKET_onlineCnt (state, data) {
            state.onlineCount = data
        },
        // 同步会话列表
        SET_DIALOGUE_LIST (state, data) {
            state.dialogueList = data
        },
        // 获取当前对话窗口的消息
        GET_MESSAGE (state, index) {
            if (state.dialogueList.length === 0) {
                return
            }
            const dialogue = state.dialogueList[index]
            let emit
            switch (dialogue.object) {
            case 1:
                emit = 'getMessage'
                break

            case 2:
                emit = 'getGroupMessage'
                break

            default:
                return
            }
            state.io.emit(emit, { side_id: dialogue.objectId }, (result) => {
                const temp = state.dialogueList.slice(0)
                temp.forEach((item, index) => {
                    // eslint-disable-next-line camelcase
                    if (item.objectId === dialogue.objectId && item.object === dialogue.object) {
                        temp[index].messageList = result.data
                        temp[index].unread = 0
                    } else {
                        // 清理其它窗口的缓存，让出内存空间
                        console.log(temp[index].name, 'clear')
                        temp[index].messageList = []
                    }
                })
                state.dialogueList = temp
            })
        },
        // 设置当前会话
        SET_CUR_INDEX (state, index) {
            state.index = index
        }
    },
    actions: {
        socketIoInit: ({ commit }, io) => {
            io.io.emit('uid', {}, (uid) => {
                commit('SET_SOCKET_UID', uid)
            })
            // 获取历史会话列表
            io.io.emit('getDialogueList', {}, (result) => {
                commit('SET_DIALOGUE_LIST', result)
            })
            commit('SET_SOCKET_IO', io)
            // 注册桌面通知模块
            if (!('Notification' in window)) {
                alert('This browser does not support desktop notification')
            } else if (window.Notification.permission === 'granted') {
                // 已有桌面通知权限
            } else if (window.Notification.permission !== 'denied') {
                window.Notification.requestPermission((permission) => {
                    if (permission === 'granted') {
                        // eslint-disable-next-line no-new
                        new window.Notification('已启用桌面通知功能')
                    }
                })
            }
        },
        setCurIndex: ({ commit }, index) => {
            commit('GET_MESSAGE', index)
            commit('SET_CUR_INDEX', index)
        }
    }
}

export default socket
