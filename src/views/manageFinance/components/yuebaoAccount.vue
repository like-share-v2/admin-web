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
                <el-table-column align="center" prop="balance" :label="$i18n.t('BALANCE')" :min-width="200"></el-table-column>
                <el-table-column align="center" prop="withdraw_time" :label="$i18n.t('WITHDRAW_TIME')" :min-width="200"></el-table-column>
                <!-- <el-table-column align="center" :label="$i18n.t('ACTION')" fixed="right" :width="200">
                    <template slot-scope="scope">
                        <el-link icon="el-icon-view" @click="onViewIncome(scope.row)">{{ $i18n.t('INCOME_RECORD') }}</el-link>
                    </template>
                </el-table-column> -->
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
    import { getAccount } from '@/api/yuebao'
    import { PAGES_SIZE } from '@/config/constants'

    export default {
        name: 'yuebaoAccount',
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
                    { title: 'UID', type: 'input', key: 'user_id' },
                    { title: this.$i18n.t('MEMBER_ACCOUNT'), type: 'input', key: 'account', maxlength: 50 },
                    { title: this.$i18n.t('MEMBER_PHONE'), type: 'input', key: 'phone', maxlength: 50 }
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
                getAccount({ ...this.params, page: this.page.currentPage, perPage: this.page.perPage }).then((res) => {
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
            // 查看收益记录
            onViewIncome (row) {
                console.log(row)
            }
        }
    }
</script>

<style lang="less" scoped>
</style>
