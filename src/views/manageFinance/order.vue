<template>
    <div>
        <el-tabs v-model="activeName">
            <el-tab-pane :label="$i18n.t('ORDER_LIST')" name="order">
                <mf-order-list v-if="activeName === 'order'"></mf-order-list>
            </el-tab-pane>
            <el-tab-pane :label="$i18n.t('INCOME_RECORD')" name="income">
                <mf-income-list v-if="activeName === 'income'"></mf-income-list>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import MfOrderList from '@/views/manageFinance/components/MFOrderList'
    import MfIncomeList from '@/views/manageFinance/components/MFIncomeList'

    export default {
        name: 'order',
        components: { MfIncomeList, MfOrderList },
        data () {
            return {
                activeName: 'order'
            }
        }
    }
</script>

<style lang="less" scoped>
</style>
