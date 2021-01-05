:<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script>
    import {
        DEFAULT_MULTI_TAB,
        DEFAULT_THEME_TYPE,
        ACCESS_TOKEN
    } from '@/config/constants'
    import VueSocketIO from 'vue-socket.io'
    import { getWsToken } from '@/api/default/account'
    import store from './store'

    export default {
        created () {
            this.$store.dispatch('ToggleMultiTab', this.$ls.get(DEFAULT_MULTI_TAB))
            this.$store.dispatch('ToggleThemeType', this.$ls.get(DEFAULT_THEME_TYPE))
            this.initWebSocket()
        },
        methods: {
            initWebSocket () {
                const token = this.$ls.get(ACCESS_TOKEN)
                if (token) {
                    getWsToken().then(res => {
                        const { code, result } = res
                        if (code !== 200) {
                            return console.log('get wstoken failed!')
                        }
                        this.$store.dispatch('socketIoInit', new VueSocketIO({
                            debug: false,
                            connection: process.env.NODE_ENV === 'production' ? '/' : 'ws://192.168.3.3:9502',
                            vuex: {
                                store,
                                actionPrefix: 'SOCKET_',
                                mutationPrefix: 'SOCKET_'
                            },
                            options: {
                                path: '/socket.io/',
                                transports: ['websocket'],
                                query: {
                                    token: result
                                }
                            }
                        }))
                    })
                }
            }
        }
    }
</script>

<style lang="less">
    input::-webkit-input-placeholder {
        font-size: 12px;
    }
    // 表格样式
    .table-body {
        // 表格左上角
        .table-left-top {
            width: 100%;
            float: left;
            margin-bottom: 15px;
        }
        // 表格右上角
        .table-right-top {
            float: right;
            margin-bottom: 15px;
        }
        // 表格分页
        .table-pagination {
            margin-bottom: 100px;
            float: right;
            margin-top: 15px
        }
    }
</style>
