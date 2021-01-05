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
    import { quillEditor, Quill } from 'vue-quill-editor'
    import quillConfig from '@/config/quill-config'
    import { getPrivacyPolicy, editPrivacyPolicy } from '@/api/agreement'
    /* eslint-disable */
    import 'quill/dist/quill.core.css'
    import 'quill/dist/quill.snow.css'
    import 'quill/dist/quill.bubble.css'
    import {getCountryList} from "@/api/country";
    import { ImageDrop } from 'quill-image-drop-module'
    import ImageResize from 'quill-image-resize-module'
    Quill.register('modules/imageDrop', ImageDrop)
    Quill.register('modules/imageResize', ImageResize)

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
                getPrivacyPolicy({ locale: this.locale }).then((res) => {
                    if (res.result !== null) {
                        this.content = res.result.content
                    } else {
                        this.content = ''
                    }
                })
            },
            submit () {
                editPrivacyPolicy({ content: this.content, locale: this.locale }).then(() => {
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
                getPrivacyPolicy({ locale: this.locale }).then((res) => {
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
