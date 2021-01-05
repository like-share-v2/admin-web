<template>
    <div>
        <!-- 搜索组件 -->
        <search-form :items="formItems" :params="params" :on-submit="onSearch" :btn-loading="loading" />

        <!-- 表格区域 -->
        <div class="table-body">
            <!-- 表格 -->
            <el-table border style="width: 100%;" stripe :data="data" v-loading="loading">
                <el-table-column align="center" prop="order_no" :label="$i18n.t('ORDER_NO')" :min-width="200" fixed="left"></el-table-column>
                <el-table-column align="center" prop="user.account" :label="$i18n.t('MEMBER_ACCOUNT')" :min-width="150"></el-table-column>
                <el-table-column align="center" prop="user.phone" :label="$i18n.t('MEMBER_PHONE')" :min-width="150"></el-table-column>
                <el-table-column align="center" prop="mode_title" :label="$i18n.t('MF_TITLE')" :min-width="200"></el-table-column>
                <el-table-column align="center" prop="daily_interest_rate" :label="$i18n.t('DAILY_INTEREST_RATE')" :min-width="100">
                    <template slot-scope="scope">
                        {{ (scope.row.daily_interest_rate * 100).toFixed(2) }}%
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="mode" :label="$i18n.t('MF_MODE')" :min-width="100">
                    <template slot-scope="scope">
                        <span v-if="scope.row.mode === 1">{{ $i18n.t('MF_MODE_1') }}</span>
                        <span v-if="scope.row.mode === 2">{{ $i18n.t('MF_MODE_2') }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="income_mode" :label="$i18n.t('MF_INCOME_MODE')" :min-width="100">
                    <template slot-scope="scope">
                        <span v-if="scope.row.income_mode === 1">{{ $i18n.t('MF_INCOME_MODE_1') }}</span>
                        <span v-if="scope.row.income_mode === 2">{{ $i18n.t('MF_INCOME_MODE_2') }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="amount" :label="$i18n.t('COST_AMOUNT')" :min-width="100"></el-table-column>
                <el-table-column align="center" prop="profit" :label="$i18n.t('PROFIT')" :min-width="100"></el-table-column>
                <el-table-column align="center" prop="unfreeze_time" :label="$i18n.t('UNFREEZE_TIME')" :min-width="150"></el-table-column>
                <el-table-column align="center" prop="settle_time" :label="$i18n.t('SETTLE_TIME')" :min-width="150"></el-table-column>
                <el-table-column align="center" prop="created_at" :label="$i18n.t('BUY_TIME')" :min-width="150"></el-table-column>
                <el-table-column align="center" prop="is_settle" :label="$i18n.t('IS_SETTLE')" :min-width="150" fixed="right">
                    <template slot-scope="scope">
                        <el-tag v-if="!scope.row.is_settle" type="success">{{ $i18n.t('NO_SETTLE') }}</el-tag>
                        <el-tag v-else type="info">{{ $i18n.t('SETTLED') }}</el-tag>
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
    </div>
</template>

<script>
    import SearchForm from '@/components/SearchForm'
    import { getMFOrderList } from '@/api/mf_order'
    import { PAGES_SIZE } from '@/config/constants'

    export default {
        name: 'MfOrderList',
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
                // 投资模式
                const modeOptions = [
                    { label: this.$i18n.t('MF_MODE_1'), value: 1 },
                    { label: this.$i18n.t('MF_MODE_2'), value: 2 }
                ]
                // 收益模式
                const incomeModeOptions = [
                    { label: this.$i18n.t('MF_INCOME_MODE_1'), value: 1 },
                    { label: this.$i18n.t('MF_INCOME_MODE_2'), value: 2 }
                ]
                // 是否结算
                const isEnableOptions = [
                    { label: this.$i18n.t('SETTLED'), value: 1 },
                    { label: this.$i18n.t('NO_SETTLE'), value: 0 }
                ]
                // 构建搜索表单
                return [
                    { title: this.$i18n.t('ORDER_NO'), type: 'input', key: 'order_no', maxlength: 50 },
                    { title: 'UID', type: 'input', key: 'user_id' },
                    { title: this.$i18n.t('MEMBER_ACCOUNT'), type: 'input', key: 'account', maxlength: 50 },
                    { title: this.$i18n.t('MEMBER_PHONE'), type: 'input', key: 'phone', maxlength: 50 },
                    { title: this.$i18n.t('MF_TITLE'), type: 'input', key: 'title', maxlength: 50 },
                    { title: this.$i18n.t('MF_MODE'), type: 'select', key: 'mode', options: modeOptions },
                    { title: this.$i18n.t('MF_INCOME_MODE'), type: 'select', key: 'income_mode', options: incomeModeOptions },
                    { title: this.$i18n.t('IS_SETTLE'), type: 'select', key: 'is_settle', options: isEnableOptions },
                    { title: this.$i18n.t('SETTLE_TIME'), type: 'date-range', key: 'settle_time' },
                    { title: this.$i18n.t('BUY_TIME'), type: 'date-range', key: 'created_at' },
                    { title: this.$i18n.t('UNFREEZE_TIME'), type: 'date-range', key: 'unfreeze_time' }
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
                getMFOrderList({ ...this.params, page: this.page.currentPage, perPage: this.page.perPage }).then((res) => {
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
