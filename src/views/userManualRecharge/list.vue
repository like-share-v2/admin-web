<template>
    <div>
        <el-tabs v-model="activeType" type="card" @tab-click="handleClick">
            <el-tab-pane :label="$i18n.t('ALL') + '(' + total_count + ')'" name="3"></el-tab-pane>
            <el-tab-pane :label="$i18n.t('USER_MANUAL_RECHARGE_STATUS_0') + '(' + audit_count + ')'" name="0"></el-tab-pane>
            <el-tab-pane :label="$i18n.t('USER_MANUAL_RECHARGE_STATUS_1') + '(' + pass_count + ')'" name="1"></el-tab-pane>
            <el-tab-pane :label="$i18n.t('USER_MANUAL_RECHARGE_STATUS_2') + '(' + refuse_count + ')'" name="2"></el-tab-pane>
        </el-tabs>
        <!-- 搜索组件 -->
        <search-form :items="formItems" :params="params" :on-submit="onSearch" :btn-loading="loading" />

        <!-- 表格区域 -->
        <div class="table-body">
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
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="user_id" :label="$i18n.t('MEMBER_ID')" :min-width="100"></el-table-column>
                <el-table-column align="center" prop="amount" :label="$i18n.t('LEVEL_PRICE')" :min-width="100"></el-table-column>
                <el-table-column align="center" prop="trade_no" :label="$i18n.t('RECHARGE_TRADE_NO')" :min-width="200"></el-table-column>
                <el-table-column align="center" prop="status" :label="$i18n.t('STATUS')" :min-width="100">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status === 0" type="info">{{ $i18n.t('USER_MANUAL_RECHARGE_STATUS_0') }}</el-tag>
                        <el-tag v-else-if="scope.row.status === 1" type="success">{{ $i18n.t('USER_MANUAL_RECHARGE_STATUS_1') }}</el-tag>
                        <el-tag v-else-if="scope.row.status === 2" type="danger">{{ $i18n.t('USER_MANUAL_RECHARGE_STATUS_2') }}</el-tag>
                        <el-tag v-else>-</el-tag>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="created_at" :label="$i18n.t('CREATE_TIME')" :min-width="150"></el-table-column>
                <!-- 右侧按钮 -->
                <el-table-column align="center" :label="$i18n.t('ACTION')" fixed="right" :width="200">
                    <template slot-scope="scope">
                        <el-link v-auth="'audit'" icon="el-icon-s-check" @click="onAudit(scope.row)" v-if="scope.row.status === 0">{{ $i18n.t('AUDIT') }}</el-link>
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
    import { getUserLevels } from '@/api/userLevel'
    import FormModal from '@/components/userManualRecharge/FormModal'
    import { getUserManualRechargeList } from '@/api/userManalRecharge'

    export default {
        name: 'user_level',
        components: { SearchForm, FormModal },
        data () {
            return {
                PAGES_SIZE,
                params: {
                    type: 3
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
                userLevelList: [],
                activeType: '3',
                audit_count: 0,
                pass_count: 0,
                refuse_count: 0,
                total_count: 0
            }
        },
        created () {
            this.fetch()
            getUserLevels().then((res) => {
                this.userLevelList = res.result
            })
        },
        computed: {
            formItems () {
                // 用户状态筛选
                const statusOptions = [
                    { label: this.$i18n.t('USER_MANUAL_RECHARGE_STATUS_0'), value: 0 },
                    { label: this.$i18n.t('USER_MANUAL_RECHARGE_STATUS_1'), value: 1 },
                    { label: this.$i18n.t('USER_MANUAL_RECHARGE_STATUS_2'), value: 2 }
                ]
                // 构建搜索表单
                return [
                    { title: this.$i18n.t('MEMBER_ID'), type: 'input', key: 'user_id', maxlength: 11 },
                    { title: this.$i18n.t('MEMBER_LEVEL'), type: 'select_level', key: 'level', options: this.userLevelList },
                    { title: this.$i18n.t('ACCOUNT'), type: 'input', key: 'user_account', maxlength: 50 },
                    { title: this.$i18n.t('PHONE'), type: 'input', key: 'user_phone', maxlength: 50 },
                    { title: this.$i18n.t('RECHARGE_TRADE_NO'), type: 'input', key: 'trade_no' },
                    { title: this.$i18n.t('ADMIN_ID'), type: 'input', key: 'admin_id', maxlength: 20 },
                    { title: this.$i18n.t('STATUS'), type: 'select', key: 'status', options: statusOptions }
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
                getUserManualRechargeList({ ...this.params, page: this.page.currentPage, perPage: this.page.perPage }).then((res) => {
                    // eslint-disable-next-line camelcase
                    const { data, last_page, total, audit_count, pass_count, refuse_count } = res.result
                    this.data = data
                    this.page.total = total
                    // eslint-disable-next-line camelcase
                    this.page.pageCount = last_page
                    // eslint-disable-next-line camelcase
                    this.audit_count = audit_count
                    // eslint-disable-next-line camelcase
                    this.pass_count = pass_count
                    // eslint-disable-next-line camelcase
                    this.refuse_count = refuse_count
                    // eslint-disable-next-line camelcase
                    this.total_count = audit_count + pass_count + refuse_count
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
            // 修改
            onAudit (row) {
                this.mdl = Object.assign({}, row)
                this.mdl.status = ''
                this.mdl.isCheck = false
                this.dialog = true
            },
            onCheck (row) {
                this.mdl = Object.assign({}, row)
                this.mdl.isCheck = true
                this.dialog = true
            },
            handleClick (tab, event) {
                this.params.type = this.activeType
                this.fetch()
            }
        }
    }
</script>

<style lang="less" scoped>
</style>
