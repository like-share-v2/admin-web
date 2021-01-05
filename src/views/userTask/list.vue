<template>
    <div>
        <el-tabs v-model="activeType" type="card" @tab-click="handleClick">
            <el-tab-pane :label="$i18n.t('ALL') + '(' + total_count + ')'" name="0"></el-tab-pane>
            <el-tab-pane :label="$i18n.t('TASK_STATUS_0') + '(' + progress_count + ')'" name="1"></el-tab-pane>
            <el-tab-pane :label="$i18n.t('TASK_STATUS_1') + '(' + audit_count + ')'" name="2"></el-tab-pane>
            <el-tab-pane :label="$i18n.t('AUDITED') + '(' + approved_count + ')'" name="3"></el-tab-pane>
            <el-tab-pane :label="$i18n.t('TASK_STATUS_4') + '(' + cancelled_count + ')'" name="4"></el-tab-pane>
        </el-tabs>
        <!-- 搜索组件 -->
        <search-form :items="formItems" :params="params" :on-submit="onSearch" :btn-loading="loading" />

        <!-- 表格区域 -->
        <div class="table-body">
            <!-- 左上角按钮 -->
            <div class="table-left-top">
                <el-button v-auth="'enable'" type="success" icon="el-icon-circle-check" :disabled="checkedIds.length === 0" @click="onEnable()">{{ $i18n.t('ENABLE') }}</el-button>
                <el-button v-auth="'disable'" type="warning" icon="el-icon-custom-disable" :disabled="checkedIds.length === 0" @click="onDisable()">{{ $i18n.t('DISABLE') }}</el-button>
                <el-button v-auth="'delete'" type="danger" icon="el-icon-delete" :disabled="checkedIds.length === 0" @click="onDelete(checkedIds)">{{ $i18n.t('DELETE') }}</el-button>
                <el-button v-auth="'audit_batch_pass'" type="success" icon="el-icon-circle-check" @click="onAuditUserTaskAll()">{{ $i18n.t('AUDIT_BATCH_PASS') }}</el-button>
            </div>

            <!-- 表格 -->
            <el-table border style="width: 100%;" stripe :data="data" v-loading="loading">
                <el-table-column align="center" type="expand" :label="$i18n.t('USER_TASK_INFO')"  fixed="left" :width="50">
                    <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item :label="$i18n.t('MEMBER_ACCOUNT')" v-if="props.row.user !== null">
                                <span>{{ props.row.user.account }}</span>
                            </el-form-item>
                            <el-form-item :label="$i18n.t('MEMBER_PHONE')" v-if="props.row.user !== null">
                                <span>{{ props.row.user.phone }}</span>
                            </el-form-item>
                            <el-form-item :label="$i18n.t('TASK_CATEGORY')" v-if="props.row.task !== null">
                                <span>{{ props.row.task.category.name_text }}</span>
                            </el-form-item>
                            <!--
                            <el-form-item :label="$i18n.t('TASK_TITLE')" v-if="props.row.task !== null">
                                <span>{{ props.row.task.title }}</span>
                            </el-form-item>
                            -->
                            <el-form-item :label="$i18n.t('TASK_DESCRIPTION')" v-if="props.row.task !== null">
                                <span>{{ props.row.task.description }}</span>
                            </el-form-item>
                            <el-form-item :label="$i18n.t('TASK_URL')" v-if="props.row.task !== null">
                                <el-link :href="props.row.task.url" target="_blank" type="primary" icon="el-icon-link">{{ $i18n.t('CLICK_TO_VIEW') }}</el-link>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="user_id" :label="$i18n.t('MEMBER_ID')" :min-width="100"></el-table-column>
                <el-table-column align="center" prop="task_id" :label="$i18n.t('TASK_ID')" :min-width="100"></el-table-column>
                <el-table-column align="center" prop="amount" :label="$i18n.t('TASK_AMOUNT')" :min-width="150">
                    <template slot-scope="scope">
                        {{ scope.row.amount }}
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="status" :label="$i18n.t('STATUS')" :min-width="100">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status === 0" type="info">{{ $i18n.t('TASK_STATUS_0') }}</el-tag>
                        <el-tag v-else-if="scope.row.status === 1" >{{ $i18n.t('TASK_STATUS_1') }}</el-tag>
                        <el-tag v-else-if="scope.row.status === 2" type="success">{{ $i18n.t('TASK_STATUS_2') }}</el-tag>
                        <el-tag v-else-if="scope.row.status === 3" type="danger">{{ $i18n.t('TASK_STATUS_3') }}</el-tag>
                        <el-tag v-else-if="scope.row.status === 4" type="warning">{{ $i18n.t('TASK_STATUS_4') }}</el-tag>
                        <el-tag v-else>-</el-tag>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="created_at" :label="$i18n.t('USER_TASK_CREATE_TIME')" :min-width="150"></el-table-column>
                <el-table-column align="center" prop="cancel_time" :label="$i18n.t('CANCEL_TIME')" :min-width="100" v-if="params.type === '4'"></el-table-column>
                <el-table-column align="center" prop="audit_time" :label="$i18n.t('USER_TASK_AUDIT_TIME')" :min-width="150" v-if="params.type === '3'"></el-table-column>
                <el-table-column align="center" prop="admin_id" :label="$i18n.t('ADMIN_ID')" :min-width="150" v-if="params.type === '3'"></el-table-column>
                <el-table-column align="center" prop="remark" :label="$i18n.t('REMARK')" :min-width="150" v-if="params.type === '3'"></el-table-column>
                <!-- 右侧按钮 -->
                <el-table-column align="center" :label="$i18n.t('ACTION')" fixed="right" :width="200" v-if="params.type === '2' || params.type === '3'">
                    <template slot-scope="scope">
                        <el-link v-auth="'audit'" icon="el-icon-s-check" @click="onAudit(scope.row)" v-if="params.type === '2'">{{ $i18n.t('AUDIT') }}</el-link>
                        <el-link v-auth="'check'" icon="el-icon-search" @click="onCheck(scope.row)" v-else>{{ $i18n.t('CHECK') }}</el-link>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <div class="table-pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next, ->, sizes"
                    :page-size.sync="page.perPage"
                    :total="page.total"
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
            :title="$i18n.t('AUDIT')"
            :visible.sync="dialog"
            destroy-on-close
            ref="dialog"
        >
            <form-modal :mdl="mdl" :handle-close-drawer="handleCloseDialog"></form-modal>
        </el-dialog>
    </div>
</template>
<style>
    .demo-table-expand {
        font-size: 0;
    }
    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }
    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }
</style>
<script>
    import SearchForm from '@/components/SearchForm'
    import { PAGES_SIZE } from '@/config/constants'
    import FormModal from '@/components/userTask/FormModal'
    import { enableTasks, disableTasks, deleteTasks } from '@/api/task'
    import { getUserTasks, auditUserTaskAll } from '@/api/userTask'

    export default {
        name: 'user_level',
        components: { SearchForm, FormModal },
        data () {
            return {
                PAGES_SIZE,
                params: {
                    type: 0
                },
                data: [],
                page: {
                    total: 0,
                    currentPage: 1,
                    perPage: PAGES_SIZE[0],
                    pageCount: 1
                },
                loading: false,
                dialog: false,
                mdl: {},
                checkedIds: [],
                activeType: '0',
                progress_count: 0,
                audit_count: 0,
                approved_count: 0,
                cancelled_count: 0,
                total_count: 0
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
                    { title: this.$i18n.t('MEMBER_ID'), type: 'input', key: 'user_id', maxlength: 11 },
                    { title: this.$i18n.t('ACCOUNT'), type: 'input', key: 'user_account', maxlength: 50 },
                    { title: this.$i18n.t('PHONE'), type: 'input', key: 'user_phone', maxlength: 50 },
                    { title: this.$i18n.t('STATUS'), type: 'select', key: 'status', options: statusOptions },
                    { title: this.$i18n.t('TASK_ID'), type: 'input', key: 'task_id' },
                    { title: this.$i18n.t('ADMIN_ID'), type: 'input', key: 'admin_id' },
                    { title: this.$i18n.t('CREATE_TIME'), type: 'date-range', key: 'created_at' }
                ]
            },
            isShowDivider () {
                const { meta } = this.$store.getters.router
                return meta.actions.indexOf('update') > -1 && meta.actions.indexOf('delete') > -1
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
                getUserTasks({ ...this.params, page: this.page.currentPage, perPage: this.page.perPage }).then((res) => {
                    // eslint-disable-next-line camelcase
                    const { data, last_page, total, progress_count, audit_count, approved_count, cancelled_count } = res.result
                    this.data = data
                    this.page.total = total
                    // eslint-disable-next-line camelcase
                    this.page.pageCount = last_page
                    // eslint-disable-next-line camelcase
                    this.progress_count = progress_count
                    // eslint-disable-next-line camelcase
                    this.audit_count = audit_count
                    // eslint-disable-next-line camelcase
                    this.approved_count = approved_count
                    // eslint-disable-next-line camelcase
                    this.cancelled_count = cancelled_count
                    // eslint-disable-next-line camelcase
                    this.total_count = progress_count + audit_count + approved_count + cancelled_count
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
            // 关闭对话框方法
            handleCloseDialog () {
                this.dialog = false
            },
            // 选中的ID
            handleSelectionChange (rows) {
                this.checkedIds = rows.map(item => item.id)
            },
            // 删除
            onDelete (ids) {
                deleteTasks(ids.join(',')).then(() => {
                    this.$Message.success(this.$i18n.t('HANDLE_SUCCESS'))
                    setTimeout(() => {
                        this.fetch()
                    }, 500)
                })
            },
            // 修改
            onAudit (row) {
                this.mdl = Object.assign({}, row)
                this.mdl.status = ''
                this.mdl.isCheck = false
                this.dialog = true
            },
            // 启用选中
            onEnable () {
                enableTasks(this.checkedIds.join(',')).then(() => {
                    this.$Message.success(this.$i18n.t('HANDLE_SUCCESS'))
                    setTimeout(() => {
                        this.fetch()
                    }, 500)
                })
            },
            // 禁用选中
            onDisable () {
                disableTasks(this.checkedIds.join(',')).then(() => {
                    this.$Message.success(this.$i18n.t('HANDLE_SUCCESS'))
                    setTimeout(() => {
                        this.fetch()
                    }, 500)
                })
            },
            handleClick (tab, event) {
                this.params.type = this.activeType
                this.fetch()
            },
            onCheck (row) {
                this.mdl = Object.assign({}, row)
                this.mdl.isCheck = true
                this.dialog = true
            },
            onAuditUserTaskAll () {
                this.loading = true
                auditUserTaskAll().then(() => {
                    this.$Message.success(this.$i18n.t('AUDIT_BATCH_PASS_SUCCESS'))
                    this.fetch()
                }).catch(() => {
                    this.fetch()
                })
            }
        }
    }
</script>

<style lang="less" scoped>
</style>
