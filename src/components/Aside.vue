<template>
  <el-menu
    :default-openeds="['1', '3']"
    style="min-height: 100%; overflow-x: hidden"
    background="linear-gradient(to right, white, blue)"
    text-color="#000"
    active-text-color="#68DEF8"
    :collapse-transition="false"
    :collapse="isCollapse"
    class="el-menu-vertical-demo"
    router
    @select="handleSelect"
  >
    <div style="height: 60px; line-height: 60px; text-align: center">
      <img
        src="@/assets/logo.png"
        style="width: 20px; position: relative; top: 5px"
      />
      <b style="color: #000; margin-left: 5px" v-show="logoTextShow"
        >视教学习管理系统</b
      >
    </div>

    <el-menu-item index="/home">
      <i class="el-icon-house"></i>
      <template slot="title">
        <span slot="title">主页</span>
      </template>
    </el-menu-item>

    <el-submenu index="1">
      <template slot="title"
        ><i class="el-icon-user-solid"></i>
        <span slot="title">人员管理导航</span>
      </template>
      <el-menu-item-group>
        <el-menu-item index="/student" v-if="role < 4">学生管理</el-menu-item>
        <el-menu-item index="/teacher" v-if="role < 3">教师管理</el-menu-item>
        <el-menu-item index="/admin" v-if="role < 2">管理员管理</el-menu-item>
      </el-menu-item-group>
    </el-submenu>
    <el-submenu index="2">
      <template slot="title"
        ><i class="el-icon-menu"></i
        ><span slot="title">功能管理导航</span></template
      >
      <el-menu-item-group>
        <template slot="title" v-if="role < 4">教师管理区</template>
        <el-menu-item index="/scores">学生成绩管理</el-menu-item>
        <el-menu-item index="/examination">考试管理</el-menu-item>
        <!-- <el-menu-item index="2-2">各科题型管理</el-menu-item>
        <el-menu-item index="2-3">学生各科题型成绩管理</el-menu-item> -->
      </el-menu-item-group>
      <el-menu-item-group title="管理员管理" v-if="role < 3">
        <el-menu-item index="/major">专业管理</el-menu-item>
        <el-menu-item index="/schedules">课表管理</el-menu-item>
        <el-menu-item index="/courses">课程管理</el-menu-item>
        <el-menu-item index="/class">班级管理</el-menu-item>
        <el-menu-item index="/file">文件管理</el-menu-item>
      </el-menu-item-group>
    </el-submenu>
    <el-submenu index="3" v-if="role < 3">
      <template slot="title"
        ><i class="el-icon-setting"></i>
        <span slot="title">权限管理导航</span></template
      >
      <el-menu-item-group>
        <el-menu-item index="/userPermission">用户权限管理</el-menu-item>
      </el-menu-item-group>
    </el-submenu>
  </el-menu>
</template>


<script>
export default {
  name: "Aside",
  props: {
    logoTextShow: Boolean,
    isCollapse: Boolean,
  },
  data() {
    return {
      user: localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))
        : {},
      role: 10,
    };
  },
  created() {
    this.role = this.user.roleName;
  },
  methods: {
    handleSelect(index) {
      // console.log(index);
    },
  },
};
</script>

<style scoped>
.el-menu {
  border-right: solid 1px #fff;
}
</style>