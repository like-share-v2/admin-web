import * as loginService from '@/api/default/account'
import { BasicLayout, RouteView } from '@/layout'

// 路由表
const constantRouterComponents = {
    BasicLayout,
    'dashboard/workplace': () => import('@/views/dashboard/workplace'),
    'dashboard/workplace3': () => import('@/views/dashboard/index'),
    // 后台管理模块相关路由组件
    'system/setting': () => import('@/views/system/setting'),
    'system/config': () => import('@/views/system/config'),
    'system/user': () => import('@/views/system/user'),
    'system/group': () => import('@/views/system/group'),
    'system/menu': () => import('@/views/system/menu'),
    'system/resource': () => import('@/views/system/resource'),
    // 业务组件
    // 会员列表
    'member/list': () => import('@/views/member/list'),
    // 会员等级列表
    'user_level/list': () => import('@/views/userLevel/list'),
    // 任务类别列表
    'task_category/list': () => import('@/views/taskCategory/list'),
    // 任务列表
    'task/list': () => import('@/views/task/list'),
    // 审核任务
    'user_task/list': () => import('@/views/userTask/list'),
    // 帮助手册列表
    'help/list': () => import('@/views/help/list'),
    // 充值记录
    'recharge/list': () => import('@/views/userRecharge/list'),
    // 用户账单列表
    'user_bill/list': () => import('@/views/userBill/list'),
    // 新闻列表
    'news/list': () => import('@/views/news/list'),
    // 充值审核列表
    'manual_recharge/list': () => import('@/views/userManualRecharge/list'),
    // 银行卡充值审核列表
    'bank_recharge/list': () => import('@/views/userBankRecharge/list'),
    // 提现列表
    'withdrawal/list': () => import('@/views/userWithdrawal/list'),
    // 使用协议
    'help/usage_agreement': () => import('@/views/usageAgreement/usageAgreement'),
    // 隐私政策
    'help/privacy_policy': () => import('@/views/privacyPolicy/privacyPolicy'),
    // 信用分规则
    'help/credit_rule': () => import('@/views/creditRule/creditRule'),
    // 支付二维码
    'recharge/qr_code_list': () => import('@/views/rechargeQrCode/list'),
    // 用户信用分列表
    'user_credit/list': () => import('@/views/userCredit/list'),
    // 国家列表
    'country/list': () => import('@/views/country/list'),
    // 语言列表
    'language/list': () => import('@/views/language/list'),
    // 国家银行卡列表
    'country_bank/list': () => import('@/views/countryBank/list'),
    // 国家区号列表
    'country_code/list': () => import('@/views/countryCode/list'),
    // 轮播列表
    'banner/list': () => import('@/views/banner/list'),
    // 用户发布任务列表
    'task_audit/list': () => import('@/views/taskAudit/list'),
    // ip黑名单列表
    'ip_black/list': () => import('@/views/ipBlackList/list'),
    // 新手教学视频
    'novice_teaching/list': () => import('@/views/video/list'),
    // 邀请函列表
    'invitation/list': () => import('@/views/invitation/list'),
    // 在线充值记录
    'online_recharge/list': () => import('@/views/onlineRecharge/list'),
    // csv列表
    'csv/list': () => import('@/views/csv/list'),
    // 首页弹窗
    'home_pop_up/list': () => import('@/components/homePopUp/FormModal'),
    // 代付列表
    'defray/list': () => import('@/views/defray/list'),
    // 银行编码列表
    'country_bank_code/list': () => import('@/views/countryBankCode/list'),
    // 客服页
    'dashboard/customer_service': () => import('@/views/dashboard/customerService'),
    // 提现规则1
    'withdrawal/rule1': () => import('@/views/withdrawalRule1/list'),
    // 余额宝
    'yuebao/account': () => import('@/views/manageFinance/account'),
    // 理财产品
    'mf/product': () => import('@/views/manageFinance/product'),
    // 理财订单
    'mf/order': () => import('@/views/manageFinance/order')
}

// 404路由
const notFoundRouter = {
    path: '*',
    redirect: '/error/404',
    hidden: true
}

// 根菜单
const rootRouter = {
    key: '',
    name: 'index',
    path: '',
    component: 'BasicLayout',
    redirect: '/dashboard/workplace',
    meta: { title: 'home' },
    children: []
}

/**
 * 数组转树形结构
 * @param list 源数组
 * @param tree 树
 * @param parentId 父ID
 */
const listToTree = (list, tree, parentId) => {
    list.forEach((item) => {
        // 判断是否为父级菜单
        if (item.parent_id === parentId) {
            const child = {
                ...item,
                key: item.key || item.name,
                children: []
            }
            // 迭代 list， 找到当前菜单相符合的所有子菜单
            listToTree(list, child.children, item.id)
            // 删掉不存在 children 值的属性
            if (child.children.length <= 0) {
                delete child.children
            }
            // 加入到树中
            tree.push(child)
        }
    })
}

/**
 * 格式化树形结构数据 生成 vue-router 层级路由表
 *
 * @param routerMap
 * @param parent
 * @returns {*}
 */
export const generator = (routerMap, parent) => routerMap.map((item) => {
    const currentRouter = {
        // 如果路由设置了 path，则作为默认 path，否则 路由地址 动态拼接生成如 /dashboard/workplace
        path: (item.path && item.path.substring(0, 1) === '/') || `${(parent && parent.path) || ''}/${item.path}`,
        name: item.name,
        // 组件
        component: constantRouterComponents[item.component] || RouteView,
        meta: {
            title: item.name,
            icon: item.icon,
            target: item.target,
            left_show: item.left_show,
            actions: item.actions
        }
    }
    // 为了防止出现后端返回结果不规范，处理有可能出现拼接出两个 反斜杠
    if (!currentRouter.path.startsWith('http')) {
        currentRouter.path = currentRouter.path.replace('//', '/')
    }

    // 重定向
    // eslint-disable-next-line no-unused-expressions
    item.redirect && (currentRouter.redirect = item.redirect)

    // 是否有子菜单，并递归处理
    if (item.children && item.children.length > 0) {
        currentRouter.children = generator(item.children, currentRouter)
    }

    return currentRouter
})

export const generatorDynamicRouter = () => new Promise((resolve, reject) => {
    loginService.getMenu().then((res) => {
        const { result } = res
        const menuNav = []
        const childrenNav = []
        listToTree(result, childrenNav, 0)
        rootRouter.children = childrenNav
        menuNav.push(rootRouter)
        const routers = generator(menuNav)
        routers.push(notFoundRouter)
        resolve({ routers })
    }).catch((err) => {
        reject(err)
    })
})

export {
    constantRouterComponents
}
