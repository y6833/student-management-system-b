<template>
  <div style="line-height: 60px; display: flex;"> 
    <div
      style="flex: 1;  font-size: 20px;"
    >
      <span
        :class="collapseBtnClass"
        style="cursor: pointer;"
        @click="callParentFunction"
      ></span>

          <!-- 页签 -->

      <el-breadcrumb separator="/" style="display:inline-block; margin-left:10px ;">
        <el-breadcrumb-item :to="'/'">首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{currentPathName}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-dropdown style="width: 70px; cursor: pointer">
      <span>{{ '王小虎' }}</span
      ><i class="el-icon-arrow-down" style="margin-left: 5px"></i>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>个人信息</el-dropdown-item>
        <el-dropdown-item>退出</el-dropdown-item>
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
  data(){
    return{
        // currentPathName:''
    }
  },
  watch:{
    // '$route':function(){
    //   this.currentPathName = localStorage.getItem('currentPathName')
    // }

    currentPathName (newVal, oldVal) {
      console.log(newVal);
    }
  },
  computed:{
    currentPathName (){
      return this.$store.state.currentPathName //需要监听的数据
    },

  },
  methods: {
    callParentFunction(){
      this.$emit('callParentFunction'); //调用父组件的方法
    }
  }

};
</script>

<style scoped>
</style>