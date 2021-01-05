<template>
    <div class="body">
        <el-form :model="mdl" ref="ruleForm" label-width="150px">
            <el-form-item :label="$i18n.t('MEMBER_LEVEL')" required :error="errors.level">
                <el-input-number v-model="mdl.level" controls-position="right" :placeholder="$i18n.t('PLEASE_INPUT', { value: $i18n.t('MEMBER_LEVEL') })" style="width: 200px"></el-input-number>
            </el-form-item>
            <el-form-item :label="$i18n.t('LEVEL_NAME')"  required :error="errors.name">
                <el-input v-model="mdl.name" :placeholder="$i18n.t('PLEASE_INPUT', { value: $i18n.t('LEVEL_NAME') })"></el-input>
            </el-form-item>
            <el-form-item :label="$i18n.t('MEMBER_LEVEL_ICON')" required :error="errors.icon">
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
            <el-form-item :label="$i18n.t('LEVEL_TYPE')" required :error="errors.type">
                <el-select v-model="mdl.type" :value="mdl.type">
                    <el-option v-for="(option, index) in typeOptions" :label="option.label" :value="option.value" :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$i18n.t('MAX_BUY_NUM')" required :error="errors.max_buy_num">
                <el-input-number v-model="mdl.max_buy_num" :min="0" :placeholder="$i18n.t('PLEASE_INPUT', { value: $i18n.t('MAX_BUY_NUM') })" style="width: 200px"></el-input-number>
            </el-form-item>
            <el-form-item :label="$i18n.t('LEVEL_PRICE')" required :error="errors.price">
                <el-input-number v-model="mdl.price" controls-position="right" :min="0" :placeholder="$i18n.t('PLEASE_INPUT', { value: $i18n.t('LEVEL_PRICE') })" :precision="2" style="width: 200px"></el-input-number>
            </el-form-item>
            <el-form-item :label="$i18n.t('LEVEL_TASK_NUM')" required :error="errors.task_num">
                <el-input-number v-model="mdl.task_num" controls-position="right" :min="0" :placeholder="$i18n.t('PLEASE_INPUT', { value: $i18n.t('LEVEL_TASK_NUM') })" :precision="0" style="width: 200px"></el-input-number>
            </el-form-item>
            <el-form-item :label="$i18n.t('RECHARGE_P_ONE_REBATE')" required :error="errors.recharge_p_one_rebate">
                <el-input-number v-model="mdl.recharge_p_one_rebate" controls-position="right" :min="0" :placeholder="$i18n.t('PLEASE_INPUT', { value: $i18n.t('RECHARGE_P_ONE_REBATE') })" :precision="2" style="width: 200px"></el-input-number>
            </el-form-item>
            <el-form-item :label="$i18n.t('RECHARGE_P_TWO_REBATE')" required :error="errors.recharge_p_two_rebate">
                <el-input-number v-model="mdl.recharge_p_two_rebate" controls-position="right" :min="0" :placeholder="$i18n.t('PLEASE_INPUT', { value: $i18n.t('RECHARGE_P_TWO_REBATE') })" :precision="2" style="width: 200px"></el-input-number>
            </el-form-item>
            <el-form-item :label="$i18n.t('RECHARGE_P_THREE_REBATE')" required :error="errors.recharge_p_three_rebate">
                <el-input-number v-model="mdl.recharge_p_three_rebate" controls-position="right" :min="0" :placeholder="$i18n.t('PLEASE_INPUT', { value: $i18n.t('RECHARGE_P_THREE_REBATE') })" :precision="2" style="width: 200px"></el-input-number>
            </el-form-item>
            <el-form-item :label="$i18n.t('TASK_P_ONE_REBATE')" required :error="errors.task_p_one_rebate">
                <el-input-number v-model="mdl.task_p_one_rebate" controls-position="right" :min="0" :placeholder="$i18n.t('PLEASE_INPUT', { value: $i18n.t('TASK_P_ONE_REBATE') })" :precision="0" style="width: 200px"></el-input-number> %
            </el-form-item>
            <el-form-item :label="$i18n.t('TASK_P_TWO_REBATE')" required :error="errors.task_p_two_rebate">
                <el-input-number v-model="mdl.task_p_two_rebate" controls-position="right" :min="0" :placeholder="$i18n.t('PLEASE_INPUT', { value: $i18n.t('TASK_P_TWO_REBATE') })" :precision="0" style="width: 200px"></el-input-number> %
            </el-form-item>
            <el-form-item :label="$i18n.t('TASK_P_THREE_REBATE')" required :error="errors.task_p_three_rebate">
                <el-input-number v-model="mdl.task_p_three_rebate" controls-position="right" :min="0" :placeholder="$i18n.t('PLEASE_INPUT', { value: $i18n.t('TASK_P_THREE_REBATE') })" :precision="0" style="width: 200px"></el-input-number> %
            </el-form-item>
            <el-form-item :label="$i18n.t('DURATION')" required :error="errors.day || errors.hour || errors.mintue">
                <el-input-number v-model="mdl.day" :min="0" :controls="false" :placeholder="$i18n.t('DAY')" :precision="0" ></el-input-number> {{ $i18n.t('DAY') }}
                <el-input-number v-model="mdl.hour" :min="0" :controls="false" :placeholder="$i18n.t('HOUR')" :precision="0" ></el-input-number>{{ $i18n.t('HOUR') }}
                <el-input-number v-model="mdl.minute" :min="0" :controls="false" :placeholder="$i18n.t('MINUTE')" :precision="0"></el-input-number> {{ $i18n.t('MINUTE') }}
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
    import { createUserLevel, editUserlevel } from '@/api/userLevel'
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
                    console.log(newVal)
                    this.btnDisable = false
                },
                deep: true
            }
        },
        data () {
            return {
                // 启用状态
                typeOptions: [
                    { label: this.$i18n.t('TYPE_0'), value: 0 },
                    { label: this.$i18n.t('TYPE_1'), value: 1 }
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
                dialogVisible: false,
                dialogImageUrl: '',
                fileList: []
            }
        },
        created () {
            if (this.mdl.icon !== '') {
                this.fileList = [{ name: this.mdl.icon, url: configs.staticUrl + this.mdl.icon }]
            }
        },
        methods: {
            submitForm () {
                // 先清空表单错误提示
                this.errors = {}
                this.submitLogin = true
                // 设置手动接管message提示
                this.$store.dispatch('MessageTake', true)
                this.errorMessage = ''
                if (this.mdl.id === 0) {
                    createUserLevel(this.mdl).then(() => {
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
                    editUserlevel(this.mdl.id, this.mdl).then(() => {
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
                    this.mdl.icon = res.result.uri
                    request.onSuccess(res.result)
                }).catch((error) => {
                    request.onError(error)
                })
            },
            handleImagePreview (file) {
                this.dialogImageUrl = file.url
                this.dialogVisible = true
            },
            handleImageRemove () {
                this.mdl.icon = ''
            }
        }
    }
</script>

<style>
    .el-drawer.rtl{
        overflow: scroll;
    }
</style>
<style lang="less" scoped>
    .body {
        padding-right: 25px;
        width: 100%;
    }
    /deep/ .el-checkbox__label {
        font-size: 12px;
    }
</style>
