<template>
    <div class="body">
        <el-tabs v-model="locale" type="card" @tab-click="handleClick" v-loading="loading">
            <el-tab-pane
                v-for="item in countryList"
                :key="item.code"
                :label="item.lang"
                :name="item.code"
            >
                <el-form ref="ruleForm" label-width="130px">
                    <el-form-item :label="$i18n.t('HELP_CONTENT')" required :error="errors.content">
                        <el-input type="textarea" v-model="content" :placeholder="$i18n.t('PLEASE_INPUT', { value: $i18n.t('HELP_CONTENT') })"></el-input>
                    </el-form-item>
                    <el-form-item :error="errors.submit">
                        <el-button @click="submitForm" type="primary" :loading="submitLogin" :disabled="btnDisable">{{ $i18n.t('SUBMIT') }}</el-button>
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
    import { getHomePopUp, editHomePopUp } from '@/api/agreement'
    import { getCountryList } from '@/api/country'

    export default {
        name: 'formModal',
        watch: {
            mdl: {
                handler (newVal) {
                    console.log(newVal)
                    this.btnDisable = false
                },
                deep: true
            }
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
                locale: 'zh-CN',
                content: '',
                countryList: [],
                loading: true
            }
        },
        created () {
            this.fetch()
        },
        methods: {
            fetch () {
                getCountryList().then((res) => {
                    this.countryList = res.result
                    this.loading = false
                })

                getHomePopUp({ locale: this.locale }).then((res) => {
                    if (res.result !== null) {
                        this.content = res.result.content
                    } else {
                        this.content = ''
                    }
                })
            },
            handleClick () {
                getHomePopUp({ locale: this.locale }).then((res) => {
                    if (res.result !== null) {
                        this.content = res.result.content
                    } else {
                        this.content = ''
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
                editHomePopUp({ locale: this.locale, content: this.content }).then(() => {
                    // 关闭抽屉
                    this.$Message.success(this.$i18n.t('HANDLE_SUCCESS'))
                    // 调用爷爷组件刷新数据
                    this.fetch()
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
