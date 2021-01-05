<template>
    <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
    /* eslint-disable */

    import echarts from 'echarts'

    require('echarts/theme/macarons') // echarts theme
    import resize from '../mixins/resize'

    export default {
        mixins: [resize],
        props: {
            className: {
                type: String,
                default: 'chart'
            },
            width: {
                type: String,
                default: '100%'
            },
            height: {
                type: String,
                default: '300px'
            },
            userTaskCategoryData: {
                type: Object,
                required: true
            }
        },
        data() {
            return {
                chart: null
            }
        },
        mounted() {
            this.$nextTick(() => {
                this.initChart()
            })
        },
        beforeDestroy() {
            if (!this.chart) {
                return
            }
            this.chart.dispose()
            this.chart = null
        },
        watch: {
            userTaskCategoryData: {
                deep: true,
                handler (newVal) {
                    this.initChart()
                }
            }
        },
        methods: {
            initChart() {
                this.chart = echarts.init(this.$el, 'macarons')

                /*this.chart.setOption({
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b} : {c} ({d}%)'
                    },
                    legend: {
                        left: 'center',
                        bottom: '10',
                        // data: ['Industries', 'Technology', 'Forex', 'Gold', 'Forecasts'],
                        data: this.userTaskCategoryData.name,
                    },
                    series: [
                        {
                            name: '用户领取任务分类',
                            type: 'pie',
                            roseType: 'radius',
                            radius: [15, 95],
                            center: ['50%', '38%'],
                            // data: [
                            //     {value: 320, name: 'Industries'},
                            //     {value: 240, name: 'Technology'},
                            //     {value: 149, name: 'Forex'},
                            //     {value: 100, name: 'Gold'},
                            //     {value: 59, name: 'Forecasts'}
                            // ],
                            data: this.userTaskCategoryData.data,
                            animationEasing: 'cubicInOut',
                            animationDuration: 2600
                        }
                    ]
                })*/

                this.chart.setOption({
                    title: {
                        text: this.$i18n.t('USER_COLLECTION_TASK_CLASSIFICATION'),
                        subtext: this.$i18n.t('REJECTED_AND_CANCELLED'),
                        left: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b} : {c} ({d}%)'
                    },
                    legend: {
                        left: 'center',
                        bottom: '10',
                        data: this.userTaskCategoryData.name,
                    },
                    series: [
                        {
                            name: '领取数量',
                            type: 'pie',
                            radius: '50%',
                            center: ['50%', '50%'],
                            data: this.userTaskCategoryData.data,
                            emphasis: {
                                itemStyle: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                })
            }
        }
    }
</script>
