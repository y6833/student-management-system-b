import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store/index.js'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('../views/Manage.vue'),
    redirect: "/login",
    children: [
      {
        path: 'student',
        name: '学生管理',
        component: () => import('../views/UserManagement/Student.vue'),
      }, {
        path: 'teacher',
        name: '教师管理',
        component: () => import('../views/UserManagement/Teacher.vue'),
      }, {
        path: 'admin',
        name: '管理员管理',
        component: () => import('../views/UserManagement/Admin.vue'),
      },
      {
        path: 'scores',
        name: '学生成绩管理',
        component: () => import('../views/TeacherManagement/Scores.vue'),
      },
      {
        path: 'scores_grade',
        name: '年级成绩看板',
        component: () => import('../views/TeacherManagement/ScoresGrade.vue'),
      },
      {
        path: 'scores_class',
        name: '班级成绩看板',
        component: () => import('../views/TeacherManagement/ScoresClass.vue'),
      },
      {
        path: 'scores_student',
        name: '学生成绩看板',
        component: () => import('../views/TeacherManagement/ScoresStudent.vue'),
      },
      {
        path: 'examination',
        name: '考试信息管理',
        component: () => import('../views/TeacherManagement/examination.vue'),
      }
      , {
        path: 'person',
        name: '个人信息',
        component: () => import('../views/UserManagement/Person.vue'),
      }, {
        path: 'home',
        name: '首页',
        component: () => import('../views/Home.vue'),
      }, {
        path:'file',
        name:'文件管理',
        component:()=>import('../views/AdminManagement/Files.vue')
      }, {
        path:'class',
        name:'班级管理',
        component:()=>import('../views/AdminManagement/Class.vue')
      }, {
        path:'major',
        name:'专业管理',
        component:()=>import('../views/AdminManagement/Major.vue')
      }, {
        path:'courses',
        name:'课程管理',
        component:()=>import('../views/AdminManagement/Courses.vue')
      },{
        path:'schedules',
        name:'课表管理',
        component:()=>import('../views/AdminManagement/Schedules.vue')
      }, {
        path:'userPermission',
        name:'用户权限管理',
        component:()=>import('../views/AuthorityManagement/UserPermission.vue')
      },{
        path:'chat',
        name:'AI聊天',
        component:()=>import('../views/chat/index.vue')
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
