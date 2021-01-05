<template>
    <div class="body">
        <el-form :model="mdl" ref="ruleForm" label-width="130px">
            <el-form-item :label="$i18n.t('ADD_METHOD')" required>
                <el-radio-group v-model="addMethod" @change="onChangeAddMethod">
                    <el-radio :label="$i18n.t('MANUALLY_ADD')"></el-radio>
                    <el-radio :label="$i18n.t('TABLE_IMPORT')"></el-radio>
                </el-radio-group>
            </el-form-item>
            <div v-if="addMethodValue === 1">
                <el-form-item :label="$i18n.t('TASK_CATEGORY')" required :error="errors.category_id">
                    <el-select v-model="mdl.category_id" :value="mdl.category_id" :placeholder="$i18n.t('PLEASE_INPUT', { value: $i18n.t('TASK_CATEGORY') })">
                        <el-option v-for="(option, index) in categoryList" :label="option.name_text" :value="option.id" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$i18n.t('MEMBER_LEVEL')" required :error="errors.level">
                    <el-select v-model="mdl.level" :value="mdl.level" :placeholder="$i18n.t('PLEASE_SELECT', { value: $i18n.t('MEMBER_LEVEL') })">
                        <el-option v-for="(option, index) in userLevelList" :label="option.name_text" :value="option.level" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$i18n.t('TASK_TITLE')"  required :error="errors.title">
                    <el-input v-model="mdl.title" :placeholder="$i18n.t('PLEASE_INPUT', { value: $i18n.t('TASK_TITLE') })"></el-input>
                </el-form-item>
                <el-form-item :label="$i18n.t('TASK_DESCRIPTION')"  required :error="errors.description">
                    <!--<el-select v-model="mdl.description" :value="mdl.description" multiple :placeholder="$i18n.t('PLEASE_SELECT', { value: $i18n.t('TASK_DESCRIPTION') })">
                        <el-option v-for="(option, index) in demandList" :label="option" :value="option" :key="index"></el-option>
                    </el-select>-->
                    <el-input v-model="mdl.description" :placeholder="$i18n.t('PLEASE_INPUT', { value: $i18n.t('TASK_DESCRIPTION') })"></el-input>
                </el-form-item>
                <el-form-item :label="$i18n.t('TASK_URL')"  required :error="errors.url">
                    <el-input v-model="mdl.url" :placeholder="$i18n.t('PLEASE_INPUT', { value: $i18n.t('TASK_URL') })"></el-input>
                </el-form-item>
                <el-form-item :label="$i18n.t('TASK_AMOUNT')" required :error="errors.amount">
                    <el-input-number v-model="mdl.amount" controls-position="right" :min="0" :placeholder="$i18n.t('PLEASE_INPUT', { value: $i18n.t('TASK_AMOUNT') })" :precision="2" style="width: 200px"></el-input-number>
                </el-form-item>
                <el-form-item :label="$i18n.t('TASK_NUM')" required :error="errors.num">
                    <el-input-number v-model="mdl.num" controls-position="right" :min="0" :max="999999999" :placeholder="$i18n.t('PLEASE_INPUT', { value: $i18n.t('TASK_NUM') })" style="width: 200px"></el-input-number>
                </el-form-item>
                <el-form-item :label="$i18n.t('SORT')" required :error="errors.sort">
                    <el-input-number v-model="mdl.sort" controls-position="right" :min="0" :placeholder="$i18n.t('PLEASE_INPUT', { value: $i18n.t('SORT') })" style="width: 200px"></el-input-number>
                </el-form-item>
                <el-form-item :label="$i18n.t('STATUS')" required :error="errors.status">
                    <el-select v-model="mdl.status" :value="mdl.status">
                        <el-option v-for="(option, index) in enableOptions" :label="option.label" :value="option.value" :key="index"></el-option>
                    </el-select>
                </el-form-item>
            </div>
            <div v-if="addMethodValue === 2">
                <el-form-item :label="$i18n.t('PLEASE_SELECT', { value: $i18n.t('TABLE') })" required :error="errors.amount">
                    <el-upload
                        action=""
                        class="upload-demo"
                        ref="upload"
                        :on-preview="handlePreview"
                        :on-change="onFileChange"
                        :on-remove="handleRemove"
                        :file-list="[]"
                        :auto-upload="false"
                    >
                        <el-button slot="trigger" size="small">选取文件</el-button>
                    </el-upload>
                </el-form-item>
            </div>
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
    import { getUserLevels } from '@/api/userLevel'
    import { createTask, editTask, getTaskDemands } from '@/api/task'
    import { getTaskCategories } from '@/api/taskCategory'

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
            },
            watch: {
                uploadList: {
                    handler (uploadList) {
                        // 如果limit > 1: 返回数组
                        if (this.item.attr && this.item.attr.limit > 1) {
                            this.item.value = uploadList.map(item => item.name)
                        } else if (uploadList.length > 0) {
                            this.item.value = uploadList[0].name
                        }
                    },
                    deep: true
                }
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
                categoryList: [],
                userLevelList: [],
                demandList: [],
                addMethod: this.$i18n.t('MANUALLY_ADD'),
                addMethodValue: 1,
                file: null
            }
        },
        created () {
            getTaskCategories().then((res) => {
                this.categoryList = res.result
            })
            getUserLevels().then((res) => {
                this.userLevelList = res.result
            })
            getTaskDemands().then((res) => {
                this.demandList = res.result
            })
            this.mdl.add_method = 1
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
                    this.mdl.add_method = this.addMethodValue
                    const params = new FormData()
                    params.append('file', this.file)
                    for (const item in this.mdl) {
                        params.append(item, this.mdl[item])
                    }
                    createTask(params).then(() => {
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
                    this.mdl.add_method = 1
                    editTask(this.mdl.id, this.mdl).then(() => {
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
            onChangeAddMethod (value) {
                if (value === this.$i18n.t('MANUALLY_ADD')) {
                    this.addMethodValue = 1
                }
                if (value === this.$i18n.t('TABLE_IMPORT')) {
                    this.addMethodValue = 2
                }
            },
            onFileChange (file) {
                this.file = file.raw
            },
            handleRemove (file, fileList) {
                this.file = null
            },
            handlePreview (file) {
                console.log(file)
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
