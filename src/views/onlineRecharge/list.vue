<template>
    <div>
        <!-- 搜索组件 -->
        <search-form :items="formItems" :params="params" :on-submit="onSearch" :btn-loading="loading" />

        <!-- 表格区域 -->
        <div class="table-body">
            <!-- 左上角按钮 -->
            <div class="table-left-top">
                <!--                <el-button  type="primary" icon="el-icon-plus" @click="handleDownload">{{ $i18n.t('CREATE_USER_LEVEL') }}</el-button>-->
                <el-button v-auth="'export'"  type="primary"  @click="handleDownload">{{ $i18n.t('EXPORT') }}</el-button>
            </div>
            <!-- 表格 -->
            <el-table border style="width: 100%;" stripe :data="data" v-loading="loading" @selection-change="handleSelectionChange">
                <el-table-column type="selection" align="center" prop="id" label="ID" :width="50" ></el-table-column>
                <el-table-column align="center" type="expand" :label="$i18n.t('USER_TASK_INFO')"  fixed="left" :width="50">
                    <template slot-scope="scope">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item :label="$i18n.t('MEMBER_PHONE')" v-if="scope.row.user !== null">
                                {{ scope.row.user.phone }}
                            </el-form-item>
                            <el-form-item :label="$i18n.t('RECHARGE_TRADE_NO')" >
                                <span v-if="scope.row.payment.trade_no !== '' || scope.row.payment.trade_no !== null">{{ scope.row.payment.trade_no }}</span>
                                <span v-else>-</span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="user_id" :label="$i18n.t('MEMBER_ID')" :min-width="100"></el-table-column>
                <el-table-column align="center" prop="country" :label="$i18n.t('COUNTRY')" :min-width="100">
                    <template slot-scope="scope">
                        <span v-if="scope.row.country !== null">{{ scope.row.country.name_text }}</span>
                        <span v-else>-</span>
                    </template>
                </el-table-column>
                <!--                <el-table-column align="center" prop="level" :label="$i18n.t('MEMBER_LEVEL')" :min-width="100"></el-table-column>-->
                <el-table-column align="center" prop="payment" :label="$i18n.t('RECHARGE_PAY_NO')" :min-width="200">
                    <template slot-scope="scope">
                        <span v-if="scope.row.payment === null">-</span>
                        <span v-else>{{ scope.row.payment.pay_no }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="balance" :label="$i18n.t('RECHARGE_AMOUNT')" :min-width="150">
                    <template slot-scope="scope">
                        <span>{{ scope.row.amount }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="balance" :label="$i18n.t('AMOUNT_PAYABLE')" :min-width="150">
                    <template slot-scope="scope">
                        <span>{{ scope.row.amount }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="channel" :label="$i18n.t('RECHARGE_CHANNEL')" :min-width="150"></el-table-column>
                <el-table-column align="center" prop="status" :label="$i18n.t('STATUS')" :min-width="100">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status === 0">{{ $i18n.t('RECHARGE_STATUS_0') }}</span>
                        <span v-else-if="scope.row.status === 1">{{ $i18n.t('RECHARGE_STATUS_1') }}</span>
                        <span v-else>-</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="updated_at" :label="$i18n.t('RECHARGE_TIME')" :min-width="150"></el-table-column>
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
    import { getOnlineRecharge } from '@/api/onlineRecharge'
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
                    { label: this.$i18n.t('RECHARGE_STATUS_1'), value: 1 },
                    { label: this.$i18n.t('RECHARGE_STATUS_0'), value: 0 }
                ]
                // 充值渠道筛选
                const channelOptions = [
                    { label: this.$i18n.t('RECHARGE_CHANNEL_1'), value: 1 },
                    { label: this.$i18n.t('RECHARGE_CHANNEL_2'), value: 2 },
                    { label: this.$i18n.t('RECHARGE_CHANNEL_3'), value: 3 },
                    { label: this.$i18n.t('RECHARGE_CHANNEL_4'), value: 4 },
                    { label: this.$i18n.t('RECHARGE_CHANNEL_5'), value: 5 }
                ]
                // 构建搜索表单
                return [
                    { title: this.$i18n.t('MEMBER_ID'), type: 'input', key: 'user_id', maxlength: 11 },
                    { title: this.$i18n.t('COUNTRY'), type: 'select_country', key: 'country_id', options: this.countryList },
                    { title: this.$i18n.t('RECHARGE_CHANNEL'), type: 'select', key: 'channel', options: channelOptions },
                    { title: this.$i18n.t('MEMBER_PHONE'), type: 'input', key: 'user_phone', maxlength: 20 },
                    { title: this.$i18n.t('RECHARGE_PAY_NO'), type: 'input', key: 'pay_no' },
                    { title: this.$i18n.t('RECHARGE_TRADE_NO'), type: 'input', key: 'trade_no' },
                    { title: this.$i18n.t('STATUS'), type: 'select', key: 'status', options: statusOptions },
                    { title: this.$i18n.t('RECHARGE_TIME'), type: 'date-range', key: 'updated_at' }
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
                getOnlineRecharge({ ...this.params, page: this.page.currentPage, perPage: this.page.perPage }).then((res) => {
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
            }
        }
    }
</script>

<style lang="less" scoped>
</style>
