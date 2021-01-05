<template>
    <div>
        <!-- 搜索组件 -->
        <search-form :items="formItems" :params="params" :on-submit="onSearch" :btn-loading="loading" />

        <!-- 表格区域 -->
        <div class="table-body">
            <!-- 左上角按钮 -->
            <div class="table-left-top">
                <el-button v-auth="'add'" type="primary" icon="el-icon-plus" @click="onAdd">{{ $i18n.t('CREATE_TASK') }}</el-button>
                <el-button v-auth="'enable'" type="success" icon="el-icon-circle-check" :disabled="checkedIds.length === 0" @click="onEnable()">{{ $i18n.t('ENABLE') }}</el-button>
                <el-button v-auth="'disable'" type="warning" icon="el-icon-custom-disable" :disabled="checkedIds.length === 0" @click="onDisable()">{{ $i18n.t('DISABLE') }}</el-button>
                <el-button v-auth="'delete'" type="danger" icon="el-icon-delete" :disabled="checkedIds.length === 0" @click="onDelete(checkedIds)">{{ $i18n.t('DELETE') }}</el-button>
            </div>

            <!-- 表格 -->
            <el-table border style="width: 100%;" stripe :data="data" v-loading="loading" @selection-change="handleSelectionChange">
                <el-table-column type="selection" align="center" prop="id" label="ID" :width="50" ></el-table-column>
                <el-table-column align="center" type="expand" :label="$i18n.t('TASK_INFO')"  fixed="left" :width="50">
                    <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item :label="$i18n.t('TASK_DESCRIPTION')">
                                <span>{{ props.row.description }}</span>
                            </el-form-item>
                            <el-form-item :label="$i18n.t('TASK_NUM')">
                                <span>{{ props.row.num }}</span>
                            </el-form-item>
                            <el-form-item :label="$i18n.t('REMAINING_QUANTITY')">
                                <span>{{ props.row.num - props.row.user_task_count }}</span>
                            </el-form-item>
                            <el-form-item :label="$i18n.t('SORT')">
                                <span>{{ props.row.sort }}</span>
                            </el-form-item>
                            <el-form-item :label="$i18n.t('CREATE_TIME')">
                                <span>{{ props.row.created_at }}</span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column align="center" sortable prop="id" label="ID" :width="100" fixed="left"></el-table-column>
                <el-table-column align="center" prop="user_id" :label="$i18n.t('MEMBER_ID')" :min-width="100"></el-table-column>
                <el-table-column align="center" prop="category_id" :label="$i18n.t('TASK_CATEGORY')" :min-width="100">
                    <template slot-scope="scope">
                        <span v-if="scope.row.category === null">-</span>
                        <span v-else>{{ scope.row.category.name_text }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="level" :label="$i18n.t('MEMBER_LEVEL')" :min-width="100">
                    <template slot-scope="scope">
                        <span v-if="scope.row.user_level === null">-</span>
                        <span v-else>{{ scope.row.user_level.name_text }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="title" :label="$i18n.t('TASK_TITLE')" :min-width="150">
                    <template slot-scope="scope">
                        <el-popover
                            placement="top-start"
                            :title="$i18n.t('TASK_TITLE')"
                            trigger="click"
                            :content="scope.row.title">
                            <el-button type="primary" slot="reference" plain>{{ $i18n.t('CLICK_TO_VIEW') }}</el-button>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="url" :label="$i18n.t('TASK_URL')" :min-width="100">
                    <template slot-scope="scope">
                        <el-link :href="scope.row.url" target="_blank" type="primary" icon="el-icon-link">
                            {{ $i18n.t('TASK_URL') }}
                        </el-link>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="amount" :label="$i18n.t('TASK_AMOUNT')" :min-width="100">
                    <template slot-scope="scope">
                        {{ scope.row.amount }}
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="status" :label="$i18n.t('STATUS')" :min-width="100">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status === 1" type="success">{{ $i18n.t('NORMAL') }}</el-tag>
                        <el-tag v-else-if="scope.row.status === 0" type="danger">{{ $i18n.t('DISABLED') }}</el-tag>
                        <el-tag v-else>-</el-tag>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="sort" :label="$i18n.t('SORT')" :min-width="50" ></el-table-column>
                <!-- 右侧按钮 -->
                <el-table-column align="center" :label="$i18n.t('ACTION')" fixed="right" :width="200">
                    <template slot-scope="scope">
                        <el-link v-auth="'edit'" icon="el-icon-edit" @click="onEDit(scope.row)">{{ $i18n.t('EDIT') }}</el-link>
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
    import SearchForm from '@/components/SearchForm'
    import { PAGES_SIZE } from '@/config/constants'
    import FormModal from '@/components/task/FormModal'
    import { getTasks, enableTasks, disableTasks, deleteTasks } from '@/api/task'
    import { getTaskCategories } from '@/api/taskCategory'
    import { getUserLevels } from '@/api/userLevel'

    export default {
        name: 'user_level',
        components: { SearchForm, FormModal },
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
                taskCategoryList: [],
                userLevelList: []
            }
        },
        created () {
            this.fetch()
            getTaskCategories().then((res) => {
                this.taskCategoryList = res.result
            })
            getUserLevels().then((res) => {
                this.userLevelList = res.result
            })
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
                    { title: this.$i18n.t('TASK_CATEGORY_NAME'), type: 'select_category', key: 'category_id', options: this.taskCategoryList },
                    { title: this.$i18n.t('MEMBER_LEVEL'), type: 'select_level', key: 'level', options: this.userLevelList },
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
                getTasks({ ...this.params, page: this.page.currentPage, perPage: this.page.perPage }).then((res) => {
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
                deleteTasks(ids.join(',')).then(() => {
                    this.$Message.success(this.$i18n.t('HANDLE_SUCCESS'))
                    setTimeout(() => {
                        this.fetch()
                    }, 500)
                })
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
                enableTasks(this.checkedIds.join(',')).then(() => {
                    this.$Message.success(this.$i18n.t('HANDLE_SUCCESS'))
                    setTimeout(() => {
                        this.fetch()
                    }, 500)
                })
            },
            // 禁用选中
            onDisable () {
                disableTasks(this.checkedIds.join(',')).then(() => {
                    this.$Message.success(this.$i18n.t('HANDLE_SUCCESS'))
                    setTimeout(() => {
                        this.fetch()
                    }, 500)
                })
            }
        }
    }
</script>

<style lang="less" scoped>
</style>
