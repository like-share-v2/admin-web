<template>
    <div class="body">
        <el-form :model="mdl" ref="ruleForm" label-width="130px">
            <el-form-item :label="$i18n.t('URL')" required :error="errors.url">
                <el-input v-model="mdl.url" :placeholder="$i18n.t('PLEASE_INPUT', { value: $i18n.t('URL') })"></el-input>
            </el-form-item>
            <el-form-item :label="$i18n.t('SORT')" required :error="errors.sort">
                <el-input-number v-model="mdl.sort" style="width: 200px" :precision="0" :placeholder="$i18n.t('PLEASE_INPUT', { value: $i18n.t('SORT') })"></el-input-number>
            </el-form-item>
            <!-- 默认添加广告 注释隐藏添加轮播 -->
            <!--<el-form-item :label="$i18n.t('TYPE')" required :error="errors.type">
                <div style="width: 100%">
                    <el-select v-model="mdl.type" :value="mdl.type" :placeholder="$i18n.t('PLEASE_SELECT', { value: $i18n.t('TYPE') })" @change="mdl.attr = {}">
                        <el-option v-for="(option, index) in $store.getters.options.Banner.BannerTypeList" :label="option.label" :value="option.value" :key="index"></el-option>
                    </el-select>
                </div>
            </el-form-item>-->
            <el-form-item :label="$i18n.t('BANNER_IMAGE')" required :error="errors.image">
                <el-upload
                    action=""
                    list-type="picture-card"
                    :limit=1
                    :multiple="false"
                    :on-preview="handleIconPreview"
                    :http-request="iconHttpRequest"
                    :file-list="icon.fileList"
                    :on-remove="handleIconRemove"
                >
                    <i class="el-icon-plus" />
                </el-upload>
                <el-dialog :visible.sync="icon.dialogVisible" :append-to-body="true">
                    <img width="100%" :src="icon.dialogImageUrl" alt="">
                </el-dialog>
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
    import { createBanner, updateBanner } from '@/api/banner'
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
                icon: {
                    dialogImageUrl: '',
                    dialogVisible: false,
                    fileList: []
                },
                banner: {
                    dialogImageUrl: '',
                    dialogVisible: false,
                    fileList: []
                }
            }
        },
        created () {
            this.initDefaultFileList()
        },
        methods: {
            handleIconRemove () {
                this.mdl.icon = ''
            },
            handleBannerRemove () {
                this.mdl.banner = ''
            },
            initDefaultFileList () {
                if (this.mdl.image !== '') {
                    this.icon.fileList = [{ name: this.mdl.image, url: configs.staticUrl + this.mdl.image }]
                }
                if (this.mdl.banner !== '') {
                    this.banner.fileList = [{ name: this.mdl.banner, url: configs.staticUrl + this.mdl.banner }]
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
                    createBanner(this.mdl).then(() => {
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
                    updateBanner(this.mdl.id, this.mdl).then(() => {
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
            iconHttpRequest (request) {
                const params = new FormData()
                params.append('file', request.file)
                upload(params).then((res) => {
                    this.mdl.image = res.result.uri
                    request.onSuccess(res.result)
                }).catch((error) => {
                    request.onError(error)
                })
            },
            bannerHttpRequest (request) {
                const params = new FormData()
                params.append('file', request.file)
                upload(params).then((res) => {
                    this.mdl.banner = res.result.uri
                    request.onSuccess(res.result)
                }).catch((error) => {
                    request.onError(error)
                })
            },
            handleIconPreview (file) {
                this.icon.dialogImageUrl = file.url
                this.icon.dialogVisible = true
            },
            handleBannerPreview (file) {
                this.banner.dialogImageUrl = file.url
                this.banner.dialogVisible = true
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
