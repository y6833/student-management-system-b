<template>
  <el-menu
    :default-active="$route.path"
    class="aside-menu"
    background-color="#ffffff"
    text-color="#303133"
    active-text-color="#409EFF"
    :collapse="isCollapse"
    :router="true"
  >
    <div class="menu-header">
      <div class="user-profile" @click="goToProfile">
        <el-avatar 
          :size="isCollapse ? 40 : 60"
          :src="user.avatar || defaultAvatar"
          class="user-avatar"
        ></el-avatar>
        <div class="user-info" v-if="!isCollapse">
          <h3>{{ user.username || '未知用户' }}</h3>
          <span class="user-role">{{ getRoleName }}</span>
        </div>
      </div>
    </div>

    <el-menu-item index="/home">
      <i class="el-icon-s-home"></i>
      <span slot="title">首页</span>
    </el-menu-item>

    <el-submenu index="/user" v-if="user.roleName <= 2">
      <template slot="title">
        <i class="el-icon-user"></i>
        <span>人员管理导航</span>
      </template>
      <el-menu-item index="/student" v-if="user.roleName < 4">学生管理</el-menu-item>
      <el-menu-item index="/teacher" v-if="user.roleName < 3">教师管理</el-menu-item>
      <el-menu-item index="/admin" v-if="user.roleName < 2">管理员管理</el-menu-item>
    </el-submenu>

    <el-submenu index="/edu" v-if="user.roleName <= 3">
      <template slot="title">
        <i class="el-icon-menu"></i>
        <span>功能管理导航</span>
      </template>
      <template v-if="user.roleName < 4">
        <el-menu-item index="/scores">学生成绩管理</el-menu-item>
        <el-menu-item index="/examination">考试管理</el-menu-item>
      </template>
      <template v-if="user.roleName < 3">
        <el-menu-item index="/major">专业管理</el-menu-item>
        <el-menu-item index="/schedules">课表管理</el-menu-item>
        <el-menu-item index="/courses">课程管理</el-menu-item>
        <el-menu-item index="/class">班级管理</el-menu-item>
        <el-menu-item index="/file" v-if="user.roleName < 2">文件管理</el-menu-item>
      </template>
    </el-submenu>

    <el-submenu index="/permission" v-if="user.roleName < 2">
      <template slot="title">
        <i class="el-icon-setting"></i>
        <span>权限管理导航</span>
      </template>
      <el-menu-item index="/userPermission">用户权限管理</el-menu-item>
    </el-submenu>

    <el-menu-item index="/person">
      <i class="el-icon-setting"></i>
      <span slot="title">个人中心</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: "Aside",
  data() {
    return {
      defaultAvatar: "http://localhost:9001/sms/file/9df4588dcb844f63b657dd6b95f9379a.jpg",
      isCollapse: false,
      user: localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))
        : {},
    };
  },
  computed: {
    getRoleName() {
      switch (this.user.roleName) {
        case 1:
          return '系统管理员';
        case 2:
          return '管理员';
        case 3:
          return '教师';
        default:
          return '未知角色';
      }
    }
  },
  created() {
    // 监听窗口大小变化
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  },
  beforeDestroy() {
    // 移除监听器
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    handleResize() {
      this.isCollapse = window.innerWidth <= 768;
    },
    goToProfile() {
      this.$router.push('/person');
    }
  }
};
</script>

<style scoped>
.aside-menu {
  height: 100vh;
  border-right: 1px solid #e6e6e6;
}

.menu-header {
  padding: 20px;
  border-bottom: 1px solid #f0f2f5;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 15px;
  cursor: pointer;
  padding: 10px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.user-profile:hover {
  background: #f5f7fa;
}

.user-avatar {
  border: 2px solid #e6e6e6;
  transition: all 0.3s ease;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-info h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role {
  font-size: 12px;
  color: #909399;
}

.el-menu-item {
  height: 50px;
  line-height: 50px;
  padding: 0 20px !important;
}

.el-submenu__title {
  height: 50px;
  line-height: 50px;
  padding: 0 20px !important;
}

.el-menu-item i,
.el-submenu__title i {
  color: #909399;
  margin-right: 10px;
  font-size: 18px;
  transition: all 0.3s;
}

.el-menu-item:hover i,
.el-submenu__title:hover i {
  color: #409EFF;
}

.el-menu-item.is-active {
  background: #ecf5ff !important;
}

.el-menu-item.is-active i {
  color: #409EFF;
}

/* 添加动画效果 */
.el-menu-item,
.el-submenu__title {
  transition: all 0.3s ease;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .aside-menu {
    width: 64px !important;
  }

  .menu-header {
    padding: 10px;
  }

  .user-profile {
    justify-content: center;
    padding: 5px;
  }
}
</style>