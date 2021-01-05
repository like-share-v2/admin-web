<template>
    <el-form ref="ruleForm" label-width="130px">
        <el-form-item v-if="googleAuth !== null && !rebind" :label="$i18n.t('CURRENT_STATUS')">
            <el-switch :value="googleAuth.is_enable" @change="onSwitchChange"></el-switch>
        </el-form-item>
        <el-form-item v-if="googleAuth === null || rebind" :label="$i18n.t('SCAN_CODE_BINDING')">
            <el-image :src="googleAuthQRCodeUrl"></el-image>
        </el-form-item>
        <el-form-item v-if="googleAuth === null || rebind" :label="$i18n.t('VERIFY_CODE')">
            <el-input v-model="code" :placeholder="$i18n.t('PLEASE_INPUT', { value: $i18n.t('VERIFY_CODE') })" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item :error="errors.submit">
            <el-button v-if="googleAuth === null || rebind" type="primary" @click="onSubmitBind()" :loading="submitLogin" :disabled="submitLogin">{{ $i18n.t('BIND') }}</el-button>
            <el-button v-if="googleAuth !== null && !rebind" @click="rebind = true">{{ $i18n.t('REBIND') }}</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
    import { getGoogleAuthQRCode, bindGoogleAuth, switchGoogleAuth } from '@/api/default/account'
    export default {
        name: 'auth',
        data () {
            return {
                code: '',
                errors: '',
                submitLogin: false,
                secret: '',
                googleAuthQRCodeUrl: '',
                rebind: false
            }
        },
        computed: {
            googleAuth () {
                return this.$store.getters.user.google_auth
            }
        },
        created () {
            this.initGoogleAuthQRCodeUrl()
        },
        methods: {
            initGoogleAuthQRCodeUrl () {
                getGoogleAuthQRCode().then(res => {
                    const { code, result, message } = res
                    if (code !== 200) {
                        console.log(message)
                    }
                    const { secret, qrCodeUrl } = result
                    this.secret = secret
                    this.googleAuthQRCodeUrl = qrCodeUrl
                })
            },
            onSubmitBind () {
                const { secret, code } = this
                bindGoogleAuth({ secret, code }).then(res => {
                    this.$store.dispatch('GetInfo')
                    this.$Message.success(this.$i18n.t('HANDLE_SUCCESS'))
                    this.rebind = false
                }).catch(err => {
                    console.log(err)
                })
            },
            onSwitchChange () {
                switchGoogleAuth().then(res => {
                    this.$store.dispatch('GetInfo')
                })
            }
        }
    }
</script>

<style scoped>

</style>
