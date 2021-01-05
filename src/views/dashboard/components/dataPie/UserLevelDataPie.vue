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
            userLevelData: {
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
            userLevelData: {
                deep: true,
                handler (newVal) {
                    this.initChart()
                }
            }
        },
        methods: {
            initChart() {
                this.chart = echarts.init(this.$el, 'macarons')

                this.chart.setOption({
                    title: {
                        text: this.$i18n.t('USER_MEMBER_LEVEL'),
                        left: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b} : {c} ({d}%)'
                    },
                    legend: {
                        left: 'center',
                        bottom: '10',
                        data: this.userLevelData.name,
                    },
                    series: [
                        {
                            name: this.$i18n.t('NUMBER_OF_USERS'),
                            type: 'pie',
                            radius: '50%',
                            center: ['50%', '50%'],
                            data: this.userLevelData.data,
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
