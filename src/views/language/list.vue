<template>
    <div>
        <!-- 搜索组件 -->
        <search-form :items="formItems" :params="params" :on-submit="onSearch" :btn-loading="loading" />

        <!-- 表格区域 -->
        <div class="table-body">
            <!-- 左上角按钮 -->
            <div class="table-left-top">
                <el-button v-auth="'add'" type="primary" icon="el-icon-plus" @click="onAdd">{{ $i18n.t('CREATE_LANGUAGE') }}</el-button>
                <el-button v-auth="'enable'" type="success" icon="el-icon-circle-check" :disabled="checkedIds.length === 0" @click="onEnable()">{{ $i18n.t('ENABLE') }}</el-button>
                <el-button v-auth="'disable'" type="warning" icon="el-icon-custom-disable" :disabled="checkedIds.length === 0" @click="onDisable()">{{ $i18n.t('HIDDEN') }}</el-button>
                <el-button v-auth="'delete'" type="danger" icon="el-icon-delete" :disabled="checkedIds.length === 0" @click="onDelete(checkedIds)">{{ $i18n.t('DELETE') }}</el-button>
            </div>

            <!-- 表格 -->
            <el-table border style="width: 100%;" stripe :data="data" v-loading="loading" @selection-change="handleSelectionChange" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" row-key="id">
                <el-table-column type="selection" align="center" prop="id" label="ID" :width="50" fixed="left"></el-table-column>
                <el-table-column align="center" sortable prop="id" label="ID" :width="100" fixed="left"></el-table-column>
                <el-table-column align="center" prop="key" label="key" :min-width="150"></el-table-column>
                <el-table-column align="center" prop="local" :label="$i18n.t('COUNTRY_CODE')" :min-width="150"></el-table-column>
                <el-table-column align="center" prop="value" :label="$i18n.t('LANGUAGE_VALUE')" :min-width="150"></el-table-column>
                <el-table-column align="center" prop="country" :label="$i18n.t('COUNTRY')" :min-width="150">
                    <template slot-scope="scope">
                        <span v-if="scope.row.country === null">-</span>
                        <span v-else>{{ scope.row.country.name_text }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="country" :label="$i18n.t('LANGUAGE')" :min-width="150">
                    <template slot-scope="scope">
                        <span v-if="scope.row.country === null">-</span>
                        <span v-else>{{ scope.row.country.lang }}</span>
                    </template>
                </el-table-column>
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

            <!-- 分页 -->
            <div class="table-pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next, ->, sizes"
                    :page-size.sync="page.perPage"
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

<script>
    import SearchForm from '@/components/SearchForm'
    import FormModal from '@/components/language/FormModal'
    import { PAGES_SIZE } from '@/config/constants'
    import { getLanguageList, deleteLanguage } from '@/api/language'
    import { getCountryList } from '@/api/country'

    export default {
        name: 'user',
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
                mdl: {},
                checkedIds: [],
                countryList: []
            }
        },
        created () {
            this.fetch()
            getCountryList().then((res) => {
                this.countryList = res.result
            })
        },
        computed: {
            formItems () {
                // 用户状态筛选
                const statusOptions = [
                    { label: this.$i18n.t('NORMAL'), value: 1 },
                    { label: this.$i18n.t('HIDDEN'), value: 0 }
                ]
                // 构建搜索表单
                return [
                    { title: this.$i18n.t('LANGUAGE'), type: 'select_country_lang', key: 'local', maxlength: 50, options: this.countryList },
                    { title: 'key', type: 'input', key: 'key', maxlength: 50 },
                    { title: this.$i18n.t('LANGUAGE_VALUE'), type: 'input', key: 'value', maxlength: 50 },
                    { title: this.$i18n.t('STATUS'), type: 'select', key: 'status', options: statusOptions }
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
                getLanguageList({ ...this.params, page: this.page.currentPage, perPage: this.page.perPage }).then((res) => {
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
            // 启用选中
            onEnable () {
            },
            // 禁用选中
            onDisable () {
            },
            // 添加
            onAdd () {
                this.mdl = Object.assign({}, {
                    id: 0,
                    status: 1,
                    title: '',
                    content: '',
                    sort: 0
                })
                this.drawer = true
            },
            // 修改
            onEDit (row) {
                this.mdl = Object.assign({}, row)
                this.drawer = true
            },
            // 删除
            onDelete (ids) {
                deleteLanguage(ids.join(',')).then(() => {
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
