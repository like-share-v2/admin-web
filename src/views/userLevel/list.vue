<template>
    <div>
        <!-- 搜索组件 -->
        <search-form :items="formItems" :params="params" :on-submit="onSearch" :btn-loading="loading" />

        <!-- 表格区域 -->
        <div class="table-body">
            <!-- 左上角按钮 -->
            <div class="table-left-top">
                <el-button v-auth="'add'" type="primary" icon="el-icon-plus" @click="onAdd">{{ $i18n.t('CREATE_USER_LEVEL') }}</el-button>
                <el-button v-auth="'delete'" type="danger" icon="el-icon-delete" :disabled="checkedIds.length === 0" @click="onDelete(checkedIds)">{{ $i18n.t('DELETE') }}</el-button>
            </div>

            <!-- 表格 -->
            <el-table border style="width: 100%;" stripe :data="data" v-loading="loading" @selection-change="handleSelectionChange">
                <el-table-column type="selection" align="center" prop="id" label="ID" :width="50" ></el-table-column>
                <el-table-column align="center" type="expand" :label="$i18n.t('REBATE_INFO')"  fixed="left" :width="50">
                    <template slot-scope="scope">
                        <div>
                            <el-table stripe border style="width: 100%;" :data="scope.row.level_rebate">
                                <el-table-column align="center" prop="type" :label="$i18n.t('USER_LEVEL_TYPE')" :min-width="150">
                                    <template slot-scope="slotScope">
                                        <span v-if="slotScope.row.type === 1" >{{ $i18n.t('USER_LEVEL_TYPE_1') }}</span>
                                        <span v-else-if="slotScope.row.type === 2">{{ $i18n.t('USER_LEVEL_TYPE_2') }}</span>
                                        <span v-else>-</span>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" prop="p_one_rebate" :label="$i18n.t('P_ONE_REBATE')" :min-width="150">
                                    <template slot-scope="slotScope">
                                        <span v-if="slotScope.row.type === 1" >{{ slotScope.row.p_one_rebate }}{{ $i18n.t('YUAN') }}</span>
                                        <span v-else-if="slotScope.row.type === 2">{{ slotScope.row.p_one_rebate * 100 }}%</span>
                                        <span v-else>-</span>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" prop="p_two_rebate" :label="$i18n.t('P_TWO_REBATE')" :min-width="170">
                                    <template slot-scope="slotScope">
                                        <span v-if="slotScope.row.type === 1" >{{ slotScope.row.p_two_rebate }}{{ $i18n.t('YUAN') }}</span>
                                        <span v-else-if="slotScope.row.type === 2">{{ slotScope.row.p_two_rebate * 100 }}%</span>
                                        <span v-else>-</span>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" prop="p_three_rebate" :label="$i18n.t('P_THREE_REBATE')" :min-width="170">
                                    <template slot-scope="slotScope">
                                        <span v-if="slotScope.row.type === 1" >{{ slotScope.row.p_three_rebate }}{{ $i18n.t('YUAN') }}</span>
                                        <span v-else-if="slotScope.row.type === 2">{{ slotScope.row.p_three_rebate * 100 }}%</span>
                                        <span v-else>-</span>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column align="center" sortable prop="id" label="ID" :width="100" fixed="left"></el-table-column>
                <el-table-column align="center" prop="level" :label="$i18n.t('MEMBER_LEVEL')" :min-width="100"></el-table-column>
                <el-table-column align="center" prop="name" :label="$i18n.t('LEVEL_NAME')" :min-width="100">
                    <template slot-scope="scope">
                        <span>{{ scope.row.name }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="icon" :label="$i18n.t('MEMBER_LEVEL_ICON')" :min-width="150">
                    <template slot-scope="scope">
<!--                        <el-button v-if="scope.row.icon === ''" type="info" disabled>查看图片</el-button>-->
<!--                        <el-button v-else type="primary" @click="checkPicture(scope.row.icon)">查看图片</el-button>-->
                        <el-image style="width: 50px;height: 50px" :src="config.staticUrl + scope.row.icon" fit="scale-down"></el-image>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="price" :label="$i18n.t('LEVEL_PRICE')" :min-width="150">
                    <template slot-scope="scope">
                        {{ scope.row.price }}
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="type" :label="$i18n.t('LEVEL_TYPE')" :min-width="150">
                    <template slot-scope="scope">
                        <span v-if="scope.row.type === 0">{{ $i18n.t('TYPE_0') }}</span>
                        <span v-else-if="scope.row.type === 1">{{ $i18n.t('TYPE_1') }}</span>
                        <span v-else>-</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="task_num" :label="$i18n.t('LEVEL_TASK_NUM')" :min-width="150"></el-table-column>
                <el-table-column align="center" prop="max_buy_num" :label="$i18n.t('MAX_BUY_NUM')" :min-width="150"></el-table-column>
                <el-table-column align="center" sortable prop="created_at" :label="$i18n.t('CREATE_TIME')" :min-width="170"></el-table-column>
                <!-- 右侧按钮 -->
                <el-table-column align="center" :label="$i18n.t('ACTION')" fixed="right" :width="200">
                    <template slot-scope="scope">
                        <el-link v-auth="'edit'" icon="el-icon-edit" @click="onEDit(scope.row)">{{ $i18n.t('EDIT') }}</el-link>
                        <span v-auth="'delete'" >
                            <el-divider direction="vertical"></el-divider>
                            <poptip
                                confirm
                                :title="$i18n.t('CONFIRM_DELETE_TIP')"
                                @on-ok="onDelete([scope.row.id])"
                                :ok-text="$i18n.t('CONFIRM')"
                                :cancel-text="$i18n.t('CANCEL')"
                            >
                                <el-link icon="el-icon-delete">{{ $i18n.t('DELETE') }}</el-link>
                            </poptip>
                        </span>
                    </template>
                </el-table-column>
            </el-table>

            <div>
                <el-image-viewer v-if="isShowPictures" :on-close="() => { isShowPictures = false }" :url-list="picture">
                </el-image-viewer>
            </div>

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
            size="800px"
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
    import { getUserLevels, deleteUserLevel } from '@/api/userLevel'
    import FormModal from '@/components/userLevel/FormModal'
    import configs from '@/config'
    import ElImageViewer from 'element-ui/packages/image/src/image-viewer'

    export default {
        name: 'user_level',
        components: { SearchForm, FormModal, ElImageViewer },
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
                isShowPictures: false,
                picture: [],
                config: configs
            }
        },
        created () {
            this.fetch()
        },
        computed: {
            formItems () {
                // 构建搜索表单
                return [
                    { title: this.$i18n.t('MEMBER_LEVEL'), type: 'input', key: 'level' },
                    { title: this.$i18n.t('LEVEL_NAME'), type: 'input', key: 'name' }
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
                getUserLevels({ ...this.params, page: this.page.currentPage, perPage: this.page.perPage }).then((res) => {
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
                deleteUserLevel(ids.join(',')).then(() => {
                    this.$Message.success(this.$i18n.t('HANDLE_SUCCESS'))
                    setTimeout(() => {
                        this.fetch()
                    }, 500)
                })
            },
            // 修改
            onEDit (row) {
                var rechargePOneRebate = 0
                var rechargePTwoRebate = 0
                var rechargePThreeRebate = 0
                var taskPOneRebate = 0
                var taskPTwoRebate = 0
                var taskPThreeRebate = 0
                row.level_rebate.forEach(function (value) {
                    if (value.type === 1) {
                        rechargePOneRebate = value.p_one_rebate
                        rechargePTwoRebate = value.p_two_rebate
                        rechargePThreeRebate = value.p_three_rebate
                    } else {
                        taskPOneRebate = value.p_one_rebate * 100
                        taskPTwoRebate = value.p_two_rebate * 100
                        taskPThreeRebate = value.p_three_rebate * 100
                    }
                })
                this.mdl = Object.assign({}, {
                    id: row.id,
                    name: row.name,
                    icon: row.icon,
                    level: row.level,
                    price: row.price,
                    task_num: row.task_num,
                    recharge_p_one_rebate: rechargePOneRebate,
                    recharge_p_two_rebate: rechargePTwoRebate,
                    recharge_p_three_rebate: rechargePThreeRebate,
                    task_p_one_rebate: taskPOneRebate,
                    task_p_two_rebate: taskPTwoRebate,
                    task_p_three_rebate: taskPThreeRebate,
                    day: row.day,
                    hour: row.hour,
                    minute: row.minute,
                    type: row.type,
                    max_buy_num: row.max_buy_num
                })
                this.drawer = true
            },
            // 添加会员等级
            onAdd () {
                this.mdl = Object.assign({}, {
                    id: 0,
                    name: '',
                    icon: '',
                    day: 0,
                    hour: 0,
                    minute: 0,
                    type: 0,
                    price: 0
                })
                this.drawer = true
            },
            checkPicture (picture) {
                this.isShowPictures = true

                this.picture[0] = this.config.staticUrl + picture
            }
        }
    }
</script>

<style lang="less" scoped>
</style>
