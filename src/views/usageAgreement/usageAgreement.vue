<template>
    <div>
        <el-select v-model="locale"  @change="handleClick">
            <el-option
                v-for="item in countryList"
                :key="item.code"
                :label="item.lang"
                :name="item.code"
                :value="item.code"
            ></el-option>
        </el-select>
        <quill-editor ref="text" v-model="content" class="myQuillEditor" :options="editorOption" />
        <el-button type="primary" @click="submit">{{ $i18n.t('SUBMIT') }}</el-button>
    </div>
</template>

<script>
    import { quillEditor } from 'vue-quill-editor'
    import quillConfig from '@/config/quill-config'
    import { getUsageAgreement, editUsageAgreement } from '@/api/agreement'
    import { getCountryList } from '@/api/country'
    /* eslint-disable */
    import 'quill/dist/quill.core.css'
    import 'quill/dist/quill.snow.css'
    import 'quill/dist/quill.bubble.css'

    export default {
        name: 'usage_agreement',
        components: {
            quillEditor
        },
        data () {
            return {
                content: '',
                editorOption: quillConfig,
                locale: 'zh-CN',
                countryList: [],
            }
        },
        created () {
            this.fetch()
        },
        methods: {
            fetch () {
                getCountryList().then((res) => {
                    this.countryList = res.result
                })
                getUsageAgreement({ locale: this.locale }).then((res) => {
                    if (res.result !== null) {
                        this.content = res.result.content
                    } else {
                        this.content = ''
                    }
                })
            },
            submit () {
                editUsageAgreement({ content: this.content, locale: this.locale }).then(() => {
                    this.$Message.success(this.$i18n.t('HANDLE_SUCCESS'))
                }).catch((error) => {
                    // 手动处理错误
                    if (!error.errors) {
                        this.errorMessage = error.message
                    }
                }).finally(() => {
                    this.submitLogin = false
                })
            },
            handleClick () {
                getUsageAgreement({ locale: this.locale }).then((res) => {
                    if (res.result !== null) {
                        this.content = res.result.content
                    } else {
                        this.content = ''
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>
