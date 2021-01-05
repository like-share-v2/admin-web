<template>
    <div>
        <el-tabs v-model="activeName">
            <el-tab-pane :label="$i18n.t('ACCOUNT_MANAGE')" name="yuebao">
                <yuebao-account v-if="activeName === 'yuebao'"></yuebao-account>
            </el-tab-pane>
            <el-tab-pane :label="$i18n.t('COIN_LOG')" name="coin_log">
                <yuebao-coin-log v-if="activeName === 'coin_log'"></yuebao-coin-log>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import YuebaoAccount from '@/views/manageFinance/components/yuebaoAccount'
    import YuebaoCoinLog from '@/views/manageFinance/components/yuebaoCoinLog'

    export default {
        name: 'account',
        components: { YuebaoCoinLog, YuebaoAccount },
        data () {
            return {
                activeName: 'yuebao'
            }
        }
    }
</script>

<style lang="less" scoped>
</style>
