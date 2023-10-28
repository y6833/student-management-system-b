import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store/index.js'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('../views/Manage.vue'),
    redirect: "/home",
    children: [
      {
        path: 'student',
        name: '学生管理',
        component: () => import('../views/Student.vue'),
      }, {
        path: 'teacher',
        name: '教师管理',
        component: () => import('../views/Teacher.vue'),
      }, {
        path: 'admin',
        name: '管理员管理',
        component: () => import('../views/Admin.vue'),
      }, {
        path: 'home',
        name: '首页',
        component: () => import('../views/Home.vue'),
      }
    ]
  }, {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  localStorage.setItem('currentPathName', to.name)  //设置当前路由名称,为了在Header组件中区使用
  store.commit("setPath") //触发store的数据更新
  next() //放行路由
})

export default router
