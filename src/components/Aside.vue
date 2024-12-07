&lt;template>
  <el-menu :default-openeds="['1', '2', '3']" style="min-height: 100vh; overflow-x: hidden"
           background-color="rgb(48, 65, 86)"
           text-color="#fff"
           active-text-color="#ffd04b"
           :collapse-transition="false"
           :collapse="isCollapse"
           router
           @select="handleSelect"
  >
    <div style="height: 60px; line-height: 60px; text-align: center">
      <img src="../assets/logo.png" alt="" style="width: 20px; position: relative; top: 5px; margin-right: 5px">
      <b style="color: white" v-show="!isCollapse">学生管理系统</b>
    </div>
    <el-menu-item index="/home">
      <template slot="title">
        <i class="el-icon-house"></i>
        <span slot="title">主页</span>
      </template>
    </el-menu-item>

    <el-submenu index="2" v-if="user.roleName <= 4">
      <template slot="title">
        <i class="el-icon-user"></i>
        <span>人员管理导航</span>
      </template>
      <el-menu-item index="/student" v-if="user.roleName < 4">学生管理</el-menu-item>
      <el-menu-item index="/teacher" v-if="user.roleName < 3">教师管理</el-menu-item>
      <el-menu-item index="/admin" v-if="user.roleName < 2">管理员管理</el-menu-item>
    </el-submenu>

    <el-submenu index="3" v-if="user.roleName <= 3">
      <template slot="title">
        <i class="el-icon-menu"></i>
        <span>功能管理导航</span>
      </template>
      <template>
        <el-menu-item index="/major">专业管理</el-menu-item>
        <el-menu-item index="/schedules">课表管理</el-menu-item>
        <el-menu-item index="/courses">课程管理</el-menu-item>
        <el-menu-item index="/class">班级管理</el-menu-item>
        <el-menu-item index="/file" v-if="user.roleName < 2">文件管理</el-menu-item>
        <el-menu-item index="/dashboard" v-if="user.roleName < 3">数据看板</el-menu-item>
        <el-menu-item index="/chat">AI助手</el-menu-item>
      </template>
    </el-submenu>

    <el-submenu index="4" v-if="user.roleName < 2">
      <template slot="title">
        <i class="el-icon-setting"></i>
        <span>系统管理</span>
      </template>
      <el-menu-item index="/role">角色管理</el-menu-item>
      <el-menu-item index="/menu">菜单管理</el-menu-item>
    </el-submenu>

  </el-menu>
</template>

<script>
export default {
  name: "Aside",
  props: {
    isCollapse: Boolean,
    logoTextShow: Boolean
  },
  data() {
    return {
      user: JSON.parse(localStorage.getItem('user'))
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>

<style scoped>
.el-menu {
  border-right: none;
}
</style>