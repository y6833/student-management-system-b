import Vue from 'vue'
import VueRouter from 'vue-router'
import store from "@/store"

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('../views/Manage.vue'),
    redirect: "/home",
    children: [
      { path: 'home', name: '首页', component: () => import('../views/Home.vue')},
      { path: 'user', name: '个人信息', component: () => import('../views/User.vue')},
      { path: 'person', name: '个人信息', component: () => import('../views/Person.vue')},
      { path: 'password', name: '修改密码', component: () => import('../views/Password.vue')},
      { path: 'student', name: '学生管理', component: () => import('../views/Student.vue')},
      { path: 'teacher', name: '教师管理', component: () => import('../views/Teacher.vue')},
      { path: 'admin', name: '管理员管理', component: () => import('../views/Admin.vue')},
      { path: 'schedules', name: '课表管理', component: () => import('../views/Schedule.vue')},
      { path: 'courses', name: '课程管理', component: () => import('../views/Course.vue')},
      { path: 'class', name: '班级管理', component: () => import('../views/Class.vue')},
      { path: 'major', name: '专业管理', component: () => import('../views/Major.vue')},
      { path: 'file', name: '文件管理', component: () => import('../views/Files.vue')},
      { path: 'role', name: '角色管理', component: () => import('../views/Role.vue')},
      { path: 'menu', name: '菜单管理', component: () => import('../views/Menu.vue')},
      { path: 'dashboard', name: '数据看板', component: () => import('../views/Dashboard.vue')},
      { path: 'chat', name: 'AI助手', component: () => import('../views/chat/index.vue')},
    ]
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  localStorage.setItem("currentPathName", to.name)  // 设置当前的路由名称，为了在Header组件中去使用
  store.commit("setPath")  // 触发store的数据更新
  next()  // 放行路由
})

export default router
