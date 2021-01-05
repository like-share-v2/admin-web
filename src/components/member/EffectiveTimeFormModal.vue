<template>
    <div class="body">
        <el-form :model="mdl" ref="ruleForm" label-width="130px">
            <el-form-item :label="$i18n.t('MEMBER_ID')">
                {{ mdl.user_id }}
            </el-form-item>
            <el-form-item :label="$i18n.t('MEMBER_LEVEL')" required :error="errors.level">
                <span v-if="mdl.user_level !== null">{{ mdl.user_level.name_text }}</span>
                <span v-else>-</span>
            </el-form-item>
            <el-form-item :label="$i18n.t('EFFECTIVE_TIME')" required :error="errors.level">
                {{ mdl.effective_time }}
            </el-form-item>
            <el-form-item :label="$i18n.t('EDIT_EFFECTIVE_TIME')">
                <el-input-number v-model="day" :placeholder="$i18n.t('EDIT_EFFECTIVE_TIME')" style="width: 200px;"></el-input-number> {{ $i18n.t('DAY') }}
            </el-form-item>
            <!--<el-form-item :label="$i18n.t('CREDIT')" required :error="errors.credit">
                <el-input-number v-model="mdl.credit" :min="0" :max="999999" :placeholder="$i18n.t('PLEASE_INPUT', { value: $i18n.t('CREDIT') })" style="width: 300px"></el-input-number>
            </el-form-item>
            <el-form-item>
                <Alert show-icon style="font-size: 12px">输入0为不充值</Alert>
            </el-form-item>
            <el-form-item :label="$i18n.t('CREDIT_REMARK')">
                <el-input v-model="mdl.credit_remark" type="textarea"></el-input>
            </el-form-item>
            <el-form-item :label="$i18n.t('REMARK')">
                <el-input v-model="mdl.recharge_remark" type="textarea"></el-input>
            </el-form-item>-->
            <el-form-item :error="errors.submit">
                <el-button @click="submitForm" type="primary" :loading="submitLogin" :disabled="btnDisable">{{ $i18n.t('SUBMIT') }}</el-button>
                <el-button @click="handleCloseDialog">{{ $i18n.t('CANCEL') }}</el-button>
            </el-form-item>
            <el-form-item v-if="errorMessage !== ''">
                <Alert type="error" show-icon>{{ errorMessage }}</Alert>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import { changeEffectiveTime } from '@/api/member'
    import { getUserLevels } from '@/api/userLevel'

    export default {
        name: 'formModal',
        props: {
            mdl: {
                type: Object,
                required: true
            },
            handleCloseDialog: {
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
        created () {
            getUserLevels().then((res) => {
                this.userLevelList = res.result
            })
        },
        data () {
            return {
                // 启用状态选项
                enableOptions: [
                    { label: this.$i18n.t('ENABLE'), value: 1 },
                    { label: this.$i18n.t('DISABLE'), value: 2 }
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
                userLevelList: [],
                day: 0
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
                changeEffectiveTime({ id: this.mdl.user_id, day: this.day, level: this.mdl.level }).then(() => {
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
