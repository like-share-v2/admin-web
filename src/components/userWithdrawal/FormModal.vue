<template>
    <div class="body">
        <el-form :model="mdl" ref="ruleForm" label-width="130px">
            <el-form-item :label="$i18n.t('MEMBER_ID')">
                <span>{{ mdl.user_id }}</span>
            </el-form-item>
            <el-form-item :label="$i18n.t('COUNTRY')" v-if="mdl.country !== null">
                <span>{{ mdl.country.name_text }}</span>
            </el-form-item>
            <el-form-item :label="$i18n.t('WITHDRAWAL_AMOUNT')">
                <span>{{ mdl.amount }}</span>
            </el-form-item>
            <el-form-item :label="$i18n.t('SERVICE_CHARGE')">
                <span>{{ mdl.service_charge }}</span>
            </el-form-item>
            <el-form-item :label="$i18n.t('AMOUNT_PAYABLE')">
                <span>{{ mdl.amount * (1 - mdl.service_charge) }}</span>
            </el-form-item>
            <el-form-item :label="$i18n.t('WITHDRAWAL_BANK')">
                <span>{{ mdl.bank_name }}</span>
            </el-form-item>
            <el-form-item :label="$i18n.t('WITHDRAWAL_NAME')">
                <span>{{ mdl.name }}</span>
            </el-form-item>
            <el-form-item :label="$i18n.t('WITHDRAWAL_ACCOUNT')">
                <span>{{ mdl.account }}</span>
            </el-form-item>
            <el-form-item :label="$i18n.t('ADMIN_ID')" v-if="mdl.isCheck === true">
                <span>{{ mdl.admin_id }}</span>
            </el-form-item>
            <el-form-item :label="$i18n.t('REMARK')" v-if="mdl.isCheck === true">
                <span>{{ mdl.remark }}</span>
            </el-form-item>
            <el-form-item :label="$i18n.t('USER_TASK_AUDIT_TIME')" v-if="mdl.isCheck === true">
                <span>{{ mdl.updated_at }}</span>
            </el-form-item>
            <el-form-item :label="$i18n.t('AUDIT_RESULT')" required :error="errors.status">
                <el-select v-model="mdl.status" :value="mdl.status" :disabled="mdl.isCheck">
                    <el-option v-for="(option, index) in enableOptions" :label="option.label" :value="option.value" :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$i18n.t('PAY_CHANNEL')" required :error="errors.pay_channel">
                <el-select v-model="mdl.pay_channel">
                    <el-option v-for="(option, index) in payChannel" :label="option.label" :value="option.value" :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$i18n.t('REMARK')" :error="errors.remark" v-if="!mdl.isCheck">
                <el-input type="textarea" v-model="mdl.remark" :placeholder="$i18n.t('PLEASE_INPUT', { value: $i18n.t('REMARK') })" ></el-input>
            </el-form-item>
            <el-form-item :error="errors.submit">
                <el-button @click="submitForm" type="primary" :loading="submitLogin" :disabled="btnDisable" v-if="mdl.isCheck !== true">{{ $i18n.t('SUBMIT') }}</el-button>
                <el-button @click="handleCloseDrawer">{{ $i18n.t('CANCEL') }}</el-button>
            </el-form-item>
            <el-form-item v-if="errorMessage !== ''">
                <Alert type="error" show-icon>{{ errorMessage }}</Alert>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import { auditUserWithdrawal } from '@/api/userWithdrawal'
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
                enableOptions: [
                    { label: this.$i18n.t('PASS'), value: 1 },
                    { label: this.$i18n.t('REFUSE'), value: 2 }
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
                config: configs
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
                auditUserWithdrawal(this.mdl).then(() => {
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
        computed: {
            payChannel () {
                return this.$store.getters.options.PayChannel
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
