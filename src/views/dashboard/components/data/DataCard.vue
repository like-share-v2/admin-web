<template>
    <div :style="{height:height,width:width}">
        <el-card class="box-card" shadow="never" v-loading="loading" style="height: 95%">
            <div class="block">
                <el-date-picker
                    v-model="date"
                    type="datetimerange"
                    :start-placeholder="$i18n.t('PLEASE_SELECT_DATE_RANGE')"
                    :end-placeholder="$i18n.t('PLEASE_SELECT_DATE_RANGE')"
                    :default-time="['12:00:00']">
                </el-date-picker>
                <el-button type="primary" @click="search('ruleForm')">{{ $i18n.t('SEARCH') }}</el-button>
            </div>
            <el-row :gutter="40" class="panel-group">
                <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
                    <div class="card-panel" @click="onCheckData(1)">
                        <!--<div class="card-panel-icon-wrapper icon-people">
                            <svg-icon icon-class="peoples" class-name="card-panel-icon"/>
                        </div>-->
                        <div class="card-panel-description">
                            <div class="card-panel-text">{{ $i18n.t('RECHARGE_AMOUNT') }}</div>
                            <count-to v-loading="loading" :start-val="0" :end-val="this.data.recharge_amount_sum" :duration="2600" class="card-panel-num"/>
                        </div>
                    </div>
                </el-col>
                <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
                    <div class="card-panel" @click="onCheckData(2)">
                        <!--<div class="card-panel-icon-wrapper icon-message">
                            <svg-icon icon-class="recharge-amount" class-name="card-panel-icon"/>
                        </div>-->
                        <div class="card-panel-description">
                            <div class="card-panel-text">{{ $i18n.t('WITHDRAWAL_AMOUNT') }} </div>
                            <count-to v-loading="loading" :start-val="0" :end-val="this.data.withdrawal_amount_sum" :duration="2600" class="card-panel-num"/>
                        </div>
                    </div>
                </el-col>
                <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
                    <div class="card-panel" @click="onCheckData(8)">
                       <!-- <div class="card-panel-icon-wrapper icon-money">
                            <svg-icon icon-class="money" class-name="card-panel-icon"/>
                        </div>-->
                        <div class="card-panel-description">
                            <div class="card-panel-text">{{ $i18n.t('WITHDRAWAL_USER_COUNT') }}</div>
                            <count-to v-loading="loading" :start-val="0" :end-val="this.data.withdrawal_user_count" :duration="2600" class="card-panel-num"/>
                        </div>
                    </div>
                </el-col>
                <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
                    <div class="card-panel" @click="onCheckData(3)">
                        <!--<div class="card-panel-icon-wrapper icon-shopping">
                            <svg-icon icon-class="income" class-name="card-panel-icon"/>
                        </div>-->
                        <div class="card-panel-description">
                            <div class="card-panel-text">{{ $i18n.t('FIRST_RECHARGE_USER_COUNT') }}</div>
                            <count-to v-loading="loading" :start-val="0" :end-val="this.data.first_recharge_count" :duration="3600" class="card-panel-num"/>
                        </div>
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="40" class="panel-group">
                <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
                    <div class="card-panel" @click="onCheckData(4)">
                        <!--<div class="card-panel-icon-wrapper icon-people">
                            <svg-icon icon-class="peoples" class-name="card-panel-icon"/>
                        </div>-->
                        <div class="card-panel-description">
                            <div class="card-panel-text">{{ $i18n.t('OVERLAY_MEMBER_COUNT') }}</div>
                            <count-to v-loading="loading" :start-val="0" :end-val="this.data.overlay_member_count" :duration="2600" class="card-panel-num"/>
                        </div>
                    </div>
                </el-col>
                <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
                    <div class="card-panel" @click="onCheckData(5)">
                        <!--<div class="card-panel-icon-wrapper icon-message">
                            <svg-icon icon-class="recharge-amount" class-name="card-panel-icon"/>
                        </div>-->
                        <div class="card-panel-description">
                            <div class="card-panel-text">{{ $i18n.t('NEW_MEMBER_COUNT') }} </div>
                            <count-to v-loading="loading" :start-val="0" :end-val="this.data.user_count" :duration="2600" class="card-panel-num"/>
                        </div>
                    </div>
                </el-col>
                <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
                    <div class="card-panel" @click="onCheckData(6)">
                        <!--<div class="card-panel-icon-wrapper icon-money">
                            <svg-icon icon-class="money" class-name="card-panel-icon"/>
                        </div>-->
                        <div class="card-panel-description">
                            <div class="card-panel-text">{{ $i18n.t('COMPLETE_TASK_USER_COUNT') }}</div>
                            <count-to v-loading="loading" :start-val="0" :end-val="this.data.complete_task_count" :duration="2600" class="card-panel-num"/>
                        </div>
                    </div>
                </el-col>
                <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
                    <div class="card-panel" @click="onCheckData(7)">
                        <!--<div class="card-panel-icon-wrapper icon-shopping">
                            <svg-icon icon-class="income" class-name="card-panel-icon"/>
                        </div>-->
                        <div class="card-panel-description">
                            <div class="card-panel-text">{{ $i18n.t('ACTIVITY_AMOUNT') }}</div>
                            <count-to v-loading="loading" :start-val="0" :end-val="this.data.activity_amount" :duration="3600" class="card-panel-num"/>
                        </div>
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="40" class="panel-group">
                <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
                    <div class="card-panel" >
                        <!--<div class="card-panel-icon-wrapper icon-people">
                            <svg-icon icon-class="peoples" class-name="card-panel-icon"/>
                        </div>-->
                        <div class="card-panel-description">
                            <div class="card-panel-text">{{ $i18n.t('D_VALUE') }}</div>
                            <count-to v-loading="loading" :start-val="0" :end-val="this.data.d_value" :duration="2600" class="card-panel-num"/>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </el-card>
        <el-dialog
            :title="$i18n.t('CHECK')"
            v-if="visible"
            :visible.sync="visible"
            :destroy-on-close="true"
            width="80%"
            style="height: 100%"
        >
            <!--            <team-table :mdl="mdl" :handle-close-dialog="handleCloseTeamDialog"></team-table>-->
            <data-table :time="date"  :handle-close-dialog="handleCloseDialog" :type="type"></data-table>
        </el-dialog>
    </div>
</template>

<script>
    import { get } from '@/api'
    import DataTable from '@/views/dashboard/components/data/DataTable'
    import CountTo from 'vue-count-to'

    export default {
        name: 'user_task_data_card',
        components: { DataTable, CountTo },
        props: {
            width: {
                type: String,
                default: '100%'
            },
            height: {
                type: String,
                default: '500px'
            }
        },
        created () {
            this.fetch()
        },
        data () {
            return {
                date: '',
                data: {},
                visible: false,
                type: 1,
                loading: false
            }
        },
        methods: {
            // 获取当前时间
            getFormatDate (date) {
                var month = date.getMonth() + 1
                var strDate = date.getDate()
                if (month >= 1 && month <= 9) {
                    month = '0' + month
                }
                if (strDate >= 0 && strDate <= 9) {
                    strDate = '0' + strDate
                }
                return date.getFullYear() + '-' + month + '-' + strDate + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
            },
            initTime () {
                const endDate = this.getFormatDate(new Date()).substr(0, 11) + '23:59:59'
                const beginDate = this.getFormatDate(new Date()).substr(0, 11) + '00:00:00'
                this.date = [beginDate, endDate]
            },
            fetch () {
                this.initTime()
                get({ time: this.date }).then((res) => {
                    this.data = res.result
                })
            },
            search () {
                get({ time: this.date }).then((res) => {
                    this.data = res.result
                })
            },
            // 关闭对话框
            handleCloseDialog () {
                this.visible = false
            },
            onCheckData (type) {
                this.type = type
                this.visible = true
            }
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
                    margin-left: 20px;
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
