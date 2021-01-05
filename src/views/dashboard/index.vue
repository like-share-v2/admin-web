<template>
    <div class="dashboard-editor-container">
        <panel-group @handleSetLineChartData="handleSetLineChartData" />

        <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
<!--            <line-chart :chart-data="lineChartData" :loading="lineChartLoading"/>-->

            <data-card :manual-recharge-data="manualRechargeData"/>
        </el-row>

        <el-row :gutter="32">
            <el-col :xs="24" :sm="24" :lg="8">
                <div class="chart-wrapper">
                    <task-category-data-pie  :task-category-data="taskCategoryData"/>
                </div>
            </el-col>
            <el-col :xs="24" :sm="24" :lg="8">
                <div class="chart-wrapper">
                    <user-task-category-data-pie  :user-task-category-data="userTaskCategoryData"/>
                </div>
            </el-col>
            <el-col :xs="24" :sm="24" :lg="8">
                <div class="chart-wrapper">
                    <user-level-data-pie :user-level-data="userLevelData" />
                </div>
            </el-col>
        </el-row>

        <el-row :gutter="32">
            <el-col :xs="24" :sm="24" :lg="8">
                <div class="chart-wrapper">
                    <user-task-data-card :user-task-data="userTaskData" :loading="dataLoading" />
                </div>
            </el-col>
            <el-col :xs="24" :sm="24" :lg="8">
                <div class="chart-wrapper">
                    <user-bank-recharge-data-card :manual-recharge-data="bankRechargeData" :loading="dataLoading"/>
                </div>
            </el-col>
            <el-col :xs="24" :sm="24" :lg="8">
                <div class="chart-wrapper">
                    <user-withdrawal-data-card :withdrawal-data="withdrawalData" :loading="dataLoading"/>
                </div>
            </el-col>
        </el-row>

        <!--<el-row :gutter="32">
            <el-col :xs="24" :sm="24" :lg="8">
                <div class="chart-wrapper">
                    <raddar-chart/>
                </div>
            </el-col>
            <el-col :xs="24" :sm="24" :lg="8">
                <div class="chart-wrapper">
                    <pie-chart/>
                </div>
            </el-col>
            <el-col :xs="24" :sm="24" :lg="8">
                <div class="chart-wrapper">
                    <bar-chart/>
                </div>
            </el-col>
        </el-row>

        <el-row :gutter="8">
            <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}"
                    style="margin-bottom:30px;">
                <todo-list/>
            </el-col>
            <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}"
                    style="margin-bottom:30px;">
                <box-card/>
            </el-col>
        </el-row>-->
    </div>
</template>

<script>
    /* eslint-disable */

    import PanelGroup from './components/PanelGroup'
    import LineChart from './components/LineChart'
    import RaddarChart from './components/RaddarChart'
    import PieChart from './components/PieChart'
    import BarChart from './components/BarChart'
    import TodoList from './components/TodoList'
    import BoxCard from './components/BoxCard'
    import DataCard from '@/views/dashboard/components/data/DataCard'
    import UserTaskDataCard from '@/views/dashboard/components/dataCard/UserTaskDataCard'
    import UserBankRechargeDataCard from '@/views/dashboard/components/dataCard/UserBankRechargeDataCard'
    import UserWithdrawalDataCard from '@/views/dashboard/components/dataCard/UserWithdrawalDataCard'
    import UserTaskCategoryDataPie from '@/views/dashboard/components/dataPie/UserTaskCategoryDataPie'
    import TaskCategoryDataPie from '@/views/dashboard/components/dataPie/TaskCategoryDataPie'
    import UserLevelDataPie from '@/views/dashboard/components/dataPie/UserLevelDataPie'
    import { getWeekData, getData, getPieData } from '@/api'

    const lineChartData = {
        newVisitis: {
            /*expectedData: [120, 82, 91, 154, 162, 140, 145],
            actualData: [120, 82, 91, 154, 162, 140, 145],
            date: ['08-25', '08-26', '08-27', '08-28', '08-29', '08-30', '08-31'],
            name: '新会员数'*/
            actualData: [],
            date: [],
            name: ''
        },
        payment: {
            actualData: [],
            date: [],
            name: ''
        },
        withdrawal: {
            expectedData: [80, 100, 121, 104, 105, 90, 100],
            actualData: [120, 90, 100, 138, 142, 130, 130],
            date: ['周一', '周二', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            name: ''
        },
        userIncome: {
            expectedData: [130, 140, 141, 142, 145, 150, 160],
            actualData: [120, 82, 91, 154, 162, 140, 130],
            date: ['周一', '周二', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            name: ''
        }
    }

    export default {
        name: 'DashboardAdmin',
        components: {
            PanelGroup,
            LineChart,
            RaddarChart,
            PieChart,
            BarChart,
            TodoList,
            BoxCard,
            UserTaskDataCard,
            UserBankRechargeDataCard,
            UserWithdrawalDataCard,
            UserTaskCategoryDataPie,
            TaskCategoryDataPie,
            UserLevelDataPie,
            DataCard
        },
        data() {
            return {
                lineChartData: lineChartData.newVisitis,
                userTaskData: {},
                bankRechargeData: {},
                withdrawalData: {},
                manualRechargeData: {},
                dataLoading: true,
                lineChartLoading: true,
                userTaskCategoryData: {name: [], data: []},
                taskCategoryData: {name: [], data: []},
                userLevelData: {name: [], data: []},
            }
        },
        created () {
            lineChartData.newVisitis.name = this.$i18n.t('NUMBER_NEW_MEMBERS_DAY')
            lineChartData.payment.name = this.$i18n.t('AMOUNT_PAID_DAY')
            lineChartData.withdrawal.name = this.$i18n.t('WITHDRAWAL_AMOUNT_DAY')
            lineChartData.userIncome.name = this.$i18n.t('INCOME_AMOUNT_DAY')
            getWeekData().then((res) => {
                const {user_data, payment_data, withdrawal_data, user_income_data} = res.result
                lineChartData.newVisitis.actualData = user_data.count
                lineChartData.newVisitis.date = user_data.date
                lineChartData.payment.actualData = payment_data.amount
                lineChartData.payment.date = user_data.date
                lineChartData.withdrawal.actualData = withdrawal_data.amount
                lineChartData.withdrawal.date = withdrawal_data.date
                lineChartData.userIncome.actualData = user_income_data.amount
                lineChartData.userIncome.date = user_income_data.date
            })
            getPieData().then((res) => {
                this.taskCategoryData = res.result.task_category_data
                this.userTaskCategoryData = res.result.user_task_category_data
                this.userLevelData = res.result.user_level_data
            })
            getData().then((res) => {
                const { userTaskData, bankRechargeData, withdrawal_data } = res.result
                this.userTaskData = userTaskData
                this.bankRechargeData = bankRechargeData
                this.withdrawalData = withdrawal_data
            }).finally(() => {
                this.dataLoading = false
            })
        },
        methods: {
            handleSetLineChartData(type) {
                this.lineChartData = lineChartData[type]
            }
        }
    }
</script>

<style lang="scss" scoped>
    .dashboard-editor-container {
        padding: 32px;
        background-color: rgb(240, 242, 245);
        position: relative;

        .github-corner {
            position: absolute;
            top: 0px;
            border: 0;
            right: 0;
        }

        .chart-wrapper {
            background: #fff;
            padding: 16px 16px 0;
            margin-bottom: 32px;
        }
    }

    @media (max-width: 1024px) {
        .chart-wrapper {
            padding: 8px;
        }
    }
</style>
