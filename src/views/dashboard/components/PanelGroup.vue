<template>
    <el-row :gutter="40" class="panel-group">
        <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
            <div class="card-panel" @click="handleSetLineChartData('newVisitis')">
                <div class="card-panel-icon-wrapper icon-people">
                    <svg-icon icon-class="peoples" class-name="card-panel-icon"/>
                </div>
                <div class="card-panel-description">
                    <div class="card-panel-text">{{ $i18n.t('NUMBER_OF_MEMBERS') }}</div>
                    <count-to v-loading="loading" :start-val="0" :end-val="userTotalCount" :duration="2600" class="card-panel-num"/>
                </div>
            </div>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
            <div class="card-panel" @click="handleSetLineChartData('payment')">
                <div class="card-panel-icon-wrapper icon-message">
                    <svg-icon icon-class="recharge-amount" class-name="card-panel-icon"/>
                </div>
                <div class="card-panel-description">
                    <div class="card-panel-text">{{ $i18n.t('TOTAL_PAYMENT_AMOUNT') }} </div>
                    <count-to v-loading="loading" :start-val="0" :end-val="payment_sum" :duration="2600" class="card-panel-num"/>
                </div>
            </div>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
            <div class="card-panel" @click="handleSetLineChartData('withdrawal')">
                <div class="card-panel-icon-wrapper icon-money">
                    <svg-icon icon-class="money" class-name="card-panel-icon"/>
                </div>
                <div class="card-panel-description">
                    <div class="card-panel-text">{{ $i18n.t('TOTAL_WITHDRAWAL_AMOUNT') }}</div>
                    <count-to v-loading="loading" :start-val="0" :end-val="withdrawal_sum" :duration="2600" class="card-panel-num"/>
                </div>
            </div>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
            <div class="card-panel" @click="handleSetLineChartData('userIncome')">
                <div class="card-panel-icon-wrapper icon-shopping">
                    <svg-icon icon-class="income" class-name="card-panel-icon"/>
                </div>
                <div class="card-panel-description">
                    <div class="card-panel-text">{{ $i18n.t('TOTAL_USER_INCOME') }}</div>
                    <count-to v-loading="loading" :start-val="0" :end-val="user_income_sum" :duration="3600" class="card-panel-num"/>
                </div>
            </div>
        </el-col>
    </el-row>
</template>

<script>
    /* eslint-disable */
    import CountTo from 'vue-count-to'
    import { getStatisticalData } from '@/api'

    export default {
        components: {
            CountTo
        },
        methods: {
            handleSetLineChartData(type) {
                this.$emit('handleSetLineChartData', type)
            }
        },
        data() {
            return {
                userTotalCount: 0,
                payment_sum: 0,
                withdrawal_sum: 0,
                user_income_sum: 0,
                loading: true
            }
        },
        created() {
            getStatisticalData().then((res) => {
                const {user_count, payment_sum, withdrawal_sum, user_income_sum} = res.result
                this.userTotalCount = user_count
                this.payment_sum = payment_sum
                this.withdrawal_sum = withdrawal_sum
                this.user_income_sum = user_income_sum
            }).finally(() => {
                this.loading = false
            })
        }
    }
</script>

<style lang="scss" scoped>
    .panel-group {
        margin-top: 18px;

        .card-panel-col {
            margin-bottom: 32px;
        }

        .card-panel {
            height: 108px;
            cursor: pointer;
            font-size: 12px;
            position: relative;
            overflow: hidden;
            color: #666;
            background: #fff;
            box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
            border-color: rgba(0, 0, 0, .05);

            &:hover {
                .card-panel-icon-wrapper {
                    color: #fff;
                }

                .icon-people {
                    background: #40c9c6;
                }

                .icon-message {
                    background: #36a3f7;
                }

                .icon-money {
                    background: #f4516c;
                }

                .icon-shopping {
                    background: #34bfa3
                }
            }

            .icon-people {
                color: #40c9c6;
            }

            .icon-message {
                color: #36a3f7;
            }

            .icon-money {
                color: #f4516c;
            }

            .icon-shopping {
                color: #34bfa3
            }

            .card-panel-icon-wrapper {
                float: left;
                margin: 14px 0 0 14px;
                padding: 16px;
                transition: all 0.38s ease-out;
                border-radius: 6px;
            }

            .card-panel-icon {
                float: left;
                font-size: 48px;
            }

            .card-panel-description {
                /*float: right;*/
                font-weight: bold;
                margin: 13px;
                margin-left: 0px;

                .card-panel-text {
                    line-height: 18px;
                    color: rgba(0, 0, 0, 0.45);
                    font-size: 12px;
                    margin-bottom: 12px;
                }

                .card-panel-num {
                    font-size: 20px;
                    float: right;
                }
            }
        }
    }

    @media (max-width: 550px) {
        .card-panel-description {
            display: none;
        }

        .card-panel-icon-wrapper {
            float: none !important;
            width: 100%;
            height: 100%;
            margin: 0 !important;

            .svg-icon {
                display: block;
                margin: 14px auto !important;
                float: none !important;
            }
        }
    }
</style>
