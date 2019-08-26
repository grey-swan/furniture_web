import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRouters = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  }

  // 404 page must be placed at the end !!!
  // { path: '*', redirect: '/404', hidden: true }
]

export const asyncRouters = [
  {
    path: '/admin',
    component: Layout,
    redirect: '/admin/category/list',
    name: 'Admin',
    meta: { title: '系统管理', icon: 'system', roles: ['super', 'staff'] },
    children: [
      {
        path: 'category/list',
        name: 'AdminCategoryList',
        component: () => import('@/views/admin/category/list'),
        meta: { title: '物品分类', roles: ['super', 'staff'] }
      },
      {
        path: 'category/edit',
        component: () => import('@/views/admin/category/edit'),
        name: 'AdminCategoryEdit',
        meta: { title: '物品分类', roles: ['super', 'staff'] },
        hidden: true
      },
      {
        path: 'style/list',
        name: 'AdminStyleList',
        component: () => import('@/views/admin/style/list'),
        meta: { title: '风格分类', roles: ['super', 'staff'] }
      },
      {
        path: 'style/edit',
        component: () => import('@/views/admin/style/edit'),
        name: 'AdminStyleEdit',
        meta: { title: '风格分类', roles: ['super', 'staff'] },
        hidden: true
      },
      {
        path: 'furniture/list',
        name: 'AdminFurnitureList',
        component: () => import('@/views/admin/furniture/list'),
        meta: { title: '家具管理', roles: ['super', 'staff'] }
      },
      {
        path: 'furniture/edit',
        component: () => import('@/views/admin/furniture/edit'),
        name: 'AdminFurnitureEdit',
        meta: { title: '家具编辑', roles: ['super', 'staff'] },
        hidden: true
      },
      {
        path: 'case/list',
        name: 'AdminCaseList',
        component: () => import('@/views/admin/case/list'),
        meta: { title: '案例管理', roles: ['super', 'staff'] }
      },
      {
        path: 'case/edit',
        component: () => import('@/views/admin/case/edit'),
        name: 'AdminCaseEdit',
        meta: { title: '案例编辑', roles: ['super', 'staff'] },
        hidden: true
      },
      {
        path: 'soft/detail',
        name: 'AdminSoftDetail',
        component: () => import('@/views/admin/soft/detail'),
        meta: { title: '软装管理', roles: ['super', 'staff'] }
      },
      {
        path: 'soft/edit',
        component: () => import('@/views/admin/soft/edit'),
        name: 'AdminSoftEdit',
        meta: { title: '全屋软装搭配编辑', roles: ['super', 'staff'] },
        hidden: true
      },
      {
        path: 'designer/list',
        name: 'AdminDesignerList',
        component: () => import('@/views/admin/designer/list'),
        meta: { title: '设计师管理', roles: ['super', 'staff'] }
      },
      {
        path: 'designer/edit',
        component: () => import('@/views/admin/designer/edit'),
        name: 'AdminDesignerEdit',
        meta: { title: '设计师编辑', roles: ['super', 'staff'] },
        hidden: true
      },
      {
        path: 'banner/list',
        name: 'AdminBannerList',
        component: () => import('@/views/admin/banner/list'),
        meta: { title: '广告位管理', roles: ['super', 'staff'] }
      },
      {
        path: 'banner/edit',
        component: () => import('@/views/admin/banner/edit'),
        name: 'AdminBannerEdit',
        meta: { title: '广告位编辑', roles: ['super', 'staff'] },
        hidden: true
      },
      {
        path: 'company/detail',
        name: 'AdminCompanyDetail',
        component: () => import('@/views/admin/company/detail'),
        meta: { title: '公司介绍', roles: ['super', 'staff'] }
      },
      {
        path: 'company/edit',
        component: () => import('@/views/admin/company/edit'),
        name: 'AdminCompanyEdit',
        meta: { title: '公司介绍编辑', roles: ['super', 'staff'] },
        hidden: true
      }
    ]
  },
  {
    path: '/order',
    component: Layout,
    redirect: '/order/list',
    name: 'Order',
    meta: { title: '订单管理', icon: 'form', roles: ['super', 'staff'] },
    children: [
      {
        path: 'list',
        name: 'OrderList',
        component: () => import('@/views/order/list'),
        meta: { title: '订单管理', roles: ['super', 'staff'] }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouters
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
