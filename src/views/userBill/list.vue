<template>
    <div>
        <!-- 搜索组件 -->
        <search-form :items="formItems" :params="params" :on-submit="onSearch" :btn-loading="loading" />

        <!-- 表格区域 -->
        <div class="table-body">
            <!-- 表格 -->
            <el-table border style="width: 100%;" stripe :data="data" v-loading="loading" >
                <el-table-column align="center" type="expand" :label="$i18n.t('MEMBER_INFO')"  fixed="left" :width="50">
                    <template slot-scope="scope">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item :label="$i18n.t('MEMBER_ACCOUNT')" v-if="scope.row.user !== null">
                                {{ scope.row.user.account }}
                            </el-form-item>
                            <el-form-item :label="$i18n.t('MEMBER_PHONE')" v-if="scope.row.user !== null">
                                {{ scope.row.user.phone }}
                            </el-form-item>
                            <el-form-item :label="$i18n.t('MEMBER_NICKNAME')" v-if="scope.row.user !== null">
                                {{ scope.row.user.nickname }}
                            </el-form-item>
                            <el-form-item :label="$i18n.t('BILL_BEFORE_BALANCE')">
                                {{ scope.row.before_balance }}
                            </el-form-item>
                            <el-form-item :label="$i18n.t('BILL_AFTER_BALANCE')">
                                {{ scope.row.after_balance }}
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="id" label="ID" :min-width="80"></el-table-column>
                <el-table-column align="center" prop="user_id" :label="$i18n.t('MEMBER_ID')" :min-width="100"></el-table-column>
                <el-table-column align="center" prop="type" :label="$i18n.t('BILL_TYPE')" :min-width="100"></el-table-column>
                <!--<el-table-column align="center" prop="way" :label="$i18n.t('BILL_TYPE')" :min-width="80">
                    <template slot-scope="scope">
                        <span v-if="scope.row.way === 1">{{ $i18n.t('BILL_TYPE_1') }}</span>
                        <span v-else-if="scope.row.way === 2">{{ $i18n.t('BILL_TYPE_2') }}</span>
                        <span v-else-if="scope.row.way === 3">{{ $i18n.t('BILL_TYPE_3') }}</span>
                        <span v-else-if="scope.row.way === 4">{{ $i18n.t('BILL_TYPE_4') }}</span>
                        <span v-else>-</span>
                    </template>
                </el-table-column>-->
<!--                <el-table-column align="center" prop="type" :label="$i18n.t('BILL_REASON')" :min-width="100"></el-table-column>-->
                <el-table-column align="center" prop="balance" :label="$i18n.t('BILL_BALANCE')" :min-width="100">
                    <template slot-scope="scope">
                        <span>{{ scope.row.balance }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="remark" :label="$i18n.t('BILL_REMARK')" :min-width="100"></el-table-column>
                <el-table-column align="center" prop="created_at" :label="$i18n.t('CREATE_TIME')" fixed="right" :min-width="150"></el-table-column>
                <!-- 右侧按钮 -->
                <el-table-column align="center" :label="$i18n.t('ACTION')" fixed="right" :width="150">
                    <template slot-scope="scope">
                        <el-link icon="el-icon-edit" @click="revoke(scope.row)">{{ $i18n.t('REVOKE') }}</el-link>
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
        <el-drawer
            :title="$i18n.t(mdl.id > 0 ? 'EDIT' : 'ADD')"
            :visible.sync="drawer"
            destroy-on-close
            ref="drawer"
            size="600px"
        >
            <form-modal :mdl="mdl" :handle-close-drawer="handleCloseDrawer"></form-modal>
        </el-drawer>
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
    import FormModal from '@/components/userLevel/FormModal'
    import { getUserBillList, cancel } from '@/api/userBill'

    export default {
        name: 'user_bill',
        components: { SearchForm, FormModal },
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
                drawer: false,
                dialogTableVisible: false,
                mdl: {},
                checkedIds: []
            }
        },
        created () {
            this.fetch()
        },
        computed: {
            formItems () {
                // 账单类型
                const wayOptions = [
                    { label: this.$i18n.t('BILL_TYPE_1'), value: 1 },
                    { label: this.$i18n.t('BILL_TYPE_2'), value: 2 },
                    { label: this.$i18n.t('BILL_TYPE_3'), value: 3 },
                    { label: this.$i18n.t('BILL_TYPE_4'), value: 4 },
                    { label: this.$i18n.t('BILL_TYPE_5'), value: 5 },
                    { label: this.$i18n.t('BILL_TYPE_6'), value: 6 },
                    { label: this.$i18n.t('BILL_TYPE_7'), value: 7 },
                    { label: this.$i18n.t('BILL_TYPE_8'), value: 8 },
                    { label: this.$i18n.t('BILL_TYPE_9'), value: 9 },
                    { label: this.$i18n.t('BILL_TYPE_10'), value: 10 },
                    { label: this.$i18n.t('BILL_TYPE_11'), value: 11 },
                    { label: this.$i18n.t('BILL_TYPE_12'), value: 12 }
                ]
                // 构建搜索表单
                return [
                    { title: this.$i18n.t('MEMBER_ID'), type: 'input', key: 'user_id', maxlength: 11 },
                    { title: this.$i18n.t('BILL_TYPE'), type: 'select', key: 'type', options: wayOptions },
                    { title: this.$i18n.t('MEMBER_ACCOUNT'), type: 'input', key: 'user_account', maxlength: 50 },
                    { title: this.$i18n.t('MEMBER_PHONE'), type: 'input', key: 'user_phone', maxlength: 20 },
                    { title: this.$i18n.t('CREATE_TIME'), type: 'date-range', key: 'create_time' }
                ]
            },
            isShowDivider () {
                const { meta } = this.$store.getters.router
                return meta.actions.indexOf('update') > -1 && meta.actions.indexOf('delete') > -1
            }
        },
        methods: {
            revoke (row) {
                // 设置手动接管message提示
                this.$store.dispatch('MessageTake', true)
                cancel({ id: row.id }).then(() => {
                    this.$Message.success(this.$i18n.t('HANDLE_SUCCESS'))
                    this.fetch()
                }).catch((error) => {
                    this.$Message.error(error.message)
                })
            },
            // 搜索按钮
            onSearch () {
                this.fetch()
            },
            // 从接口拉取数据
            fetch () {
                this.loading = true
                getUserBillList({ ...this.params, page: this.page.currentPage, perPage: this.page.perPage }).then((res) => {
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
            // 关闭抽屉方法
            handleCloseDrawer () {
                this.$refs.drawer.closeDrawer()
            }
        }
    }
</script>

<style lang="less" scoped>
</style>
