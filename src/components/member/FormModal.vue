<template>
    <div class="body">
        <el-form :model="mdl" ref="ruleForm" label-width="130px" v-if="mdl.id === 0">
            <el-form-item :label="$i18n.t('USER_TYPE')" required :error="errors.type">
                <el-select v-model="mdl.type" :value="mdl.type">
                    <el-option v-for="(option, index) in typeOptions" :label="option.label" :value="option.value" :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$i18n.t('COUNTRY')" required :error="errors.country_id">
                <el-select v-model="mdl.country_id" :value="mdl.country_id">
                    <el-option v-for="(option, index) in countryList" :label="option.name_text" :value="option.id" :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$i18n.t('PARENT_ID')" required :error="errors.parent_id">
                <el-input v-model="mdl.parent_id" :placeholder="$i18n.t('PLEASE_INPUT', { value: $i18n.t('PARENT_ID') })"></el-input>
            </el-form-item>
            <!-- <el-form-item :label="$i18n.t('ACCOUNT')" :error="errors.account">
                <el-input v-model="mdl.account" :placeholder="$i18n.t('PLEASE_INPUT', { value: $i18n.t('ACCOUNT') })"></el-input>
            </el-form-item>-->
            <el-form-item :label="$i18n.t('LOGIN_PASSWORD')" :required="!(mdl.id && mdl.id > 0)" :error="errors.password">
                <el-input v-model="mdl.password" :placeholder="$i18n.t('PLEASE_INPUT', { value: $i18n.t('LOGIN_PASSWORD') })" type="password"></el-input>
            </el-form-item>
            <el-form-item :label="$i18n.t('PHONE_NUMBER')" required :error="errors.phone">
                <el-input v-model="mdl.phone" :placeholder="$i18n.t('PLEASE_INPUT', { value: $i18n.t('PHONE_NUMBER') })"></el-input>
            </el-form-item>
            <!--<el-form-item v-if="mdl.id && mdl.id > 0" :label="$i18n.t('STATUS')">
                <el-select v-model="mdl.status" :value="mdl.status">
                    <el-option v-for="(option, index) in statusOptions" :label="option.label" :value="option.value" :key="index"></el-option>
                </el-select>
            </el-form-item>-->
            <el-form-item :error="errors.submit">
                <el-button type="primary" @click="submitForm('ruleForm')" :loading="submitLogin" :disabled="btnDisable">{{ $i18n.t('SUBMIT') }}</el-button>
                <el-button @click="handleCloseDrawer">{{ $i18n.t('CANCEL') }}</el-button>
            </el-form-item>
            <el-form-item v-if="errorMessage !== ''">
                <Alert type="error" show-icon>{{ errorMessage }}</Alert>
            </el-form-item>
        </el-form>
        <el-form :model="mdl" ref="ruleForm" label-width="130px" v-else>
            <el-form-item :label="$i18n.t('USER_TYPE')" required :error="errors.type">
                <el-select v-model="mdl.type" :value="mdl.type">
                    <el-option v-for="(option, index) in typeOptions" :label="option.label" :value="option.value" :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$i18n.t('COUNTRY')" required :error="errors.country_id">
                <el-select v-model="mdl.country_id" :value="mdl.country_id">
                    <el-option v-for="(option, index) in countryList" :label="option.name_text" :value="option.id" :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$i18n.t('LOGIN_PASSWORD')" :error="errors.password">
                <el-input v-model="mdl.password" :placeholder="$i18n.t('PLEASE_INPUT', { value: $i18n.t('LOGIN_PASSWORD') })"></el-input>
            </el-form-item>
            <el-form-item :label="$i18n.t('TRADE_PASS')" :error="errors.trade_pass">
                <el-input v-model="mdl.trade_pass" :placeholder="$i18n.t('PLEASE_INPUT', { value: $i18n.t('TRADE_PASS') })"></el-input>
            </el-form-item>
            <el-form-item :label="$i18n.t('PHONE_NUMBER')" required :error="errors.phone">
                <el-input v-model="mdl.phone" :placeholder="$i18n.t('PLEASE_INPUT', { value: $i18n.t('PHONE_NUMBER') })"></el-input>
            </el-form-item>
            <el-form-item :label="$i18n.t('EMAIL')" required :error="errors.email">
                <el-input v-model="mdl.user_info.email" :placeholder="$i18n.t('PLEASE_INPUT', { value: $i18n.t('EMAIL') })"></el-input>
            </el-form-item>
            <el-form-item :label="$i18n.t('BANK_NAME')" :error="errors.bank_name">
                <el-input v-model="mdl.user_info.bank_name" :placeholder="$i18n.t('PLEASE_INPUT', { value: $i18n.t('BANK_NAME') })"></el-input>
            </el-form-item>
<!--            <el-form-item :label="$i18n.t('BANK_ADDRESS')" :error="errors.bank_address">-->
<!--                <el-input v-model="mdl.user_info.bank_address" :placeholder="$i18n.t('PLEASE_INPUT', { value: $i18n.t('BANK_ADDRESS') })"></el-input>-->
<!--            </el-form-item>-->
            <el-form-item :label="$i18n.t('MEMBER_BANK_NAME')" >
                <el-input v-model="mdl.user_info.name" :placeholder="$i18n.t('PLEASE_INPUT', { value: $i18n.t('MEMBER_BANK_NAME') })"></el-input>
            </el-form-item>
            <el-form-item :label="$i18n.t('BANK_ACCOUNT')" >
                <el-input v-model="mdl.user_info.account" :placeholder="$i18n.t('PLEASE_INPUT', { value: $i18n.t('BANK_ACCOUNT') })"></el-input>
            </el-form-item>
            <el-form-item :label="$i18n.t('BANK_CODE')" >
                <el-input v-model="mdl.user_info.bank_code" :placeholder="$i18n.t('PLEASE_INPUT', { value: $i18n.t('BANK_CODE') })"></el-input>
            </el-form-item>
            <el-form-item label="银行手机" >
                <el-input v-model="mdl.user_info.phone" :placeholder="$i18n.t('PLEASE_INPUT', { value: '银行手机' })"></el-input>
            </el-form-item>
            <el-form-item label="IFSC" >
                <el-input v-model="mdl.user_info.ifsc" :placeholder="$i18n.t('PLEASE_INPUT', { value: 'IFSC' })"></el-input>
            </el-form-item>
            <el-form-item label="UPI" >
                <el-input v-model="mdl.user_info.upi" :placeholder="$i18n.t('PLEASE_INPUT', { value: 'UPI' })"></el-input>
            </el-form-item>
            <!--<el-form-item v-if="mdl.id && mdl.id > 0" :label="$i18n.t('STATUS')">
                <el-select v-model="mdl.status" :value="mdl.status">
                    <el-option v-for="(option, index) in statusOptions" :label="option.label" :value="option.value" :key="index"></el-option>
                </el-select>
            </el-form-item>-->
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
    import { createMember, update } from '@/api/member'
    import { getCountryList } from '@/api/country'

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
                // 用户状态
                statusOptions: [
                    { label: this.$i18n.t('NORMAL'), value: 1 },
                    { label: this.$i18n.t('DISABLE'), value: 2 }
                ],
                typeOptions: [
                    { label: this.$i18n.t('USER_TYPE_0'), value: 0 },
                    { label: this.$i18n.t('USER_TYPE_1'), value: 1 }

                ],
                rules: {},
                errors: {
                    username: '',
                    password: '',
                    nickname: '',
                    phone: '',
                    email: ''
                },
                submitLogin: false,
                btnDisable: true,
                errorMessage: '',
                countryList: []
            }
        },
        created () {
            getCountryList().then((res) => {
                this.countryList = res.result
            })
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
                    createMember(this.mdl).then(() => {
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
                    update(this.mdl).then(() => {
                        // 关闭抽屉
                        this.handleCloseDrawer()
                        this.$Message.success(this.$i18n.t('HANDLE_SUCCESS'))
                        // 调用爷爷组件刷新数据
                        this.$parent.$parent.fetch()
                    }).catch((error) => {
                        // 后端过来的表单错误回显
                        this.errors = Object.assign({}, { ...this.errors, ...error.errors })
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
}
/deep/ .el-checkbox__label {
    font-size: 12px;
}
</style>
