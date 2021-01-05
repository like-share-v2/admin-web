<template>
    <div>
        <!-- 搜索组件 -->
        <search-form :items="formItems" :params="params" :on-submit="onSearch" :btn-loading="loading" />

        <!-- 表格区域 -->
        <div class="table-body">
            <!-- 表格 -->
            <el-table border style="width: 100%;" stripe :data="data" v-loading="loading">
                <el-table-column align="center" prop="order.order_no" :label="$i18n.t('ORDER_NO')" :min-width="200" fixed="left"></el-table-column>
                <el-table-column align="center" prop="user.account" :label="$i18n.t('MEMBER_ACCOUNT')" :min-width="150"></el-table-column>
                <el-table-column align="center" prop="user.phone" :label="$i18n.t('MEMBER_PHONE')" :min-width="150"></el-table-column>
                <el-table-column align="center" prop="amount" :label="$i18n.t('PROFIT')" :min-width="100"></el-table-column>
                <el-table-column align="center" prop="record_time" :label="$i18n.t('RECORD_TIME')" :min-width="150"></el-table-column>
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
    </div>
</template>

<script>
    import SearchForm from '@/components/SearchForm'
    import { getMFIncomeList } from '@/api/mf_income'
    import { PAGES_SIZE } from '@/config/constants'

    export default {
        name: 'MfIncomeList',
        components: { SearchForm },
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
                mdl: {}
            }
        },
        created () {
            this.fetch()
        },
        computed: {
            formItems () {
                // 构建搜索表单
                return [
                    { title: this.$i18n.t('ORDER_NO'), type: 'input', key: 'order_no', maxlength: 50 },
                    { title: 'UID', type: 'input', key: 'user_id' },
                    { title: this.$i18n.t('MEMBER_ACCOUNT'), type: 'input', key: 'account', maxlength: 50 },
                    { title: this.$i18n.t('MEMBER_PHONE'), type: 'input', key: 'phone', maxlength: 50 },
                    { title: this.$i18n.t('RECORD_TIME'), type: 'date-range', key: 'record_time' }
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
                getMFIncomeList({ ...this.params, page: this.page.currentPage, perPage: this.page.perPage }).then((res) => {
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
            }
        }
    }
</script>

<style lang="less" scoped>
</style>
