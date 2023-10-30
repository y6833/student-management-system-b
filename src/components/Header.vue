<template>
  <div class="header">
    <div style="flex: 1; font-size: 20px">
      <span
        :class="collapseBtnClass"
        style="cursor: pointer"
        @click="callParentFunction"
      ></span>

      <!-- 页签 -->

      <el-breadcrumb
      class="breadcrumb"
        separator="/"
      >
        <el-breadcrumb-item :to="'/'">首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{ currentPathName }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <el-dropdown style="width: 100px; cursor: pointer">
      <div style="display: inline-block">
        <img :src="user.avatar == null ? defaultAvatar : user.avatar" alt="" class="useravatar" />
        <span>{{ user.name }}</span>
        <i class="el-icon-arrow-down" style="margin-left: 5px"></i>
      </div>

      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>
          <router-link to="/person" style="text-decoration: none">
            个人信息
          </router-link>
        </el-dropdown-item>
        <el-dropdown-item>
          <span style="text-decoration: none" @click="logout">退出</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
export default {
  name: "Header",
  props: {
    collapseBtnClass: String,
    collapse: Boolean,
  },
  data() {
    return {
      // currentPathName:''
      defaultAvatar: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
      user: localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))
        : {},
    };
  },
  watch: {
    // '$route':function(){
    //   this.currentPathName = localStorage.getItem('currentPathName')
    // }

    currentPathName(newVal, oldVal) {
      console.log(newVal);
    },
  },
  computed: {
    currentPathName() {
      return this.$store.state.currentPathName; //需要监听的数据
    },
  },
  methods: {
    callParentFunction() {
      this.$emit("callParentFunction"); //调用父组件的方法
    },
    logout() {
      this.$router.push("/login");
      localStorage.removeItem("user");
      this.$message.success("退出成功");
    },
  },
};
</script>

<style scoped>
.header{
  line-height: 60px;
  display: flex
}
.breadcrumb{
  display: inline-block;
   margin-left: 10px
}
.useravatar {
  width: 30px;
  position: relative;
  top: 10px;
  right: 10px;
  height: 30px;
  border-radius: 50%;
}
</style>