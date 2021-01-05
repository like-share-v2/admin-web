<template>
    <div>
        <!-- 搜索组件 -->
<!--        <search-form :items="formItems" :params="params" :on-submit="onSearch" :btn-loading="loading" />-->

        <!-- 表格区域 -->
        <div class="table-body">
            <!-- 左上角按钮 -->
            <div class="table-right-top">
                <el-button v-auth="'add'" type="success" icon="el-icon-plus" @click="onAdd">{{ $i18n.t('ADD_WITHDRAWAL_RULE') }}</el-button>
            </div>

            <!-- 表格 -->
            <el-table border style="width: 100%;" stripe :data="data" v-loading="loading">
                <el-table-column align="center" prop="id" label="ID" :width="100" fixed="left"></el-table-column>
                <el-table-column align="center" prop="name" :label="$i18n.t('RULE_NAME')" :min-width="200"></el-table-column>
                <el-table-column align="center" prop="active_sub" :label="$i18n.t('ACTIVE_SUB_COUNT')" :min-width="200"></el-table-column>
                <el-table-column align="center" prop="withdrawal_count" :label="$i18n.t('WITHDRAWAL_COUNT')" :min-width="200"></el-table-column>
                <el-table-column align="center" prop="is_enable" :label="$i18n.t('IS_ENABLE')" :min-width="150">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.is_enable" type="success">{{ $i18n.t('ENABLE') }}</el-tag>
                        <el-tag v-else type="info">{{ $i18n.t('DISABLED') }}</el-tag>
                    </template>
                </el-table-column>
                <!-- 右侧按钮 -->
                <el-table-column align="center" :label="$i18n.t('ACTION')" fixed="right" :width="200">
                    <template slot-scope="scope">
                        <span v-if="!scope.row.is_system">
                            <el-link v-auth="'update'" icon="el-icon-edit" @click="onUpdate(scope.row)">{{ $i18n.t('EDIT') }}</el-link>
                            <el-divider direction="vertical"></el-divider>
                            <poptip
                                confirm
                                :title="$i18n.t('CONFIRM_DELETE_TIP')"
                                @on-ok="onDelete(scope.row)"
                                :ok-text="$i18n.t('CONFIRM')"
                                :cancel-text="$i18n.t('CANCEL')"
                            >
                                <el-link v-auth="'delete'" icon="el-icon-delete">{{ $i18n.t('DELETE') }}</el-link>
                            </poptip>
                        </span>
                        <span v-else>-</span>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <div class="table-pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next, ->, sizes"
                    :page-size.sync="page.perPage"
                    :total="page.total"
                    :page-count="page.pageCount"
                    :current-page.sync="page.currentPage"
                    :page-sizes="PAGES_SIZE"
                    @current-change="onCurrentPageChange"
                    @size-change="onPerPageChange"
                >
                </el-pagination>
            </div>
        </div>
        <el-drawer
            :title="$i18n.t(mdl.id > 0 ? 'EDIT' : 'ADD')"
            :visible.sync="drawer"
            destroy-on-close
            ref="drawer"
            size="400px"
        >
            <form-modal :mdl="mdl" :handle-close-drawer="handleCloseDrawer"></form-modal>
        </el-drawer>
    </div>
</template>

<script>
    import { getWithdrawalRule1List, deleteWithdrawalRule1List } from '@/api/withdrawalRule1'
    import FormModal from './components/FormModal'
    import { PAGES_SIZE } from '@/config/constants'

    export default {
        name: 'resource',
        components: { FormModal },
        data () {
            return {
                PAGES_SIZE,
                params: {},
                data: [],
                page: {
                    total: 0,
                    currentPage: 1,
                    perPage: PAGES_SIZE[0],
                    pageCount: 1
                },
                loading: false,
                drawer: false,
                mdl: {}
            }
        },
        created () {
            this.fetch()
        },
        computed: {
            formItems () {
                // 构建搜索表单
                return [
                    { title: this.$i18n.t('RESOURCE_NAME'), type: 'input', key: 'name', maxlength: 50 },
                    { title: this.$i18n.t('RESOURCE_PATH'), type: 'input', key: 'path', maxlength: 50 }
                ]
            }
        },
        methods: {
            // 搜索按钮
            onSearch () {
                this.fetch()
            },
            // 从接口拉取数据
            fetch () {
                this.loading = true
                getWithdrawalRule1List({ ...this.params, page: this.page.currentPage, perPage: this.page.perPage }).then((res) => {
                    // eslint-disable-next-line camelcase
                    const { data, last_page, total } = res.result
                    this.data = data
                    this.page.total = total
                    // eslint-disable-next-line camelcase
                    this.page.pageCount = last_page
                }).finally(() => {
                    this.loading = false
                })
            },
            // 页数切换
            onCurrentPageChange (page) {
                this.page.currentPage = page
                this.fetch()
            },
            // 每页显示数量修改
            onPerPageChange (perPage) {
                this.page.perPage = perPage
                this.fetch()
            },
            // 修改
            onUpdate (row) {
                this.mdl = Object.assign({}, row)
                this.drawer = true
            },
            // 删除
            onDelete (row) {
                deleteWithdrawalRule1List(row.id).then(() => {
                    this.$Message.success(this.$i18n.t('HANDLE_SUCCESS'))
                    setTimeout(() => {
                        this.fetch()
                    }, 500)
                })
            },
            onAdd () {
                this.mdl = Object.assign({}, {
                    id: 0,
                    name: '',
                    active_sub: '',
                    withdrawal_count: '',
                    is_enable: true
                })
                this.drawer = true
            },
            // 关闭抽屉方法
            handleCloseDrawer () {
                this.$refs.drawer.closeDrawer()
            }
        }
    }
</script>

<style lang="less" scoped>
</style>
