<template>
    <div>
        <!-- 搜索组件 -->
        <search-form :items="formItems" :params="params" :on-submit="onSearch" :btn-loading="loading" />

        <!-- 表格区域 -->
        <div class="table-body">
            <!-- 左上角按钮 -->
            <div class="table-left-top">
                <el-button v-auth="'defray'" type="primary" icon="el-icon-plus" @click="onAdd">{{ $i18n.t('DEFRAY') }}</el-button>
                <el-button v-auth="'export'"  type="primary"  @click="handleDownload">{{ $i18n.t('EXPORT') }}</el-button>
            </div>
            <!-- 表格 -->
            <el-table border style="width: 100%;" stripe :data="data" v-loading="loading" @selection-change="handleSelectionChange">
                <el-table-column align="center" prop="id" label="ID" :width="50" ></el-table-column>
                <el-table-column align="center" type="expand" :label="$i18n.t('USER_TASK_INFO')"  fixed="left" :width="50">
                    <template slot-scope="scope">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item :label="$i18n.t('WITHDRAWAL_NAME')">
                                {{ scope.row.name }}
                            </el-form-item>
                            <el-form-item :label="$i18n.t('WITHDRAWAL_ACCOUNT')">
                                {{ scope.row.bank_account }}
                            </el-form-item>
                            <el-form-item :label="$i18n.t('WITHDRAWAL_BANK')">
                                {{ scope.row.bank_name }}
                            </el-form-item>
                            <el-form-item :label="$i18n.t('OPEN_PROVINCE')">
                                {{ scope.row.open_province }}
                            </el-form-item>
                            <el-form-item :label="$i18n.t('OPEN_CITY')">
                                {{ scope.row.open_city }}
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="admin_id" :label="$i18n.t('ADMIN_ID')" :min-width="50"></el-table-column>
                <el-table-column align="center" prop="country_id" :label="$i18n.t('COUNTRY')" :min-width="100">
                    <template slot-scope="scope">
                        <span v-if="scope.row.country !== null">{{ scope.row.country.name_text }}</span>
                        <span v-else>-</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="order_no" :label="$i18n.t('RECHARGE_PAY_NO')" :min-width="200"></el-table-column>
                <!--                <el-table-column align="center" prop="level" :label="$i18n.t('MEMBER_LEVEL')" :min-width="100"></el-table-column>-->
                <el-table-column align="center" prop="AMOUNT" :label="$i18n.t('WITHDRAWAL_AMOUNT')" :min-width="100">
                    <template slot-scope="scope">
                        <span>{{ scope.row.amount }}</span>
                    </template>
                </el-table-column><el-table-column align="center" prop="AMOUNT" :label="$i18n.t('AMOUNT_PAYABLE')" :min-width="100">
                    <template slot-scope="scope">
                        <span>{{ scope.row.amount }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="channel" :label="$i18n.t('RECHARGE_CHANNEL')" :min-width="150"></el-table-column>
                <el-table-column align="center" prop="status" :label="$i18n.t('STATUS')" :min-width="100">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status === 0">{{ $i18n.t('TASK_STATUS_0') }}</span>
                        <span v-else-if="scope.row.status === 1">{{ $i18n.t('TASK_STATUS_2') }}</span>
                        <span v-else-if="scope.row.status === 2">{{ $i18n.t('TASK_STATUS_3') }}</span>
                        <span v-else>-</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="created_at" :label="$i18n.t('CREATE_TIME')" :min-width="150"></el-table-column>
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
    import FormModal from '@/components/defray/FormModal'
    import { getList } from '@/api/defray'
    import { getCountryList } from '@/api/country'
    import { onlineRechargeCsv } from '@/api/csv'

    export default {
        name: 'user_level',
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
                checkedIds: [],
                countryList: []
            }
        },
        created () {
            this.fetch()
            getCountryList().then((res) => {
                this.countryList = res.result
            })
        },
        computed: {
            formItems () {
                // 用户状态筛选
                const statusOptions = [
                    { label: this.$i18n.t('TASK_STATUS_0'), value: 0 },
                    { label: this.$i18n.t('TASK_STATUS_2'), value: 1 },
                    { label: this.$i18n.t('TASK_STATUS_3'), value: 2 }
                ]
                // 构建搜索表单
                return [
                    { title: this.$i18n.t('RECHARGE_PAY_NO'), type: 'input', key: 'order_no' },
                    { title: this.$i18n.t('ADMIN_ID'), type: 'input', key: 'admin_id', maxlength: 11 },
                    { title: this.$i18n.t('COUNTRY'), type: 'select_country', key: 'country_id', maxlength: 50, options: this.countryList },
                    { title: this.$i18n.t('CHANNEL'), type: 'input', key: 'channel' },
                    { title: this.$i18n.t('AMOUNT'), type: 'input', key: 'amount' },
                    { title: this.$i18n.t('WITHDRAWAL_NAME'), type: 'input', key: 'name' },
                    { title: this.$i18n.t('WITHDRAWAL_ACCOUNT'), type: 'input', key: 'bank_account' },
                    { title: this.$i18n.t('STATUS'), type: 'select', key: 'status', options: statusOptions },
                    { title: this.$i18n.t('CREATE_TIME'), type: 'date-range', key: 'created_at' }
                ]
            },
            isShowDivider () {
                const { meta } = this.$store.getters.router
                return meta.actions.indexOf('update') > -1 && meta.actions.indexOf('delete') > -1
            }
        },
        methods: {
            handleDownload () {
                onlineRechargeCsv().then(() => {
                    this.$Message.success(this.$i18n.t('HANDLE_SUCCESS'))
                })
            },
            // 搜索按钮
            onSearch () {
                this.fetch()
            },
            // 从接口拉取数据
            fetch () {
                this.loading = true
                getList({ ...this.params, page: this.page.currentPage, perPage: this.page.perPage }).then((res) => {
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
            },
            // 选中的ID
            handleSelectionChange (rows) {
                this.checkedIds = rows.map(item => item.id)
            },
            // 添加
            onAdd () {
                this.mdl = Object.assign({}, {
                    id: 0,
                    status: 1,
                    title: '',
                    content: '',
                    sort: 0
                })
                this.drawer = true
            }
        }
    }
</script>

<style lang="less" scoped>
</style>
