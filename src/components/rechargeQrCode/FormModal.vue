<template>
    <div class="body">
        <el-form :model="mdl" ref="ruleForm" label-width="130px">
            <el-form-item :label="$i18n.t('RECHARGE_QR_CODE')" required :error="errors.image">
                <el-upload
                    action=""
                    list-type="picture-card"
                    :limit=1
                    :multiple="false"
                    :on-preview="handleImagePreview"
                    :http-request="HttpRequest"
                    :file-list="fileList"
                    :on-remove="handleImageRemove"
                >
                    <i class="el-icon-plus" />
                </el-upload>
                <el-dialog :visible.sync="dialogVisible" :append-to-body="true">
                    <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
            </el-form-item>
            <el-form-item :label="$i18n.t('STATUS')" required :error="errors.status">
                <el-select v-model="mdl.status" :value="mdl.status">
                    <el-option v-for="(option, index) in enableOptions" :label="option.label" :value="option.value" :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item :error="errors.submit">
                <el-button @click="submitForm" type="primary" :loading="submitLogin" :disabled="btnDisable">{{ $i18n.t('SUBMIT') }}</el-button>
                <el-button @click="handleCloseDrawer">{{ $i18n.t('CANCEL') }}</el-button>
            </el-form-item>
            <el-form-item v-if="errorMessage !== ''">
                <Alert type="error" show-icon>{{ errorMessage }}</Alert>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import { createQrCode, editQrCode } from '@/api/RechargeQrCode'
    import { upload } from '@/api/default/upload'
    import configs from '@/config'

    export default {
        name: 'formModal',
        props: {
            mdl: {
                type: Object,
                required: true
            },
            handleCloseDrawer: {
                type: Function,
                required: true
            }
        },
        watch: {
            mdl: {
                handler (newVal) {
                    this.btnDisable = false
                },
                deep: true
            }
        },
        computed: {
            options () {
                let value = ''
                Object.keys(this.mdl.options).forEach((key) => {
                    value += (`${key}:${this.mdl.options[key]}\r\n`)
                })
                return value
            },
            // 配置类型
            groupSelectList () {
                return this.$store.getters.options.AdminConfigGroup
            }
        },
        data () {
            return {
                // 启用状态
                enableOptions: [
                    { label: this.$i18n.t('ENABLE'), value: 1 },
                    { label: this.$i18n.t('DISABLE'), value: 0 }
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
                btnDisable: true,
                errorMessage: '',
                attributeVisible: false,
                dialogImageUrl: '',
                dialogVisible: false,
                fileList: []
            }
        },
        created () {
            this.initDefaultFileList()
        },
        methods: {
            handleImageRemove () {
                this.mdl.image = ''
            },
            initDefaultFileList () {
                if (this.mdl.icon !== '') {
                    this.fileList = [{ name: this.mdl.image, url: configs.staticUrl + this.mdl.image }]
                }
            },
            submitForm () {
                // 先清空表单错误提示
                this.errors = {}
                this.submitLogin = true
                // 设置手动接管message提示
                this.$store.dispatch('MessageTake', true)
                this.errorMessage = ''
                if (this.mdl.id === 0) {
                    createQrCode(this.mdl).then(() => {
                        // 关闭抽屉
                        this.handleCloseDrawer()
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
                } else {
                    editQrCode(this.mdl.id, this.mdl).then(() => {
                        // 关闭抽屉
                        this.handleCloseDrawer()
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
                }
            },
            HttpRequest (request) {
                const params = new FormData()
                params.append('file', request.file)
                upload(params).then((res) => {
                    this.mdl.image = res.result.uri
                    request.onSuccess(res.result)
                }).catch((error) => {
                    request.onError(error)
                })
            },
            handleImagePreview (file) {
                this.dialogImageUrl = file.url
                this.dialogVisible = true
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
