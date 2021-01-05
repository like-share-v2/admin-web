<template>
    <div id="wrap" style="background-color: #eef0f5;">
        <div id="container">
            <!--消息 start-->
            <div class="chat-container page-container" style="display: block;">
                <div class="sec-content chat-group-full">
                    <div class="scroll-wrapper user-list scrollbar-macosx" style="position: absolute;">
                        <div class="user-list scrollbar-macosx scroll-content scroll-scrolly_visible"
                             style="height: auto; margin-bottom: 0px; margin-right: 0px;height: 100%;">
                            <ul class="main-list">
                                <li :class="{'cur':curIndex === index}" v-for="(item, index) in getDialogueList" :key="index">
                                    <a @click="onSwitchIndex(index)" href="javascript:void(0);">
                                        <!-- 头像 -->
                                        <div class="figure">
                                            <span class="notice-badge" v-show="item.unread > 0">{{ item.unread }}</span>
                                            <img :src="item.avatar || defaultAvatar">
                                        </div>
                                        <div class="text">
                                            <div class="title">
                                                <span class="time">{{ item.sendTime }}</span>
                                                <span class="name">{{ item.name }}</span>
                                                <p class="gray" v-if="item.type === 1">{{ item.content }}</p><i class="iboss-xingbiao-mian hide"></i>
                                                <p class="gray" v-if="item.type === 2">[ {{ $i18n.t('IMAGES_MESSAGE') }} ]</p><i class="iboss-xingbiao-mian hide"></i>
                                            </div>
                                        </div>
                                    </a>
                                </li>
                            </ul>
                            <!--<div class="loadmore" data-url="/chat/userList.json" style="display: block;">加载更多</div>-->
                        </div>
                        <div class="scroll-element scroll-x scroll-scrolly_visible">
                            <div class="scroll-element_outer">
                                <div class="scroll-element_size"></div>
                                <div class="scroll-element_track"></div>
                                <div class="scroll-bar" style="width: 89px;"></div>
                            </div>
                        </div>
                        <div class="scroll-element scroll-y scroll-scrolly_visible">
                            <div class="scroll-element_outer">
                                <div class="scroll-element_size"></div>
                                <div class="scroll-element_track"></div>
                                <div class="scroll-bar" style="height: 53px; top: 0px;"></div>
                            </div>
                        </div>
                    </div>
                    <div class="detail-box">
                        <div class="chat-wrap">
                            <div ref="chatBox" class="chat-tab-content chat-box show-box">
                                <div ref="chatList" class="chat-list" style="visibility: visible; padding-top: 0px;">
                                    <ul id="chat-list" v-if="getDialogueList.length > 0" v-loading="loading">
                                        <li
                                            v-for="(item, index) in messageList"
                                            :key="index"
                                            :class="{'item-friend': item.from.objectId !== uid, 'item-myself item-interview status-read': item.from.objectId === uid}"
                                        >
                                            <div v-if="item.from.objectId !== uid" class="figure">
                                                <img :src="item.avatar || defaultAvatar">
                                            </div>
                                            <div v-if="item.type === 2" class="text bgf" style="cursor:pointer;">
                                                <img :src="item.content" class="img-tiny" width="" height="200" @click="onPreview">
                                            </div>
                                            <el-tooltip class="item" effect="dark" :content="item.sendTime" placement="right">
                                                <div v-if="item.type === 1" class="text">{{ item.content }}</div>
                                            </el-tooltip>
                                            <div class="item-time" v-if="index > 0 && item.timestamp - messageList[index - 1].timestamp > 60 * 5">
                                                <span class="time">{{ item.sendTime }}</span>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                                <div class="chat-editor">
                                    <div class="chat-controls">
                                        <!--<div class="links">
                                            <a ka="geek_chat_interview" href="javascript:;" class="btn-interview">
                                                <i class="iboss-interview"></i> 约面试
                                                <span data-text="约面试">约面试</span>
                                            </a>
                                            <a href="javascript:;" target-status="8" class="link-fail">
                                                不合适<div class="no-good-mask"></div>
                                                <span class="no-reply-text">回复语设置</span>
                                            </a>
                                        </div>-->
                                        <a href="javascript:;" @click="$refs.image.click()" class="btn-dict">
                                            <i class="iconfont icon-image"></i>
                                            <i class="iconfont icon-image hover"></i>
                                            <span data-text="图片">图片</span>
                                            <input v-if="iShowFile" name="image" ref="image" id="image" type="file" accept="image/gif,image/jpeg,image/png,image/bpm" style="display: none;" multiple @change="onUploadChange($event)" />
                                        </a>
                                        <!--<a href="javascript:;" class="btn-resume">
                                            <i class="iboss-editor-resume"></i>
                                            <span data-text="求简历">求简历</span>
                                        </a>
                                        <a href="javascript:;" class="btn-contact">
                                            <i class="iboss-phone"></i>
                                            <span data-text="求手机">求手机</span>
                                        </a>
                                        <a href="javascript:;" class="btn-weixin">
                                            <i class="iboss-wechat"></i>
                                            <span data-text="求微信">求微信</span>
                                        </a>
                                        <em class="vline"></em>
                                        <a href="javascript:;" class="btn-video">
                                            <i class="iboss-shipin"></i>
                                            <span data-text="视频面试">视频面试</span>
                                        </a>
                                        <a href="javascript:;" class="btn-audio">
                                            <i class="iboss-yuyin"></i>
                                            <span data-text="语音通话">语音通话</span>
                                        </a>
                                        <a href="javascript:;" class="btn-message">
                                            <i class="iboss-duanxin"></i>
                                            <span data-text="短信通知">短信通知</span>
                                        </a>-->
                                    </div>
                                    <el-input type="textarea" class="chat-message" v-model="messageContent" :rows="2" autofocus="true" @keydown.native="handleKeyCode($event)"></el-input>
                                    <div class="chat-op">
<!--                                            <span class="tip">按Enter键发送</span>-->
                                        <button @click="onSend()" class="btn btn-send" type="button">{{ $i18n.t('SEND') }}</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <el-image-viewer v-if="showViewer" :on-close="closeViewer" :url-list="previewSrcList" />
    </div>
</template>

<script>
    import defaultAvatar from '@/assets/images/avatar.jpeg'
    import { upload } from '@/api/default/upload'
    import ElImageViewer from 'element-ui/packages/image/src/image-viewer'

    export default {
        name: 'customerService',
        components: {
            ElImageViewer
        },
        data () {
            return {
                messageContent: '',
                iShowFile: true,
                loading: false,
                showViewer: false
            }
        },
        watch: {
            messageList: {
                handler (newVal) {
                    this.$nextTick(() => {
                        this.$refs.chatList.scrollTop = this.$refs.chatList.scrollHeight + 50
                    })
                },
                deep: true
            }
        },
        created () {
            this.loading = true
            setTimeout(() => {
                this.$store.dispatch('setCurIndex', 0)
                this.loading = false
            }, 1000)
        },
        methods: {
            onSend () {
                if (this.messageContent.replace(/[ ]/g, '').replace(/[\r\n]/g, '') === '') {
                    return
                }
                const dialogue = this.getDialogueList[this.curIndex]
                this.$store.getters.socket.io.emit(dialogue.object === 1 ? 'sendToUser' : 'sendToGroup', {
                    to: dialogue.objectId,
                    type: 1,
                    content: this.messageContent
                })
                this.messageContent = ''
            },
            onSwitchIndex (index) {
                this.$store.dispatch('setCurIndex', index)
            },
            // 发送图片
            onUploadChange (event) {
                this.$nextTick(() => {
                    this.$refs.image.value = null
                })
                this.loading = true
                const params = new FormData()
                params.append('file', event.target.files[0])
                upload(params).then((res) => {
                    const { code, result } = res
                    if (code !== 200) {
                        this.$Message.error(this.$i18n.t('UPLOAD_FAIL'))
                    }
                    const dialogue = this.getDialogueList[this.curIndex]
                    this.$store.getters.socket.io.emit(dialogue.object === 1 ? 'sendToUser' : 'sendToGroup', {
                        to: dialogue.objectId,
                        type: 2,
                        content: result.uri
                    })
                }).catch(() => {
                    this.$Message.error(this.$i18n.t('UPLOAD_FAIL'))
                }).finally(() => {
                    this.loading = false
                })
            },
            onPreview () {
                this.showViewer = true
            },
            closeViewer () {
                this.showViewer = false
            },
            handleKeyCode (event) {
                if (event.keyCode === 13) {
                    if (!event.metaKey) {
                        event.preventDefault()
                        this.onSend()
                    } else {
                        this.messageContent = this.messageContent + '\n'
                    }
                }
            }
        },
        computed: {
            // 会话列表
            getDialogueList () {
                return this.$store.getters.socket.dialogueList
            },
            // 消息列表
            messageList () {
                if (this.curIndex === null || this.getDialogueList.length === 0) {
                    return []
                }
                console.log(this.curIndex)
                return this.getDialogueList[this.curIndex].messageList
            },
            // uid
            uid () {
                return this.$store.getters.socket.uid
            },
            // 当前窗口
            curIndex () {
                return this.$store.getters.socket.index
            },
            defaultAvatar () {
                return defaultAvatar
            },
            // 图片预览
            previewSrcList () {
                const list = []
                this.messageList.forEach(item => {
                    if (item.type === 2) {
                        list.push(item.content)
                    }
                })
                return list
            }
        }
    }
</script>

<style scoped lang="less">
@import "../../assets/css/kefu-main.css";
@import "../../assets/css/kefu-viewer.min.css";
@import "../../assets/kefu-icons/iconfont.css";
</style>
