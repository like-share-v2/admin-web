<template>
    <div class="body">
        <el-form :model="mdl" ref="ruleForm" label-width="130px">
            <el-form-item label="ID" v-if="mdl.id && mdl.id > 0">
                <el-input :value="mdl.id" disabled></el-input>
            </el-form-item>
            <el-form-item :label="$i18n.t('RULE_NAME')" required :error="errors.name">
                <el-input v-model="mdl.name" :placeholder="$i18n.t('PLEASE_INPUT', { value: $i18n.t('RULE_NAME') })"></el-input>
            </el-form-item>
            <el-form-item :label="$i18n.t('ACTIVE_SUB_COUNT')" required :error="errors.active_sub">
                <el-input-number :min="0" v-model="mdl.active_sub" :placeholder="$i18n.t('PLEASE_INPUT', { value: $i18n.t('ACTIVE_SUB_COUNT') })"></el-input-number>
            </el-form-item>
            <el-form-item :label="$i18n.t('WITHDRAWAL_COUNT')" required :error="errors.withdrawal_count">
                <el-input-number  :min="0" v-model="mdl.withdrawal_count" :placeholder="$i18n.t('PLEASE_INPUT', { value: $i18n.t('WITHDRAWAL_COUNT') })"></el-input-number>
            </el-form-item>
            <el-form-item :label="$i18n.t('IS_ENABLE')" required>
                <el-switch v-model="mdl.is_enable"></el-switch>
            </el-form-item>
            <el-form-item :error="errors.submit">
                <el-button type="primary" @click="submitForm('ruleForm')" :loading="submitLogin" :disabled="btnDisable">{{ $i18n.t('SUBMIT') }}</el-button>
                <el-button @click="handleCloseDrawer">{{ $i18n.t('CANCEL') }}</el-button>
            </el-form-item>
            <el-form-item v-if="errorMessage !== ''">
                <Alert type="error" show-icon>{{ errorMessage }}</Alert>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import { createWithdrawalRule1List, updateWithdrawalRule1List } from '@/api/withdrawalRule1'

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
                handler () {
                    this.btnDisable = false
                },
                deep: true
            }
        },
        data () {
            return {
                rules: {},
                errors: {
                    name: '',
                    active_sub: '',
                    withdrawal_count: '',
                    is_enable: ''
                },
                submitLogin: false,
                btnDisable: true,
                errorMessage: ''
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
                    createWithdrawalRule1List(this.mdl).then(() => {
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
                    updateWithdrawalRule1List(this.mdl.id, this.mdl).then(() => {
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
