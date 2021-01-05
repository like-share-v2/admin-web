<template>
    <div>
        <!-- 搜索组件 -->
<!--        <search-form :items="formItems" :params="params" :on-submit="onSearch" :btn-loading="loading" />-->

        <!-- 表格区域 -->
        <div class="table-body">
            <!-- 表格 -->
            <el-table border style="width: 100%;" stripe :data="data" v-loading="loading" row-key="id" @selection-change="handleSelectionChange">
                <el-table-column align="center" prop="user_id" label="ID" :width="80" fixed="left"></el-table-column>
                <el-table-column align="center" prop="level" :label="$i18n.t('MEMBER_LEVEL')" :min-width="80"></el-table-column>
                <el-table-column align="center" prop="user_level" :label="$i18n.t('LEVEL_NAME')" :min-width="100">
                    <template slot-scope="scope">
                        <span v-if="scope.row.user_level !== null">{{ scope.row.user_level.name_text }}</span>
                        <span v-else>-</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="created_at" :label="$i18n.t('CREATE_TIME')" :min-width="170"></el-table-column>
                <el-table-column align="center" prop="effective_time" :label="$i18n.t('EFFECTIVE_TIME')" :min-width="170">
                    <template slot-scope="scope">
                        <el-link v-if="scope.row.level === -1" disabled>{{ scope.row.effective_time }}</el-link>
                        <el-link v-else @click="onEditEffectiveTime(scope.row)">{{ scope.row.effective_time }}</el-link>
                    </template>
                </el-table-column>
<!--                <el-table-column align="center" sortable prop="created_at" :label="$i18n.t('CREATE_TIME')" :min-width="170"></el-table-column>-->
            </el-table>

            <div>
                <el-image-viewer v-if="isShowPictures" :on-close="() => { isShowPictures = false }" :url-list="picture">
                </el-image-viewer>
            </div>

            <!-- 分页 -->
            <!--<div class="table-pagination" style="margin-top: 0">
                <el-pagination
                    background
                    layout="total, prev, pager, next, ->, sizes"
                    :page-size.sync="page.perPage"
                    :page-count="page.pageCount"
                    :current-page.sync="page.currentPage"
                    :page-sizes="[10, 30, 50, 100]"
                    :total="page.total"
                    @current-change="onCurrentPageChange"
                    @size-change="onPerPageChange"
                >
                </el-pagination>
            </div>-->
        </div>

        <el-drawer
            :title="$i18n.t(mdl.id > 0 ? 'EDIT' : 'ADD')"
            :visible.sync="drawer"
            destroy-on-close
            ref="drawer"
            size="600px"
        >
            <form-modal :mdl="mdl" :handle-close-drawer="handleCloseDrawer"></form-modal>
        </el-drawer>
        <el-dialog
            :title="$i18n.t('EDIT_EFFECTIVE_TIME')"
            :visible.sync="effectiveTimeVisible"
            :destroy-on-close="true"
            v-if="effectiveTimeVisible"
            append-to-body
        >
            <effective-time-form-modal :mdl="user" :handle-close-dialog="handleCloseEffectiveTimeDialog"></effective-time-form-modal>
        </el-dialog>

        <br/>
        <br/>
    </div>
</template>

<script>
    import { PAGES_SIZE } from '@/config/constants'
    import { getUserMember } from '@/api/member'
    import configs from '@/config'
    import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
    import FormModal from '@/components/country/FormModal'
    import EffectiveTimeFormModal from '@/components/member/EffectiveTimeFormModal'

    export default {
        name: 'country',
        components: { ElImageViewer, FormModal, EffectiveTimeFormModal },
        props: {
            mdl: {
                type: Object,
                required: true
            }
        },
        data () {
            return {
                PAGES_SIZE,
                params: {
                    parent_id: this.mdl.id
                },
                data: [],
                page: {
                    total: 0,
                    currentPage: 1,
                    perPage: PAGES_SIZE[0],
                    pageCount: 1
                },
                loading: false,
                config: configs,
                isShowPictures: false,
                picture: [],
                drawer: false,
                checkedIds: [],
                dialogVisible: false,
                dialogContent: '',
                dialogTitle: '',
                dialogId: 0,
                dialogType: 0,
                errorMessage: '',
                teamLevel: [],
                effectiveTimeVisible: false,
                user: {}
            }
        },
        created () {
            this.fetch()
        },
        computed: {
            formItems () {
                // 用户状态筛选
                /* const statusOptions = [
                    { label: this.$i18n.t('NORMAL'), value: 1 },
                    { label: this.$i18n.t('DISABLED'), value: 0 }
                ] */
                // 构建搜索表单
                return [
                    { title: this.$i18n.t('TEAM_LEVEL'), type: 'select_team_level', key: 'level', maxlength: 100, options: this.teamLevel }
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
                getUserMember({ id: this.mdl.id }).then((res) => {
                    // eslint-disable-next-line camelcase
                    this.data = res.result
                    console.log(this.data)
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
            checkPicture (picture) {
                this.isShowPictures = true

                this.picture[0] = this.config.staticUrl + picture
            },
            // 选中的ID
            handleSelectionChange (rows) {
                this.checkedIds = rows.map(item => item.id)
            },
            // 对话框关闭
            handleClose (done) {
                this.$confirm('确认关闭？').then(_ => { done() }).catch(_ => {})
            },
            checkJobStep (row, type) {
                if (type === 1) {
                    this.dialogTitle = '任务步骤'
                    this.dialogContent = row.job_step
                } else {
                    this.dialogTitle = '审核样例'
                    this.dialogContent = row.audit_sample
                }
                this.dialogType = type
                this.dialogId = row.id
                this.dialogVisible = true
            },
            submit () {
            },
            // 启用选中
            onEnable () {
            },
            // 禁用选中
            onDisable () {
            },
            // 添加轮播广告
            onAdd () {
                this.mdl = Object.assign({}, {
                    id: 0,
                    name: '',
                    icon: '',
                    image: '',
                    sort: '',
                    status: 1
                })
                this.drawer = true
            },
            // 关闭抽屉方法
            handleCloseDrawer () {
                this.$refs.drawer.closeDrawer()
            },
            onEditEffectiveTime (row) {
                this.user = Object.assign({}, row)
                this.effectiveTimeVisible = true
            },
            handleCloseEffectiveTimeDialog () {
                this.effectiveTimeVisible = false
            }
        }
    }
</script>

<style>
    .ql-editor{
        height:400px;
    }
</style>
