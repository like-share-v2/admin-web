<template>
    <div>
        <el-row :gutter="15" v-loading="teamLoading">
            <el-col :span="8">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>{{ $i18n.t('TEAM_LEVEL_ONE') }}({{ teamOneData.length }})</span>
                    </div>
                    <div v-if="teamOneData.length === 0">
                        无
                    </div>
                    <div v-else v-for="(low, index) in teamOneData" :key="index" class="text item">
                        <el-divider v-if="index !== 0"></el-divider>
                        <el-link @click="onCheck(low)">{{ low.user.nickname }}({{ low.user.user_level.name_text }})</el-link>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>{{ $i18n.t('TEAM_LEVEL_TWO') }}({{ teamTwoData.length }})</span>
                    </div>
                    <div v-if="teamTwoData.length === 0">
                        无
                    </div>
                    <div v-else v-for="(low, index) in teamTwoData" :key="index" class="text item">
                        <el-divider v-if="index !== 0"></el-divider>
                        <el-link @click="onCheck(low)">{{ low.user.nickname }}({{ low.user.user_level.name_text }})</el-link>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>{{ $i18n.t('TEAM_LEVEL_THREE') }}({{ teamThreeData.length }})</span>
                    </div>
                    <div v-if="teamThreeData.length === 0">
                        无
                    </div>
                    <div v-else v-for="(low, index) in teamThreeData" :key="index" class="text item">
                        <el-divider v-if="index !== 0"></el-divider>
                        <el-link @click="onCheck(low)">{{ low.user.nickname }}({{ low.user.user_level.name_text }})</el-link>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <el-dialog
            :title="$i18n.t('CHECK_MEMBER')"
            :visible.sync="checkMemberDialogVisible"
            append-to-body
        >
            <el-form ref="form" :inline="true" label-width="160px">
                <div>
                    <el-form-item label="用户ID">
                        <span>{{ memberData.id }}</span>
                    </el-form-item>
                    <el-form-item label="上级ID">
                        <span>{{ memberData.parent_id }}</span>
                    </el-form-item>
                </div>
                <div>
                    <el-form-item label="会员等级" >
                        <span>{{ memberData.user_level.name_text }}</span>
                    </el-form-item>
                </div>
                <div>
                    <el-form-item label="会员账号">
                        <span>{{ memberData.account }}</span>
                    </el-form-item>
                </div>
                <div>
                    <el-form-item label="手机号">
                        {{ memberData.phone }}
                    </el-form-item>
                </div>
                <div>
                    <el-form-item label="昵称">
                        {{ memberData.nickname }}
                    </el-form-item>
                </div>
                <div>
                    <el-form-item label="余额">
                        {{ memberData.balance }}
                    </el-form-item>
                </div>
                <div>
                    <el-form-item label="上次登录时间">
                        {{ memberData.last_login_time }}
                    </el-form-item>
                </div>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    import { getTeam } from '@/api/member'
    import { PAGES_SIZE } from '@/config/constants'

    export default {
        name: 'teamTable',
        props: {
            mdl: {
                type: Object,
                required: true
            },
            handleCloseDialog: {
                type: Function,
                required: true
            }
        },
        watch: {
            mdl: {
                handler (newVal) {
                    // console.log(newVal)
                    this.btnDisable = false
                },
                deep: true
            }
        },
        created () {
            getTeam({ parent_id: this.mdl.id }).then((res) => {
                this.teamOneData = res.result.level_one
                this.teamTwoData = res.result.level_two
                this.teamThreeData = res.result.level_three
            }).finally(() => {
                this.teamLoading = false
            })
        },
        data () {
            return {
                // 启用状态选项
                enableOptions: [
                    { label: this.$i18n.t('ENABLE'), value: 1 },
                    { label: this.$i18n.t('DISABLE'), value: 2 }
                ],
                rules: {},
                errors: {
                    name: '',
                    title: '',
                    group: '',
                    type: '',
                    tips: '',
                    format: ''
                },
                page: {
                    total: 0,
                    currentPage: 1,
                    perPage: PAGES_SIZE[0],
                    pageCount: 1
                },
                submitLogin: false,
                btnDisable: false,
                errorMessage: '',
                checkMemberDialogVisible: false,
                userLevelList: [],
                teamOneData: [],
                teamTwoData: [],
                teamThreeData: [],
                memberData: {
                    id: 0,
                    parent_id: 0,
                    level: '',
                    account: '',
                    phone: '',
                    nickname: '',
                    avatar: '',
                    gender: 0,
                    balance: 0,
                    credit: 0,
                    status: 0,
                    last_login_time: '',
                    created_at: '',
                    user_level: {
                        level: 0,
                        name: ''
                    }
                },
                teamLoading: true
            }
        },
        methods: {
            onCheck (low) {
                this.memberData = low.user
                this.checkMemberDialogVisible = true
            }
        }
    }
</script>

<style lang="less" scoped>
</style>

<style>

    .box-card {
        width: 80%;
    }
</style>
