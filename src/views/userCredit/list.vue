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
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="user_id" :label="$i18n.t('MEMBER_ID')" :min-width="100"></el-table-column>
                <el-table-column align="center" prop="type" :label="$i18n.t('BILL_REASON')" :min-width="100"></el-table-column>
                <el-table-column align="center" prop="credit" :label="$i18n.t('CREDIT_AMOUNT')" :min-width="150"></el-table-column>
                <el-table-column align="center" prop="remark" :label="$i18n.t('CREDIT_REMARK')" :min-width="100"></el-table-column>
                <el-table-column align="center" prop="created_at" :label="$i18n.t('CREATE_TIME')" fixed="right" :min-width="150"></el-table-column>
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
    import { getUserCreditList } from '@/api/userCredit'

    export default {
        name: 'user_credit',
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
                const typeOptions = [
                    { label: this.$i18n.t('CREDIT_RECORD_TYPE_1'), value: 1 },
                    { label: this.$i18n.t('CREDIT_RECORD_TYPE_2'), value: 2 },
                    { label: this.$i18n.t('CREDIT_RECORD_TYPE_3'), value: 3 },
                    { label: this.$i18n.t('CREDIT_RECORD_TYPE_4'), value: 4 }
                ]

                // 构建搜索表单
                return [
                    { title: this.$i18n.t('MEMBER_ID'), type: 'input', key: 'user_id', maxlength: 11 },
                    { title: this.$i18n.t('MEMBER_ACCOUNT'), type: 'input', key: 'user_account', maxlength: 50 },
                    { title: this.$i18n.t('MEMBER_PHONE'), type: 'input', key: 'user_phone', maxlength: 20 },
                    { title: this.$i18n.t('BILL_REASON'), type: 'select', key: 'way', options: typeOptions },
                    { title: this.$i18n.t('CREATE_TIME'), type: 'date-range', key: 'create_time' }
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
                getUserCreditList({ ...this.params, page: this.page.currentPage, perPage: this.page.perPage }).then((res) => {
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
