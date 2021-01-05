<template>
    <div class="body">
        <el-form :model="mdl" ref="ruleForm" label-width="130px">
            <el-form-item label="ID" v-if="mdl.id && mdl.id > 0">
                <el-input :value="mdl.id" disabled></el-input>
            </el-form-item>
            <el-form-item :label="$i18n.t('MF_TITLE')" required :error="errors.name">
                <el-input v-model="mdl.title" :placeholder="$i18n.t('PLEASE_INPUT', { value: $i18n.t('MF_TITLE') })"></el-input>
            </el-form-item>
            <el-form-item :label="$i18n.t('MF_MODE')" required :error="errors.mode">
                <el-select :placeholder="$i18n.t('PLEASE_SELECT', { value: $i18n.t('MF_MODE') })" v-model="mdl.mode" :value="mdl.mode">
                    <el-option v-for="(option, index) in modeOptions" :label="option.label" :value="option.value" :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$i18n.t('MF_INCOME_MODE')" required :error="errors.income_mode">
                <el-select :placeholder="$i18n.t('PLEASE_SELECT', { value: $i18n.t('MF_INCOME_MODE') })" v-model="mdl.income_mode" :value="mdl.income_mode">
                    <el-option v-for="(option, index) in incomeModeOptions" :label="option.label" :value="option.value" :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$i18n.t('DAILY_INTEREST_RATE')" required :error="errors.daily_interest_rate">
                <el-input-number :min="0.0001" :precision="4" v-model="mdl.daily_interest_rate"></el-input-number>
            </el-form-item>
            <el-form-item v-if="mdl.mode === 1" :label="$i18n.t('MF_PERIOD')" required :error="errors.period">
                <el-input-number :min="1" v-model="mdl.period" :placeholder="$i18n.t('PLEASE_INPUT', { value: $i18n.t('MF_PERIOD') })"></el-input-number>
            </el-form-item>
            <el-form-item :label="$i18n.t('MIN_BUY_AMOUNT')" :error="errors.min_amount">
                <el-input-number :min="0" v-model="mdl.min_amount" :placeholder="$i18n.t('PLEASE_INPUT', { value: $i18n.t('MIN_BUY_AMOUNT') })"></el-input-number>
            </el-form-item>
            <el-form-item :label="$i18n.t('IS_ENABLE')">
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
    import { createMFProduct, updateMFProduct } from '@/api/mf_product'

    export default {
        name: 'ProductFormModal',
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
                // 用户组状态
                modeOptions: [
                    { label: this.$i18n.t('MF_MODE_1'), value: 1 },
                    { label: this.$i18n.t('MF_MODE_2'), value: 2 }
                ],
                incomeModeOptions: [
                    { label: this.$i18n.t('MF_INCOME_MODE_1'), value: 1 },
                    { label: this.$i18n.t('MF_INCOME_MODE_2'), value: 2 }
                ],
                rules: {},
                errors: {
                    title: '',
                    daily_interest_rate: '',
                    mode: '',
                    period: '',
                    min_amount: '',
                    income_mode: ''
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
                    createMFProduct(this.mdl).then(() => {
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
                    updateMFProduct(this.mdl.id, this.mdl).then(() => {
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
