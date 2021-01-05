<template>
    <div>
        <!-- 搜索组件 -->
        <search-form :items="formItems" :params="params" :on-submit="onSearch" :btn-loading="loading" />

        <!-- 表格区域 -->
        <div class="table-body">
            <!-- 左上角按钮 -->
            <div class="table-left-top">
                <el-button v-auth="'add'" type="primary" icon="el-icon-plus" @click="onAdd">{{ $i18n.t('CREATE_NEWS') }}</el-button>
            </div>
            <!-- 表格 -->
            <el-table border style="width: 100%;" stripe :data="data" v-loading="loading" row-key="id" >
                <el-table-column align="center" prop="title_text" :label="$i18n.t('NEWS_TITLE')" :min-width="150"></el-table-column>
                <el-table-column align="center" prop="content" :label="$i18n.t('NEWS_CONTENT')" :min-width="150">
                    <template slot-scope="scope">
                        <el-button plain v-if="scope.row.content === null" type="info" disabled>{{ $i18n.t('CHECK_NEWS_CONTENT') }}</el-button>
                        <el-button plain v-else type="primary" @click="checkNewsContent(scope.row)">{{ $i18n.t('CHECK_NEWS_CONTENT') }}</el-button>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="sort" :label="$i18n.t('SORT')" :min-width="100"></el-table-column>
                <el-table-column align="center" sortable prop="created_at" :label="$i18n.t('CREATE_TIME')" :min-width="170"></el-table-column>
                <!-- 右侧按钮 -->
                <el-table-column align="center" :label="$i18n.t('ACTION')" fixed="right" :width="200">
                    <template slot-scope="scope">
                        <el-link v-auth="'edit'" icon="el-icon-edit" @click="onEDit(scope.row)">{{ $i18n.t('EDIT') }}</el-link>
                        <span v-auth="'delete'" >
                            <el-divider direction="vertical"></el-divider>
                            <poptip
                                confirm
                                :title="$i18n.t('CONFIRM_DELETE_TIP')"
                                @on-ok="onDelete(scope.row.id)"
                                :ok-text="$i18n.t('CONFIRM')"
                                :cancel-text="$i18n.t('CANCEL')"
                            >
                                <el-link icon="el-icon-delete">{{ $i18n.t('DELETE') }}</el-link>
                            </poptip>
                        </span>
                    </template>
                </el-table-column>
            </el-table>

            <!--<el-dialog
                :title="$i18n.t('CHECK_NEWS_CONTENT')"
                :visible.sync="contentVisible"
                v-if="contentVisible"
                width="70%"
                height="1000px">
                <div>
                    <quill-editor ref="text" v-model="newsContent"  class="myQuillEditor" :options="editorOption" />
                </div>
            </el-dialog>-->
            <!-- 分页 -->
            <div class="table-pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next, ->, sizes"
                    :page-size.sync="page.perPage"
                    :page-count="page.pageCount"
                    :current-page.sync="page.currentPage"
                    :page-sizes="PAGES_SIZE"
                    @current-change="onCurrentPageChange"
                    @size-change="onPerPageChange"
                >
                </el-pagination>
            </div>
        </div>

        <el-dialog
            :title="$i18n.t('CHECK')"
            :visible.sync="contentVisible"
            v-if="contentVisible"
            destroy-on-close
            ref="dialog"
            width="70%"
            height="1000px">
            <ContentFormModal :handle-close-dialog="this.handleCloseDialog" :id="notifyId"></ContentFormModal>
        </el-dialog>

        <el-dialog
            :title="$i18n.t(mdl.id > 0 ? 'EDIT' : 'ADD')"
            :visible.sync="dialogVisible"
            destroy-on-close
        >
            <form-modal :mdl="mdl" :handle-close-drawer="handleCloseDrawer"></form-modal>
        </el-dialog>
    </div>
</template>

<script>
    import SearchForm from '@/components/SearchForm'
    import { PAGES_SIZE } from '@/config/constants'
    import { editTaskCategoryContent } from '@/api/taskCategory'
    import { getNewsList, deleteNews } from '@/api/userNotify'
    import configs from '@/config'
    import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
    import { quillEditor } from 'vue-quill-editor'
    import quillConfig from '@/config/quill-config'
    import FormModal from '@/components/news/FormModal'
    import ContentFormModal from '@/components/news/ContentFormModal'
    /* eslint-disable */
    import 'quill/dist/quill.core.css'
    import 'quill/dist/quill.snow.css'
    import 'quill/dist/quill.bubble.css'

    export default {
        name: 'task_category',
        components: { SearchForm, ElImageViewer, quillEditor, FormModal, ContentFormModal },
        data () {
            return {
                PAGES_SIZE,
                params: {},
                data: [],
                page: {
                    total: 0,
                    currentPage: 1,
                    perPage: PAGES_SIZE[0],
                    pageCount: 1
                },
                loading: false,
                config: configs,
                mdl: {},
                checkedIds: [],
                dialogVisible: false,
                editorOption: quillConfig,
                errorMessage: '',
                contentVisible: false,
                newsContent: '',
                notifyId: 0
            }
        },
        created () {
            this.fetch()
        },
        computed: {
            formItems () {
                // 用户状态筛选
                const statusOptions = [
                    { label: this.$i18n.t('NORMAL'), value: 1 },
                    { label: this.$i18n.t('DISABLED'), value: 0 }
                ]
                // 构建搜索表单
                return [
                    { title: this.$i18n.t('CATEGORY_NAME'), type: 'input', key: 'name', maxlength: 50 },
                    { title: this.$i18n.t('STATUS'), type: 'select', key: 'status', options: statusOptions }
                ]
            }
        },
        methods: {
            // 搜索按钮
            onSearch () {
                this.fetch()
            },
            // 从接口拉取数据
            fetch () {
                this.loading = true
                getNewsList({ ...this.params, page: this.page.currentPage, perPage: this.page.perPage }).then((res) => {
                    // eslint-disable-next-line camelcase
                    const { data, last_page, total } = res.result
                    this.data = data
                    this.page.total = total
                    // eslint-disable-next-line camelcase
                    this.page.pageCount = last_page
                }).finally(() => {
                    this.loading = false
                })
            },
            // 页数切换
            onCurrentPageChange (page) {
                this.page.currentPage = page
                this.fetch()
            },
            // 每页显示数量修改
            onPerPageChange (perPage) {
                this.page.perPage = perPage
                this.fetch()
            },
            // 选中的ID
            handleSelectionChange (rows) {
                this.checkedIds = rows.map(item => item.id)
            },
            checkNewsContent (row) {
                this.notifyId = row.id
                this.contentVisible = true
            },
            submit () {
                editTaskCategoryContent({ id: this.dialogId, content: this.dialogContent, type: this.dialogType }).then(() => {
                    this.$Message.success(this.$i18n.t('HANDLE_SUCCESS'))
                    this.dialogVisible = false
                    this.fetch()
                }).catch((error) => {
                    // 手动处理错误
                    if (!error.errors) {
                        this.errorMessage = error.message
                    }
                }).finally(() => {
                    this.submitLogin = false
                })
            },
            // 添加轮播广告
            onAdd () {
                this.mdl = Object.assign({}, {
                    id: 0,
                    name: '',
                    icon: '',
                    banner: '',
                    sort: '',
                    status: 1
                })
                this.dialogVisible = true
            },
            // 修改
            onEDit (row) {
                this.mdl = Object.assign({}, row)
                this.dialogVisible = true
            },
            // 删除
            onDelete (id) {
                deleteNews(id).then(() => {
                    this.$Message.success(this.$i18n.t('HANDLE_SUCCESS'))
                    setTimeout(() => {
                        this.fetch()
                    }, 500)
                })
            },
            // 关闭抽屉方法
            handleCloseDrawer () {
                this.dialogVisible = false
            },
            // 关闭抽屉方法
            handleCloseDialog () {
                this.contentVisible = false
            }
        }
    }
</script>

<style>
    .ql-editor{
        height:400px;
    }
</style>
