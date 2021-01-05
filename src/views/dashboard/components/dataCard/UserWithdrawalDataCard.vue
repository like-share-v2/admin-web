<template>
    <div :style="{height:height,width:width}">
        <el-card class="box-card" shadow="never" v-loading="loading" style="height: 95%">
            <div slot="header" class="clearfix">
                <span style="color: #3888fa">{{ $i18n.t('WITHDRAWAL_DATA_OF_USERS') }}</span>
            </div>
            <div class="text item">
                {{ $i18n.t('QUANTITY_TO_BE_AUDITED') }}: {{ withdrawalData.withdrawal_audit_count }}
            </div>
            <div class="text item">
                {{ $i18n.t('PASSED_QUANTITY') }}: {{ withdrawalData.withdrawal_pass_count }}
            </div>
            <div class="text item">
                {{ $i18n.t('FAILED_QUANTITY') }}: {{ withdrawalData.withdrawal_refuse_count }}
            </div>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: 'user_task_data_card',
        props: {
            loading: {
                type: Boolean,
                required: true
            },
            withdrawalData: {
                type: Object,
                required: true
            },
            width: {
                type: String,
                default: '100%'
            },
            height: {
                type: String,
                default: '300px'
            }
        }
    }
</script>
