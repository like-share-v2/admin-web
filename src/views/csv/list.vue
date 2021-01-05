<template>
    <div>
        <!-- 搜索组件 -->
<!--        <search-form :items="formItems" :params="params" :on-submit="onSearch" :btn-loading="loading" />-->

        <!-- 表格区域 -->
        <div class="table-body">
            <!-- 左上角按钮 -->
            <div class="table-left-top">
<!--                <el-button v-auth="'add'" type="primary" icon="el-icon-plus" @click="onAdd">{{ $i18n.t('CREATE_TASK') }}</el-button>-->
<!--                <el-button v-auth="'enable'" type="success" icon="el-icon-circle-check" :disabled="checkedIds.length === 0" @click="onEnable()">{{ $i18n.t('ENABLE') }}</el-button>-->
<!--                <el-button v-auth="'disable'" type="warning" icon="el-icon-custom-disable" :disabled="checkedIds.length === 0" @click="onDisable()">{{ $i18n.t('DISABLE') }}</el-button>-->
<!--                <el-button v-auth="'delete'" type="danger" icon="el-icon-delete" :disabled="checkedIds.length === 0" @click="onDelete(checkedIds)">{{ $i18n.t('DELETE') }}</el-button>-->
            </div>

            <!-- 表格 -->
            <el-table border style="width: 100%;" stripe :data="data" v-loading="loading" @selection-change="handleSelectionChange">
                <el-table-column type="selection" align="center" prop="id" label="ID" :width="50" ></el-table-column>
                <el-table-column align="center" sortable prop="id" label="ID" :width="100" fixed="left"></el-table-column>
                <el-table-column align="center" prop="filename" :label="$i18n.t('FILE_NAME')" :min-width="100">
                    <template slot-scope="scope">
                        <el-link :href="baseUrl+'csv/download'+'?filename='+scope.row.filename" target="_blank">{{ scope.row.filename }}</el-link>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="created_at" :label="$i18n.t('CREATE_TIME')" :min-width="150"></el-table-column>
                <!-- 右侧按钮 -->
                <!--<el-table-column align="center" :label="$i18n.t('ACTION')" fixed="right" :width="200">
                    <template slot-scope="scope">
                        <el-link v-auth="'edit'" icon="el-icon-edit" @click="onEDit(scope.row)">{{ $i18n.t('EDIT') }}</el-link>
                    </template>
                </el-table-column>-->

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
            size="600px"
        >
            <form-modal :mdl="mdl" :handle-close-drawer="handleCloseDrawer"></form-modal>
        </el-drawer>
    </div>
</template>
<style>
    .demo-table-expand {
        font-size: 0;
    }
    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }
    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }
</style>
<script>
    import { PAGES_SIZE } from '@/config/constants'
    import FormModal from '@/components/task/FormModal'
    import { get } from '@/api/csv'

    export default {
        name: 'user_level',
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
                dialogTableVisible: false,
                mdl: {},
                checkedIds: [],
                baseUrl: process.env.VUE_APP_API_BASE_URL
            }
        },
        created () {
            this.fetch()
        },
        computed: {
            formItems () {
                // 用户状态筛选
                const statusOptions = [
                    { label: this.$i18n.t('NORMAL'), value: 1 },
                    { label: this.$i18n.t('DISABLED'), value: 0 }
                ]
                // 构建搜索表单
                return [
                    { title: this.$i18n.t('TASK_TITLE'), type: 'input', key: 'title' },
                    { title: this.$i18n.t('STATUS'), type: 'select', key: 'status', options: statusOptions },
                    { title: this.$i18n.t('CREATE_TIME'), type: 'date-range', key: 'created_at' }
                ]
            },
            isShowDivider () {
                const { meta } = this.$store.getters.router
                return meta.actions.indexOf('update') > -1 && meta.actions.indexOf('delete') > -1
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
                get({ ...this.params, page: this.page.currentPage, perPage: this.page.perPage }).then((res) => {
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
            // 关闭抽屉方法
            handleCloseDrawer () {
                this.$refs.drawer.closeDrawer()
            },
            // 选中的ID
            handleSelectionChange (rows) {
                this.checkedIds = rows.map(item => item.id)
            },
            // 删除
            onDelete (ids) {
            },
            // 修改
            onEDit (row) {
                this.mdl = Object.assign({}, row)
                this.drawer = true
            },
            // 添加会员等级
            onAdd () {
                this.mdl = Object.assign({}, {
                    id: 0,
                    title: '',
                    sort: 0,
                    status: 1
                })
                this.drawer = true
            },
            // 启用选中
            onEnable () {
            },
            // 禁用选中
            onDisable () {
            }
        }
    }
</script>

<style lang="less" scoped>
</style>
