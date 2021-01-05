<template>
    <div class="body">
        <!--<el-tabs v-model="locale" type="card" @tab-click="handleClick" v-loading="loading">
            <el-tab-pane
                v-for="item in countryList"
                :key="item.code"
                :label="item.lang"
                :name="item.code"
            >-->

                <el-form>
                    <el-form-item :label="$i18n.t('LANGUAGE')">
                        <el-select v-model="locale"  @change="handleClick">
                            <el-option
                                v-for="item in countryList"
                                :key="item.code"
                                :label="item.lang"
                                :name="item.code"
                                :value="item.code"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <quill-editor ref="text" v-model="notifyContent"  class="myQuillEditor" :options="editorOption" />
                    </el-form-item>
                    <el-form-item :error="errors.submit">
                        <el-button @click="submitForm" type="primary" :loading="submitLogin" :disabled="btnDisable">{{ $i18n.t('SUBMIT') }}</el-button>
                        <el-button @click="handleCloseDialog">{{ $i18n.t('CANCEL') }}</el-button>
                    </el-form-item>
                    <el-form-item v-if="errorMessage !== ''">
                        <Alert type="error" show-icon>{{ errorMessage }}</Alert>
                    </el-form-item>
                </el-form>
            <!--</el-tab-pane>
        </el-tabs>-->
    </div>
</template>

<script>
    import { getNewsContent, updateNewsContent } from '@/api/newsContent'
    import { getCountryList } from '@/api/country'
    import { quillEditor } from 'vue-quill-editor'
    import quillConfig from '@/config/quill-config'
    /* eslint-disable */
    import 'quill/dist/quill.core.css'
    import 'quill/dist/quill.snow.css'
    import 'quill/dist/quill.bubble.css'

    export default {
        name: 'contentFormModal',
        components: { quillEditor },
        props: {
            handleCloseDialog: {
                type: Function,
                required: true
            },
            id: {
                type: Number,
                required: true
            }
        },
        created () {
            this.fetch()
        },
        data () {
            return {
                // 启用状态选项
                enableOptions: [
                    { label: this.$i18n.t('ENABLE'), value: 1 },
                    { label: this.$i18n.t('HIDDEN'), value: 0 }
                ],
                rules: {},
                errors: {
                    name: '',
                    title: '',
                    group: '',
                    type: '',
                    tips: '',
                    format: ''
                },
                submitLogin: false,
                btnDisable: false,
                errorMessage: '',
                attributeVisible: false,
                notifyContent: '',
                locale: 'zh-CN',
                countryList: [],
                loading: true,
                editorOption: quillConfig
            }
        },
        methods: {
            fetch () {
                getCountryList().then((res) => {
                    this.countryList = res.result
                    this.loading = false
                })
                getNewsContent({ notify_id: this.id, locale: this.locale }).then((res) => {
                    if (res.result !== null) {
                        this.notifyContent = res.result.content
                    } else {
                        this.notifyContent = ''
                    }
                })
            },
            submitForm () {
                // 先清空表单错误提示
                this.errors = {}
                this.submitLogin = true
                // 设置手动接管message提示
                this.$store.dispatch('MessageTake', true)
                this.errorMessage = ''

                updateNewsContent({ notify_id: this.id, locale: this.locale, content: this.notifyContent }).then(() => {
                    // 关闭抽屉
                    // this.handleCloseDialog()
                    this.$Message.success(this.$i18n.t('HANDLE_SUCCESS'))
                    // 调用爷爷组件刷新数据
                    //                                    this.$parent.$parent.fetch()
                }).catch((error) => {
                    // 后端过来的表单错误回显
                    this.errors = Object.assign({}, { ...this.errors, ...error.errors })
                    // 手动处理错误
                    if (!error.errors) {
                        this.errorMessage = error.message
                    }
                }).finally(() => {
                    this.submitLogin = false
                })
            },
            handleClick () {
                getNewsContent({ notify_id: this.id, locale: this.locale }).then((res) => {
                    if (res.result !== null) {
                        this.notifyContent = res.result.content
                    } else {
                        this.notifyContent = ''
                    }
                })
            }
        }
    }
</script>

<style lang="less" scoped>
    .body {
        padding-right: 25px;
        width: 100%;
    }
    /deep/ .el-checkbox__label {
        font-size: 12px;
    }
</style>
