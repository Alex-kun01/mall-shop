import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '../components/Login.vue'

// 懒加载引入模式
const Login = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Login.vue')
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Home.vue')
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ '../page/welcome.vue')

const Users = () => import(/* webpackChunkName: "users_roles_rights" */ '../page/user/users.vue')
const Roles = () => import(/* webpackChunkName: "users_roles_rights" */ '../page/power/roles.vue')
const Rights = () => import(/* webpackChunkName: "users_roles_rights" */ '../page/power/rights.vue')

const Categories = () => import(/* webpackChunkName: "cate_params" */ '../page/goods/categories.vue')
const Params = () => import(/* webpackChunkName: "cate_params" */ '../page/goods/params.vue')

const Orders = () => import(/* webpackChunkName: "orders_goods" */ '../page/order/orders.vue')
const Goods = () => import(/* webpackChunkName: "orders_goods" */ '../page/goods/goods.vue')

const AddGood = () => import(/* webpackChunkName: "addgoods_reports" */ '../page/goods/Add.vue')
const Reports = () => import(/* webpackChunkName: "addgoods_reports" */ '../page/reports/reports.vue')

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/home',
      name: 'hemo',
      component: Home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/users', component: Users },
        { path: '/roles', component: Roles },
        { path: '/rights', component: Rights },
        { path: '/reports', component: Reports },
        { path: '/params', component: Params },
        { path: '/orders', component: Orders },
        { path: '/goods', component: Goods },
        { path: '/categories', component: Categories },
        { path: '/goods/add', component: AddGood }
      ]
    }
  ]
})
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  else {
    const tokenStr = window.sessionStorage.getItem('token')
    if (!tokenStr) {
      const key = window.confirm('您没有登陆，是否去登陆？')
      if (!key) {
        return
      }
      next('/login')
    }
    next()
  }
})

export default router
