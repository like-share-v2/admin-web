<template>
    <div :style="{height:height,width:width}">
        <el-card class="box-card" shadow="never" v-loading="loading" style="height: 95%">
            <div slot="header" class="clearfix">
                <span style="color: #3888fa">{{ $i18n.t('USER_TASK_DATA') }}</span>
            </div>
            <div class="text item">
                {{ $i18n.t('NUMBER_OF_TASKS_IN_PROGRESS') }}: {{ userTaskData.user_task_progress_count }}
            </div>
            <div class="text item">
                {{ $i18n.t('NUMBER_OF_TASKS_TO_BE_AUDITED') }}: {{ userTaskData.user_task_audit_count }}
            </div>
            <div class="text item">
                {{ $i18n.t('NUMBER_OF_TASKS_PASSED') }}: {{ userTaskData.user_task_pass_count }}
            </div>
            <div class="text item">
                {{ $i18n.t('NUMBER_OF_FAILED_TASKS') }}: {{ userTaskData.user_task_refuse_count }}
            </div>
            <div class="text item">
                {{ $i18n.t('NUMBER_OF_CANCELED_TASKS') }}: {{ userTaskData.user_task_cancel_count }}
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
</style>

<script>
    export default {
        name: 'user_task_data_card',
        props: {
            userTaskData: {
                type: Object,
                required: true
            },
            loading: {
                type: Boolean,
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
