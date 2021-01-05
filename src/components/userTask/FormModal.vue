<template>
    <div class="body">
        <el-form :model="mdl" ref="ruleForm" label-width="130px">
            <el-form-item :label="$i18n.t('MEMBER_ID')">
                <span>{{ mdl.user_id }}</span>
            </el-form-item>
            <el-form-item :label="$i18n.t('TASK_ID')">
                <span>{{ mdl.task_id }}</span>
            </el-form-item>
            <el-form-item :label="$i18n.t('TASK_TITLE')">
                <span v-if="mdl.task !== null">{{ mdl.task.title }}</span>
                <span v-else>-</span>
            </el-form-item>
            <el-form-item :label="$i18n.t('TASK_URL')">
                <el-link :href="mdl.task.url" target="_blank" type="primary" v-if="mdl.task !== null" icon="el-icon-link">
                    {{ $i18n.t('TASK_URL') }}
                </el-link>
                <span v-else>-</span>
            </el-form-item>
            <el-form-item :label="$i18n.t('TASK_DESCRIPTION')">
                <span v-if="mdl.task !== null">{{ mdl.task.description }}</span>
                <span v-else>-</span>
            </el-form-item>
            <el-form-item :label="$i18n.t('USER_TASK_IMAGE')">
                <el-image :src="config.staticUrl + mdl.image" :preview-src-list="[config.staticUrl + mdl.image]">
                </el-image>
            </el-form-item>
            <el-form-item :label="$i18n.t('ADMIN_ID')" v-if="mdl.isCheck === true">
                <span>{{ mdl.admin_id }}</span>
            </el-form-item>
            <el-form-item :label="$i18n.t('REMARK')" v-if="mdl.isCheck === true">
                <span>{{ mdl.remark }}</span>
            </el-form-item>
            <el-form-item :label="$i18n.t('USER_TASK_AUDIT_TIME')" v-if="mdl.isCheck === true">
                <span>{{ mdl.audit_time }}</span>
            </el-form-item>
            <el-form-item :label="$i18n.t('AUDIT_RESULT')" required :error="errors.status">
                <el-select v-model="mdl.status" :value="mdl.status" :disabled="mdl.isCheck">
                    <el-option v-for="(option, index) in enableOptions" :label="option.label" :value="option.value" :key="index"></el-option>
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
    import { auditUserTask } from '@/api/userTask'
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
                    { label: this.$i18n.t('PASS'), value: 2 },
                    { label: this.$i18n.t('REFUSE'), value: 3 }
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
                auditUserTask(this.mdl).then(() => {
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
