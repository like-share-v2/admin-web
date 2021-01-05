<template>
    <div>
        <div id="myChart" :style="{width: '300px', height: '300px'}"></div>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>用户数据</span>
    <!--        内注册用户：{{ userData.week_user_count }}
            </div>
            <div class="text item">
                一个月内注册用户：{{ userData.month_user_count }}
            </div>
        </el-card>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>用户收入数据</span>    <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>-->
            </div>
            <div class="text item">
                用户数量：{{ userData.user_count }}
            </div>
            <div class="text item">
                用户当前总余额：{{ userData.user_balance_amount }}
            </div>
            <div class="text item">
                今天注册用户：{{ userData.today_user_count }}
            </div>
            <div class="text item">
                七天
            </div>
            <div class="text item">
                任务收益：{{ userIncomeData.user_task_income_amount }}
            </div>
            <div class="text item">
                下级收益：{{ userIncomeData.user_lower_income_amount }}
            </div>
            <div class="text item">
                总收益：{{ userIncomeData.user_total_income_amount }}
            </div>
        </el-card>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>充值数据</span>
            </div>
            <div class="text item">
                总充值金额: {{ rechargeData.total_recharge_sum }}
            </div>
            <div class="text item">
                线上充值总金额: {{ rechargeData.online_recharge_sum }}
            </div>
            <div class="text item">
                后台充值总金额: {{ rechargeData.admin_recharge_sum }}
            </div>
            <div class="text item">
                扫码充值总金额: {{ rechargeData.manual_recharge_sum }}
            </div>
        </el-card>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>提现数据</span>
            </div>
            <div class="text item">
                待审核提现数量: {{ withdrawalData.withdrawal_audit_count }}
            </div>
            <div class="text item">
                待审核提现总金额: {{ withdrawalData.withdrawal_audit_amount }}
            </div>
            <div class="text item">
                已通过提现数量: {{ withdrawalData.withdrawal_pass_count }}
            </div>
            <div class="text item">
                已通过提现总金额: {{ withdrawalData.withdrawal_pass_amount }}
            </div>
            <div class="text item">
                未通过提现数量: {{ withdrawalData.withdrawal_refuse_count }}
            </div>
            <div class="text item">
                未通过提现总金额: {{ withdrawalData.withdrawal_refuse_amount }}
            </div>
        </el-card>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>扫码充值数据</span>
            </div>
            <div class="text item">
                待审核数量: {{ manualRechargeData.manual_recharge_audit_count }}
            </div>
            <div class="text item">
                待审核总金额: {{ manualRechargeData.manual_recharge_audit_amount }}
            </div>
            <div class="text item">
                已通过数量: {{ manualRechargeData.manual_recharge_pass_count }}
            </div>
            <div class="text item">
                已通过总金额: {{ manualRechargeData.manual_recharge_pass_amount }}
            </div>
            <div class="text item">
                未通过数量: {{ manualRechargeData.manual_recharge_refuse_count }}
            </div>
            <div class="text item">
                未通过总金额: {{ manualRechargeData.manual_recharge_refuse_amount }}
            </div>
        </el-card>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>任务数据</span>
            </div>
            <div class="text item">
                进行中任务数量: {{ userTaskData.user_task_progress_count }}
            </div>
            <div class="text item">
                进行中任务金额: {{ userTaskData.user_task_progress_amount }}
            </div>
            <div class="text item">
                待审核任务数量: {{ userTaskData.user_task_audit_count }}
            </div>
            <div class="text item">
                待审核任务金额: {{ userTaskData.user_task_audit_amount  }}
            </div>
            <div class="text item">
                已通过任务数量: {{ userTaskData.user_task_pass_count }}
            </div>
            <div class="text item">
                已通过任务金额: {{ userTaskData.user_task_pass_amount  }}
            </div>
            <div class="text item">
                未通过任务数量: {{ userTaskData.user_task_refuse_count }}
            </div>
            <div class="text item">
                未通过任务金额: {{ userTaskData.user_task_refuse_amount  }}
            </div>
            <div class="text item">
                已取消任务数量: {{ userTaskData.user_task_cancel_count }}
            </div>
            <div class="text item">
                已取消任务金额: {{ userTaskData.user_task_cancel_amount  }}
            </div>
        </el-card>
    </div>
</template>

<style>
    .text {
        font-size: 14px;
    }

    .item {
        margin-bottom: 18px;
    }

    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }
    .clearfix:after {
        clear: both
    }

    .box-card {
        width: 350px;
    }
</style>

<script>
    import { getData } from '@/api'

    export default {
        name: 'workplace',
        data () {
            return {
                userData: {},
                rechargeData: {},
                withdrawalData: {},
                userTaskData: {},
                manualRechargeData: {},
                userIncomeData: {},
                userLevelData: {}
            }
        },
        created () {
            this.fetch()
        },
        mounted () {
            this.drawLine()
        },
        methods: {
            // 从接口拉取数据
            fetch () {
                this.loading = true
                getData().then((res) => {
                    // eslint-disable-next-line camelcase
                    const { user_data, recharge_data, withdrawal_data, user_task_data, manual_recharge_data, user_income_data, user_level_data } = res.result
                    /* eslint-disable */
                    this.userData = user_data
                    this.rechargeData = recharge_data
                    this.withdrawalData = withdrawal_data
                    this.userTaskData = user_task_data
                    this.manualRechargeData = manual_recharge_data
                    this.userIncomeData = user_income_data
                    this.userLevelData = user_level_data
                }).finally(() => {
                    this.loading = false
                })
            },
            drawLine(){
                // 基于准备好的dom，初始化echarts实例
                let myChart = this.$echarts.init(document.getElementById('myChart'))

                // 绘制图表
                myChart.setOption({
                    title: { text: '用户数据' },
                    tooltip: {},
                    xAxis: {
                        data: ["羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
                    },
                    yAxis: {},
                    series: [{
                        name: '销量',
                        type: 'bar',
                        data: []
                    }]
                });

                getStatsticalData().then((res) => {
                    // eslint-disable-next-line camelcase
                    const { user_data, recharge_data, withdrawal_data, user_task_data, manual_recharge_data, user_income_data, user_level_data } = res.result
                    /* eslint-disable */
                    myChart.hideLoading();
                    myChart.setOption({
                        series: [{
                            data: [res.result.user_data.user_count, 1, 2, 3, 4 ] //将异步请求获取到的数据进行装载
                        }]
                    })
                })
            }
        }
    }
</script>
