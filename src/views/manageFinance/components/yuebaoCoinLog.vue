<template>
    <div>
        <!-- 搜索组件 -->
        <search-form :items="formItems" :params="params" :on-submit="onSearch" :btn-loading="loading" />

        <!-- 表格区域 -->
        <div class="table-body">
            <!-- 表格 -->
            <el-table border style="width: 100%;" stripe :data="data" v-loading="loading">
                <el-table-column align="center" prop="user_id" label="UID" :min-width="200"></el-table-column>
                <el-table-column align="center" prop="user.account" :label="$i18n.t('MEMBER_ACCOUNT')" :min-width="200"></el-table-column>
                <el-table-column align="center" prop="user.phone" :label="$i18n.t('MEMBER_PHONE')" :min-width="200"></el-table-column>
                <el-table-column align="center" prop="type" :label="$i18n.t('COIN_LOG_TYPE')" :min-width="200">
                    <template slot-scope="scope">
                        <span v-if="scope.row.type === 1" type="warning">{{ $i18n.t('TRANSFER_IN') }}</span>
                        <span v-if="scope.row.type === 2" type="primary">{{ $i18n.t('TRANSFER_OUT') }}</span>
                        <span v-if="scope.row.type === 3" type="success">{{ $i18n.t('PROFIT') }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="amount" :label="$i18n.t('AMOUNT')" :min-width="200"></el-table-column>
                <el-table-column align="center" prop="balance" :label="$i18n.t('BALANCE')" :min-width="200"></el-table-column>
                <el-table-column align="center" prop="record_time" :label="$i18n.t('RECORD_TIME')" :min-width="200"></el-table-column>
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
    import { getCoinLog } from '@/api/yuebao'
    import { PAGES_SIZE } from '@/config/constants'

    export default {
        name: 'yuebaoCoinLog',
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
                // 是否启用
                const isEnableOptions = [
                    { label: this.$i18n.t('TRANSFER_IN'), value: 1 },
                    { label: this.$i18n.t('TRANSFER_OUT'), value: 2 },
                    { label: this.$i18n.t('PROFIT'), value: 3 }
                ]
                // 构建搜索表单
                return [
                    { title: 'UID', type: 'input', key: 'user_id' },
                    { title: this.$i18n.t('MEMBER_ACCOUNT'), type: 'input', key: 'account', maxlength: 50 },
                    { title: this.$i18n.t('MEMBER_PHONE'), type: 'input', key: 'phone', maxlength: 50 },
                    { title: this.$i18n.t('COIN_LOG_TYPE'), type: 'select', key: 'type', options: isEnableOptions },
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
                getCoinLog({ ...this.params, page: this.page.currentPage, perPage: this.page.perPage }).then((res) => {
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
