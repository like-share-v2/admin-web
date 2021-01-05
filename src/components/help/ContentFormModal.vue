<template>
    <div class="body">
        <el-tabs v-model="locale" type="card" @tab-click="handleClick" v-loading="loading">
            <el-tab-pane
                v-for="item in countryList"
                :key="item.code"
                :label="item.lang"
                :name="item.code"
            >
                <el-form ref="ruleForm">
                    <el-form-item required :error="errors.content">
                        <el-input type="textarea" autosize v-model="helpContent"></el-input>
                    </el-form-item>
                    <el-form-item :error="errors.submit">
                        <el-button @click="submitForm" type="primary" :loading="submitLogin" :disabled="btnDisable">{{ $i18n.t('SUBMIT') }}</el-button>
                        <el-button @click="handleCloseDialog">{{ $i18n.t('CANCEL') }}</el-button>
                    </el-form-item>
                    <el-form-item v-if="errorMessage !== ''">
                        <Alert type="error" show-icon>{{ errorMessage }}</Alert>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import { getHelpContent, updateHelpContent } from '@/api/helpContent'
    import { getCountryList } from '@/api/country'

    export default {
        name: 'contentFormModal',
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
                helpContent: '',
                locale: 'zh-CN',
                countryList: [],
                loading: true
            }
        },
        methods: {
            fetch () {
                getCountryList().then((res) => {
                    this.countryList = res.result
                    this.loading = false
                })
                getHelpContent({ help_id: this.id, locale: this.locale }).then((res) => {
                    if (res.result !== null) {
                        this.helpContent = res.result.content
                    } else {
                        this.helpContent = ''
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

                updateHelpContent({ help_id: this.id, locale: this.locale, content: this.helpContent }).then(() => {
                    // 关闭抽屉
                    this.handleCloseDialog()
                    this.$Message.success(this.$i18n.t('HANDLE_SUCCESS'))
                    // 调用爷爷组件刷新数据
                    this.$parent.$parent.fetch()
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
                getHelpContent({ help_id: this.id, locale: this.locale }).then((res) => {
                    if (res.result !== null) {
                        this.helpContent = res.result.content
                    } else {
                        this.helpContent = ''
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
