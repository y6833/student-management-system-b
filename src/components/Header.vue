<template>
  <div class="header">
    <div class="header-left">
      <span
        :class="collapseBtnClass"
        class="collapse-btn"
        @click="callParentFunction"
      ></span>

      <el-breadcrumb class="breadcrumb" separator="/">
        <el-breadcrumb-item :to="'/'">首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{ currentPathName }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <el-dropdown class="user-dropdown">
      <div class="user-info">
        <img :src="user.avatar == null ? defaultAvatar : user.avatar" alt="" class="useravatar" />
        <span class="username">{{ user.name }}</span>
        <i class="el-icon-arrow-down"></i>
      </div>

      <el-dropdown-menu slot="dropdown" class="dropdown-menu">
        <el-dropdown-item>
          <router-link to="/person" class="dropdown-link">
            <i class="el-icon-user"></i> 个人信息
          </router-link>
        </el-dropdown-item>
        <el-dropdown-item>
          <span class="dropdown-link" @click="logout">
            <i class="el-icon-switch-button"></i> 退出
          </span>
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
      // console.log(newVal);
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

<style lang="scss" scoped>
.header {
  height: 64px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 999;
}

.header-left {
  display: flex;
  align-items: center;
  height: 100%;
  padding-left: 20px;
}

.collapse-btn {
  width: 44px;
  height: 44px;
  line-height: 44px;
  text-align: center;
  font-size: 18px;
  cursor: pointer;
  color: #666;
  transition: all 0.3s;
  border-radius: 8px;
  
  &:hover {
    color: #1890ff;
    background: rgba(24, 144, 255, 0.1);
  }
}

.breadcrumb {
  display: inline-block;
  margin-left: 8px;
  
  ::v-deep .el-breadcrumb__inner {
    color: #666;
    font-size: 14px;
    
    &.is-link {
      color: #1890ff;
      font-weight: 500;
      
      &:hover {
        color: #40a9ff;
      }
    }
  }
}

.user-dropdown {
  height: 100%;
  padding-right: 16px;
}

.user-info {
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 8px;
  transition: all 0.3s;
  
  &:hover {
    background: rgba(0, 0, 0, 0.02);
  }
  
  .useravatar {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    margin-right: 10px;
    border: 2px solid #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s;
    
    &:hover {
      transform: scale(1.05);
    }
  }
  
  .username {
    font-size: 14px;
    color: #333;
    margin-right: 4px;
    font-weight: 500;
  }
  
  .el-icon-arrow-down {
    font-size: 12px;
    color: #999;
    margin-left: 4px;
    transition: all 0.3s;
  }
  
  &:hover .el-icon-arrow-down {
    transform: rotate(180deg);
  }
}

.dropdown-menu {
  margin: 5px 0 0 0 !important;
  padding: 4px !important;
  border-radius: 8px !important;
  border: none !important;
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.1) !important;
  
  ::v-deep .el-dropdown-menu__item {
    padding: 8px 16px !important;
    border-radius: 6px;
    margin: 2px 0;
    
    &:hover {
      background: rgba(24, 144, 255, 0.1) !important;
    }
  }
  
  .dropdown-link {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: #333;
    font-size: 14px;
    
    i {
      margin-right: 8px;
      font-size: 16px;
      color: #666;
    }
    
    &:hover {
      color: #1890ff;
      
      i {
        color: #1890ff;
      }
    }
  }
}
</style>