<template>
  <el-menu
    :default-openeds="['1', '3']"
    style="min-height: 100%; overflow-x: hidden"
    background-color="rgb(48, 65, 86)"
    text-color="#fff"
    active-text-color="#ffd04b"
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
      <b style="color: #fff; margin-left: 5px" v-show="logoTextShow"
        >视教学习管理系统</b
      >
    </div>

    <el-menu-item index="/">
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
        <el-menu-item index="/student">学生管理</el-menu-item>
        <el-menu-item index="/teacher">教师管理</el-menu-item>
        <el-menu-item index="/admin">管理员管理</el-menu-item>
      </el-menu-item-group>
    </el-submenu>
    <el-submenu index="2">
      <template slot="title"
        ><i class="el-icon-menu"></i
        ><span slot="title">功能管理导航</span></template
      >
      <el-menu-item-group>
        <template slot="title">教师管理区</template>
        <el-menu-item index="/scores">学生成绩管理</el-menu-item>
        <el-menu-item index="/examination">考试管理</el-menu-item>
        <el-menu-item index="2-2">各科题型管理</el-menu-item>
        <el-menu-item index="2-3">学生各科题型成绩管理</el-menu-item>
      </el-menu-item-group>
      <el-menu-item-group title="管理员管理">
        <el-menu-item index="2-4">专业管理</el-menu-item>
        <el-menu-item index="2-5">课程管理</el-menu-item>
        <el-menu-item index="2-6">班级管理</el-menu-item>
        <el-menu-item index="/file">文件管理</el-menu-item>
      </el-menu-item-group>
    </el-submenu>
    <el-submenu index="3">
      <template slot="title"
        ><i class="el-icon-setting"></i>
        <span slot="title">权限管理导航</span></template
      >
      <el-menu-item-group>
        <el-menu-item index="3-1">用户权限管理</el-menu-item>
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
  methods: {
    handleSelect(index) {
      // console.log(index);
    },
  },
};
</script>

<style scoped>
</style>