<template>
    <div>
        <!-- 搜索组件 -->
        <search-form :items="formItems" :params="params" :on-submit="onSearch" :btn-loading="loading" />

        <!-- 表格区域 -->
        <div class="table-body">
            <!-- 左上角按钮 -->
            <div class="table-left-top">
                <el-button v-auth="'add'" type="primary" icon="el-icon-plus" @click="onAdd">{{ $i18n.t('CREATE_USER_ACCOUNT') }}</el-button>
                <el-button v-auth="'export'"  type="primary"  @click="handleDownload">{{ $i18n.t('EXPORT') }}</el-button>

                <!--                <el-button v-auth="'enable'" type="success" icon="el-icon-circle-check" :disabled="checkedIds.length === 0" @click="onEnable()">{{ $i18n.t('ENABLE') }}</el-button>-->
<!--                <el-button v-auth="'disable'" type="warning" icon="el-icon-custom-disable" :disabled="checkedIds.length === 0" @click="onDisable()">{{ $i18n.t('DISABLE') }}</el-button>-->
            </div>

            <!-- 表格 -->
            <el-table border style="width: 100%;" stripe :data="data" v-loading="loading" @selection-change="handleSelectionChange">
<!--                <el-table-column type="selection" align="center" prop="id" label="ID" :width="50" ></el-table-column>-->
                <!--<el-table-column align="center" type="expand" label=""  fixed="left" :width="50">
                    <template slot-scope="scope">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item label="ip">
                                {{ scope.row.ip }}
                            </el-form-item>
                            <el-form-item :label="$i18n.t('NICKNAME')">
                                {{ scope.row.nickname }}
                            </el-form-item>
                            <el-form-item :label="$i18n.t('GENDER')">
                                <el-tag v-if="scope.row.gender === 1">{{ $i18n.t('MALE') }}</el-tag>
                                <el-tag v-else-if="scope.row.gender === 2">{{ $i18n.t('FEMALE') }}</el-tag>
                                <el-tag v-else>{{ $i18n.t('SECRET') }}</el-tag>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>-->
                <el-table-column align="center" sortable prop="id" label="ID" :width="100" fixed="left"></el-table-column>
                <el-table-column align="center" prop="parent_id" :label="$i18n.t('PARENT_ID')" :min-width="50">
                    <template slot-scope="scope">
                        <el-link @click="onChangeParentId(scope.row)">{{ scope.row.parent_id }}</el-link>
                    </template>
                </el-table-column>
                <!--<el-table-column align="center" prop="country_id" :label="$i18n.t('COUNTRY')" :min-width="100">
                    <template slot-scope="scope">
                        <span v-if="scope.row.country !== null">{{ scope.row.country.name_text }}</span>
                        <span v-else>-</span>
                    </template>
                </el-table-column>-->
                <!--<el-table-column align="center" prop="level" :label="$i18n.t('MEMBER_LEVEL')" :min-width="100">
                    <template slot-scope="scope">
                        <span v-if="scope.row.user_level !== null">{{ scope.row.user_level.name_text }}</span>
                        <span v-else>-</span>
                    </template>
                </el-table-column>-->
                <el-table-column align="center" prop="phone" :label="$i18n.t('PHONE')" :min-width="100"></el-table-column>
                <el-table-column align="center" :label="$i18n.t('MEMBER_LEVEL')" :min-width="100">
                    <template slot-scope="scope">
                        <el-link type="primary" @click="onCheckUserMember(scope.row)">
                            <div v-for="(member, index) in scope.row.user_member" :key="index">
                                <div v-if="member.user_level">
                                    {{ member.user_level.name }}
                                </div>
                            </div>
                        </el-link>
                    </template>
                </el-table-column>
                <el-table-column align="center" :label="$i18n.t('MEMBER_BANK_ACCOUNT')" :min-width="120">
                    <template slot-scope="scope">
                        <div v-if="scope.row.user_info && scope.row.user_info.account !== ''">
                            <div>{{ $i18n.t('BANK_NAME') }}: {{ scope.row.user_info.bank_name }}</div>
                            <div>{{ $i18n.t('MEMBER_BANK_NAME') }}: {{ scope.row.user_info.name }} </div>
                            <div>{{ $i18n.t('MEMBER_BANK_ACCOUNT') }}: {{ scope.row.user_info.account }} </div>
                            <div>UPI: {{ scope.row.user_info.upi }} </div>
                            <div>IFSC: {{ scope.row.user_info.ifsc }} </div>
                            <div>{{ $i18n.t('EMAIL') }}: {{ scope.row.user_info.email }} </div>
                            <div>{{ $i18n.t('PHONE') }}: {{ scope.row.user_info.phone }} </div>
                        </div>
                        <div v-else>
                            {{ $i18n.t('NOT_BIND') }}
                        </div>
                    </template>
                </el-table-column>
<!--                <el-table-column align="center" prop="account" :label="$i18n.t('ACCOUNT')" :min-width="150"></el-table-column>-->
                <el-table-column align="center" prop="balance" :label="$i18n.t('BALANCE')" :min-width="100">
                    <template slot-scope="scope">
                        <div>{{ $i18n.t('BALANCE') }}: {{ scope.row.balance }}</div>
                        <div>{{ $i18n.t('CREDIT') }}: {{ scope.row.credit }}</div>
                        <div v-if="scope.row.yuebao">{{ $i18n.t('YUEBAO') }}: {{ scope.row.yuebao.balance }}</div>
                        <div>{{ $i18n.t('MANAGE_FINANCE_AMOUNT') }}: {{ scope.row.mf_amount }}</div>
                        <div>{{ $i18n.t('MANAGE_FINANCE_PROFIT') }}: {{ scope.row.mf_profit }}</div>
                    </template>
                </el-table-column>
                <!--<el-table-column align="center" prop="effective_time" :label="$i18n.t('EFFECTIVE_TIME')" :min-width="170">
                    <template slot-scope="scope">
                        <el-link @click="onEditEffectiveTime(scope.row)">{{ scope.row.effective_time }}</el-link>
                    </template>
                </el-table-column>-->
                <el-table-column align="center" sortable prop="created_at" :label="$i18n.t('CREATE_TIME')" :min-width="170">
                    <template slot-scope="scope">
                        <div>{{ $i18n.t('CREATE_TIME') }}: {{ scope.row.created_at }} </div>
                        <div>{{ $i18n.t('LAST_LOGIN_TIME') }}: {{ scope.row.last_login_time }} </div>
                        <div>{{ $i18n.t('REG_IP') }}: {{ scope.row.ip }} </div>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="status" :label="$i18n.t('STATUS')" :min-width="100">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status === 1" type="success">{{ $i18n.t('NORMAL') }}</el-tag>
                        <el-tag v-else-if="scope.row.status === 0" type="danger">{{ $i18n.t('DISABLED') }}</el-tag>
                        <el-tag v-else>-</el-tag>
                    </template>
                </el-table-column>
                <!-- 右侧按钮 -->
                <el-table-column align="center" :label="$i18n.t('ACTION')" fixed="right" :width="250">
                    <template slot-scope="scope">
                        <el-link v-auth="'recharge'" icon="el-icon-custom-caiwu" @click="onRecharge(scope.row)">{{ $i18n.t('EDIT_MEMBER_LEVEL') }}</el-link>
                        <span v-auth="'balance'">
                            <el-divider direction="vertical"></el-divider>
                            <el-link icon="el-icon-edit" @click="onEditBalance(scope.row)">{{ $i18n.t('EDIT_MEMBER_BALANCE') }}</el-link>
                        </span>
                        <span v-auth="'team'">
                            <el-divider direction="vertical"></el-divider>
                            <el-link icon="el-icon-view" @click="onCheckTeam(scope.row)">{{ $i18n.t('CHECK_TEAM') }}</el-link>
                        </span>
                        <div>
                            <span v-auth="'disable'" v-if="scope.row.status === 1">
                                <poptip
                                    confirm
                                    :title="$i18n.t('CONFIRM_DISABLE_TIP')"
                                    @on-ok="onDisable(scope.row.id)"
                                    :ok-text="$i18n.t('CONFIRM')"
                                    :cancel-text="$i18n.t('CANCEL')"
                                >
                                    <el-link icon="el-icon-close">{{ $i18n.t('DISABLE') }}</el-link>
                                </poptip>
                            </span>
                            <span v-auth="'enable'" v-if="scope.row.status === 0">
                                <el-divider direction="vertical"></el-divider>
                            <poptip
                                confirm
                                :title="$i18n.t('CONFIRM_ENABLE_TIP')"
                                @on-ok="onEnable(scope.row.id)"
                                :ok-text="$i18n.t('CONFIRM')"
                                :cancel-text="$i18n.t('CANCEL')"
                            >
                                <el-link icon="el-icon-check">{{ $i18n.t('ENABLE') }}</el-link>
                            </poptip>
                        </span>
                            <span v-auth="'edit'">
                            <el-divider direction="vertical"></el-divider>
                            <el-link icon="el-icon-edit" @click="onEDit(scope.row)">{{ $i18n.t('EDIT') }}</el-link>
                        </span>
                        </div>
                        <!--<span v-auth="'set_up_agent'" v-if="scope.row.type === 0">
                            <el-divider direction="vertical"></el-divider>
                            <poptip
                                confirm
                                :title="$i18n.t('CONFIRM_SET_AGENT_TIP')"
                                @on-ok="onSetUpAgent(scope.row.id)"
                                :ok-text="$i18n.t('CONFIRM')"
                                :cancel-text="$i18n.t('CANCEL')"
                            >
                                <el-link icon="el-icon-check">{{ $i18n.t('SET_UP_AGENT') }}</el-link>
                            </poptip>
                        </span>
                        <span v-auth="'cancel_agent'" v-if="scope.row.type === 1">
                            <el-divider direction="vertical"></el-divider>
                            <poptip
                                confirm
                                :title="$i18n.t('CONFIRM_CANCEL_AGENT_TIP')"
                                @on-ok="onCancelAgent(scope.row.id)"
                                :ok-text="$i18n.t('CONFIRM')"
                                :cancel-text="$i18n.t('CANCEL')"
                            >
                                <el-link icon="el-icon-check">{{ $i18n.t('CANCEL_AGENT') }}</el-link>
                            </poptip>
                        </span>-->
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
            :title="$i18n.t('EDIT_MEMBER_LEVEL')"
            :visible.sync="dialogTableVisible"
            :destroy-on-close="true"
        >
            <recharge-form-modal :mdl="mdl" :handle-close-dialog="handleCloseDialog"></recharge-form-modal>
        </el-dialog>
        <el-dialog
            :title="$i18n.t('EDIT_MEMBER_BALANCE')"
            :visible.sync="editBalanceVisible"
            :destroy-on-close="true"
        >
            <balance-form-modal :mdl="mdl" :handle-close-dialog="handleCloseBalanceDialog"></balance-form-modal>
        </el-dialog>
        <el-dialog
            :title="$i18n.t('CHECK_TEAM')"
            v-if="teamVisible"
            :visible.sync="teamVisible"
            :destroy-on-close="true"
            width="80%"
            style="height: 100%"
        >
<!--            <team-table :mdl="mdl" :handle-close-dialog="handleCloseTeamDialog"></team-table>-->
            <team :mdl="mdl" :handle-close-dialog="handleCloseTeamDialog"></team>
        </el-dialog>
        <el-drawer
            :title="$i18n.t(mdl.id > 0 ? 'EDIT' : 'ADD')"
            :visible.sync="drawer"
            destroy-on-close
            ref="drawer"
            size="600px"
        >
            <form-modal :mdl="mdl" :handle-close-drawer="handleCloseDrawer"></form-modal>
        </el-drawer>
        <el-dialog
            :title="$i18n.t('EDIT_EFFECTIVE_TIME')"
            :visible.sync="effectiveTimeVisible"
            :destroy-on-close="true"
        >
            <effective-time-form-modal :mdl="mdl" :handle-close-dialog="handleCloseEffectiveTimeDialog"></effective-time-form-modal>
        </el-dialog>
        <el-dialog
            :title="$i18n.t('EDIT_PARENT_ID')"
            :visible.sync="changeParentVisible"
            :destroy-on-close="true"
        >
            <change-parent-form-modal :mdl="mdl" :handle-close-dialog="handleCloseChangeParentDialog"></change-parent-form-modal>
        </el-dialog>
        <el-dialog
            :title="$i18n.t('CHECK_USER_MEMBER')"
            :visible.sync="userMemberVisible"
            :destroy-on-close="true"
            v-if="userMemberVisible"
        >
            <user-member-form-modal :mdl="mdl"></user-member-form-modal>
        </el-dialog>
        <el-dialog
            :title="$i18n.t('EXPORT')"
            :visible.sync="exportVisible"
            :destroy-on-close="true"
            v-if="exportVisible"
        >
            <el-form :model="mdl" ref="ruleForm" label-width="130px">
                <el-form-item :label="$i18n.t('PAGE')">
                    <el-input-number v-model="exportPage" :placeholder="$i18n.t('PAGE')" style="width: 200px;"></el-input-number>
                </el-form-item>
                <el-form-item >
                    <el-button @click="handleExport" type="primary">{{ $i18n.t('SUBMIT') }}</el-button>
                </el-form-item>
            </el-form>
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
    import { getMember, enableMember, disableMember, setUpAgent, cancelAgent } from '@/api/member'
    import FormModal from '@/components/member/FormModal'
    import RechargeFormModal from '@/components/member/RechargeFormModal'
    import { PAGES_SIZE } from '@/config/constants'
    import { getUserLevels } from '@/api/userLevel'
    import BalanceFormModal from '@/components/member/BalanceFormModal'
    import EffectiveTimeFormModal from '@/components/member/EffectiveTimeFormModal'
    import Team from '@/components/member/Team'
    import { userCsv } from '@/api/csv'
    import changeParentFormModal from '@/components/member/changeParentFormModal'
    import UserMemberFormModal from '@/components/member/UserMemberFormModal'
    // import TeamTable from '@/components/member/TeamTable'

    export default {
        name: 'user',
        components: { SearchForm, RechargeFormModal, BalanceFormModal, Team, FormModal, EffectiveTimeFormModal, changeParentFormModal, UserMemberFormModal },
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
                editBalanceVisible: false,
                teamVisible: false,
                effectiveTimeVisible: false,
                changeParentVisible: false,
                userMemberVisible: false,
                exportVisible: false,
                mdl: {},
                checkedIds: [],
                userLevelList: [],
                exportPage: 1
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
                    { label: this.$i18n.t('NORMAL'), value: 1 },
                    { label: this.$i18n.t('DISABLED'), value: 0 }
                ]
                // 用户类型
                const typeOptions = [
                    { label: this.$i18n.t('USER_TYPE_0'), value: 0 },
                    { label: this.$i18n.t('USER_TYPE_1'), value: 1 }
                ]
                // 构建搜索表单
                return [
                    { title: this.$i18n.t('MEMBER_ID'), type: 'input', key: 'id', maxlength: 11 },
                    { title: this.$i18n.t('USER_TYPE'), type: 'select', key: 'type', maxlength: 11, options: typeOptions },
                    { title: this.$i18n.t('MEMBER_LEVEL'), type: 'select_level', key: 'level', options: this.userLevelList },
                    { title: this.$i18n.t('ACCOUNT'), type: 'input', key: 'account', maxlength: 50 },
                    { title: this.$i18n.t('NICKNAME'), type: 'input', key: 'nickname', maxlength: 50 },
                    { title: this.$i18n.t('PHONE'), type: 'input', key: 'phone', maxlength: 20 },
                    { title: this.$i18n.t('STATUS'), type: 'select', key: 'status', options: statusOptions },
                    { title: this.$i18n.t('REG_TIME'), type: 'date-range', key: 'created_at' }
                ]
            },
            isShowDivider () {
                const { meta } = this.$store.getters.router
                return meta.actions.indexOf('update') > -1 && meta.actions.indexOf('delete') > -1
            }
        },
        methods: {
            handleDownload () {
                this.exportVisible = true
            },
            handleExport () {
                userCsv({ page: this.exportPage }).then(() => {
                    this.$Message.success(this.$i18n.t('HANDLE_SUCCESS'))
                    this.exportVisible = false
                })
            },
            // 搜索按钮
            onSearch () {
                this.fetch()
            },
            // 从接口拉取数据
            fetch () {
                this.loading = true
                getMember({ ...this.params, page: this.page.currentPage, perPage: this.page.perPage }).then((res) => {
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
            // 关闭对话框
            handleCloseDialog () {
                this.dialogTableVisible = false
            },
            handleCloseEffectiveTimeDialog () {
                this.effectiveTimeVisible = false
            },
            handleCloseChangeParentDialog () {
                this.changeParentVisible = false
            },
            // 关闭对话框
            handleCloseBalanceDialog () {
                this.editBalanceVisible = false
            },
            // 关闭对话框
            handleCloseTeamDialog () {
                this.teamVisible = false
            },
            // 选中的ID
            handleSelectionChange (rows) {
                this.checkedIds = rows.map(item => item.id)
            },
            // 启用选中用户
            onEnable (id) {
                enableMember(id).then(() => {
                    this.$Message.success(this.$i18n.t('HANDLE_SUCCESS'))
                    setTimeout(() => {
                        this.fetch()
                    }, 500)
                })
            },
            // 禁用选中用户
            onDisable (id) {
                disableMember(id).then(() => {
                    this.$Message.success(this.$i18n.t('HANDLE_SUCCESS'))
                    setTimeout(() => {
                        this.fetch()
                    }, 500)
                })
            },
            onSetUpAgent (id) {
                setUpAgent({ id: id }).then(() => {
                    this.$Message.success(this.$i18n.t('HANDLE_SUCCESS'))
                    setTimeout(() => {
                        this.fetch()
                    }, 500)
                })
            },
            onCancelAgent (id) {
                cancelAgent({ id: id }).then(() => {
                    this.$Message.success(this.$i18n.t('HANDLE_SUCCESS'))
                    setTimeout(() => {
                        this.fetch()
                    }, 500)
                })
            },
            onRecharge (row) {
                this.mdl = Object.assign({}, row)
                this.dialogTableVisible = true
            },
            onEditBalance (row) {
                this.mdl = Object.assign({}, {
                    id: row.id,
                    balance: row.balance,
                    type: 6,
                    amount: 0
                })
                this.editBalanceVisible = true
            },
            onChangeParentId (row) {
                this.mdl = Object.assign({}, row)
                this.changeParentVisible = true
            },
            onCheckTeam (row) {
                this.mdl = Object.assign({}, row)
                this.teamVisible = true
            },
            onCheckUserMember (row) {
                this.mdl = Object.assign({}, row)
                this.userMemberVisible = true
            },
            onEditEffectiveTime (row) {
                this.mdl = Object.assign({}, row)
                this.effectiveTimeVisible = true
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
            },
            // 修改
            onEDit (row) {
                this.mdl = Object.assign({}, row)
                this.mdl.password = ''
                this.mdl.trade_pass = ''
                this.drawer = true
            }
        }
    }
</script>

<style lang="less" scoped>
</style>
